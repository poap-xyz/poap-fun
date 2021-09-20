import math
from datetime import datetime
from typing import List, Optional

from django.db import transaction
from web3.auto import w3
from web3.exceptions import BlockNotFound

from core.models import Raffle, Participant, ResultsTable, BlockData, ResultsTableEntry
from notifications.tasks import send_has_ended_raffle_notifications


class RaffleResultsService:

    @staticmethod
    def _get_remaining_participants(raffle: Raffle) -> List[Participant]:
        """
        From a given raffle, gets the participants which have not been
        added to the results table.

        Args:
            raffle:
                The raffle for which the remaining participants must be calculated.

        Returns:
            a list of the participants which have not been set in the results table.
        """
        if not raffle.participants:
            return []

        results_table = raffle.results_table
        results = results_table.entries
        participants = raffle.participants

        # the initial table state is such that the participants
        # are ordered by the address alphabetically
        if raffle.one_address_one_vote:
            participants = participants.order_by("address", "poap_id")
            participants = participants.distinct("address")

        # sort participants by poap id
        participants = sorted(participants.all(), key=lambda p: p.poap_id)

        # calculate fixed participants
        fixed_participants = [result.participant for result in results.all()]

        # get the participants that will be participating in the next slicing
        remaining_participants = []
        for participant in participants:
            if participant not in fixed_participants:
                remaining_participants.append(participant)

        return remaining_participants

    @classmethod
    def _split_by_gas_used(cls, gas_used, participants):

        if not participants:
            return None
        if len(participants) == 1:
            return participants

        eliminated_participants = []
        remaining_participants = []
        valid_split = False
        order = 1
        while not valid_split:
            prev_iteration_digit = None
            comparing_digits_identical = True
            gas_used_last_digit = gas_used % 10
            for participant in participants:
                poap_id = participant.poap_id
                poap_id_cmp_digit = math.floor(poap_id/order) % 10

                if poap_id_cmp_digit == gas_used_last_digit:
                    eliminated_participants.append(participant)
                else:
                    remaining_participants.append(participant)

                if prev_iteration_digit and prev_iteration_digit != poap_id_cmp_digit:
                    comparing_digits_identical = False
                prev_iteration_digit = poap_id_cmp_digit

            if not comparing_digits_identical:
                valid_split = True
            else:
                eliminated_participants = []
                remaining_participants = []
            order *= 10

        prev_address = None
        more_than_one_remaining_participant = False
        for participant in remaining_participants:
            if prev_address and prev_address != participant.address:
                more_than_one_remaining_participant = True
                break
            prev_address = participant.address

        # raffle is already over
        if not more_than_one_remaining_participant:
            eliminated_participants = remaining_participants + eliminated_participants

        return eliminated_participants

    @classmethod
    def _save_new_results_table_entries(
            cls,
            results_table: ResultsTable,
            participants: List[Participant],
            block_data: BlockData
    ) -> bool:
        """
        Saves the bottom % of participants to the results table
        as part of a result slicing iteration.
        If all the participants are set in this iteration, sets
        the ResultsTable.finalized attribute to True

        Args:
            participants:
                pool of participants used
            results_table:
                the results table to which the participants are saved
            block_data:
                the block data that was used to generate the entries

        Returns:
            finished: True if all remaining participants have been set
            in the results table. False if some participants remain
        """
        if not participants or len(participants) == 0:
            results_table.raffle.finalized = True
            results_table.raffle.save()
            send_has_ended_raffle_notifications.delay(results_table.raffle.id)
            return True

        eliminated_participants = cls._split_by_gas_used(block_data.gas_used, participants)

        # calculate the starting order
        order = len(participants) - len(eliminated_participants)
        entries = []
        for eliminated_participant in eliminated_participants:
            entry = ResultsTableEntry(
                results_table=results_table,
                participant=eliminated_participant,
                order=order
            )
            entries.append(entry)
            order += 1
        # we save the entries and create the block data in the same transaction
        # so that we do not have an unused corrupted block data in the database
        # in case something fails between block fetching and result table entry
        # creation
        with transaction.atomic():
            ResultsTableEntry.objects.bulk_create(entries)
            block_data.save()

        finalized = len(participants) == len(eliminated_participants)
        if finalized:
            results_table.raffle.finalized = True
            results_table.raffle.end_datetime = datetime.utcnow()
            results_table.raffle.save()
            send_has_ended_raffle_notifications.delay(results_table.raffle.id)
            from core.emails import send_raffle_results_email
            send_raffle_results_email(results_table.raffle)
        return finalized

    @classmethod
    def _get_block_data(cls, raffle: Raffle, prev_block: BlockData) -> Optional[BlockData]:
        """
        Gets block data from the chain

        Returns:
            if the block returned from the blockchain equals the prev_block then none
            else returns a BlockData instance with the current block
        """
        try:
            if prev_block:
                raw_block_data = w3.eth.getBlock(prev_block.block_number+1)
            else:
                raw_block_data = w3.eth.getBlock('latest')
        except BlockNotFound:
            return None

        next_block_number = raw_block_data.get("number")
        next_block_timestamps = raw_block_data.get("timestamp")
        next_gas_used = raw_block_data.get("gasUsed")
        q = BlockData.objects.filter(
            raffle=raffle,
            block_number=next_block_number,
            timestamp=next_block_timestamps,
            gas_used=next_gas_used
        )
        if q.exists():
            return None

        order = prev_block.order + 1 if prev_block else 0
        block_data = BlockData(
            raffle=raffle,
            gas_used=next_gas_used,
            block_number=next_block_number,
            timestamp=next_block_timestamps,
            order=order
        )

        return block_data

    @classmethod
    def generate_next_result_step(cls, raffle: Raffle) -> bool:
        """
        Runs a single iteration of the result's table generation process.
        Args:
            raffle:
                the raffle for which the result table is being generated

        Returns:

        """

        if raffle.finalized:
            return True

        # get new seed from the chain
        prev_block = BlockData.objects.filter(raffle=raffle).order_by("-order").first()
        block_data = cls._get_block_data(raffle, prev_block)

        if not block_data:
            return False

        results_table, _ = ResultsTable.objects.get_or_create(raffle=raffle)

        remaining_participants = cls._get_remaining_participants(raffle)

        finished = cls._save_new_results_table_entries(
            results_table, remaining_participants, block_data
        )

        return finished

