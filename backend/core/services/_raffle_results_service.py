import math
import random
from typing import List, Tuple, Optional

from django.db import transaction
from web3.auto.infura import w3
from web3.exceptions import BlockNotFound

from core.models import Raffle, Participant, ResultsTable, BlockData, ResultsTableEntry


class RaffleResultsService:

    @staticmethod
    def _shuffle_list(input_list: List, seed: int) -> List:
        """
        Given a seed and an input list, shuffles the
        list with the random seed to produce a shuffled list.

        Args:
            seed: The seed to be used.
            input_list: The input list to be shuffled.

        Returns:
            output_list: a shuffled list.
        """
        random.seed(seed)
        random.shuffle(input_list)
        return input_list

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

        results_table = raffle.results_table
        results = results_table.entries
        participants = raffle.participants

        # the initial table state is such that the participants
        # are ordered by the address alphabetically
        participants = participants.order_by("address")

        # calculate fixed participants
        fixed_participants = [result.participant for result in results.all()]

        # get the participants that will be participating in the next slicing
        remaining_participants = []
        for participant in participants:
            if participant not in fixed_participants:
                remaining_participants.append(participant)

        return remaining_participants

    @staticmethod
    def _save_new_results_table_entries(
            results_table: ResultsTable,
            participants: List[Participant],
            slicing_percentage: float,
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
            slicing_percentage:
                number between 0 and 1 representing the % of participants
                that will be saved to the results table
            results_table:
                the results table to which the participants are saved
            block_data:
                the block data that was used to generate the entries

        Returns:
            finished: True if all remaining participants have been set
            in the results table. False if some participants remain
        """
        amount_of_participants = len(participants)
        amount_of_participants_to_be_saved = math.ceil(amount_of_participants*slicing_percentage)
        # if we are placing n-1, then the last one is already the winner
        if amount_of_participants_to_be_saved == amount_of_participants - 1:
            amount_of_participants_to_be_saved = amount_of_participants
        unsaved_participants = participants[-amount_of_participants_to_be_saved:]
        # calculate the starting order
        order = amount_of_participants - amount_of_participants_to_be_saved
        entries = []
        for unsaved_participant in unsaved_participants:
            entry = ResultsTableEntry(
                results_table=results_table,
                participant=unsaved_participant,
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


        finalized = amount_of_participants == amount_of_participants_to_be_saved
        if finalized:
            results_table.raffle.finalized = True
            results_table.raffle.save()
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

        order = prev_block.order + 1 if prev_block else 0
        nonce = raw_block_data.get("nonce")
        seed = int.from_bytes(bytes(nonce), "big")
        block_data = BlockData(
            raffle=raffle,
            nonce=nonce,
            seed=seed,
            block_number=raw_block_data.get("number"),
            order=order
        )

        return block_data

    @classmethod
    def generate_next_result_step(cls, raffle: Raffle, slicing_percentage: float) -> bool:
        """
        Runs a single iteration of the result's table generation process.
        Args:
            raffle:
                the raffle for which the result table is being generated
            slicing_percentage:
                the lower bound percentage of participants that
                are saved as result entries for this iteration

        Returns:

        """

        if raffle.finalized:
            return True

        # get new seed from the chain
        prev_block = BlockData.objects.filter(raffle=raffle).order_by("-order").first()
        block_data = cls._get_block_data(raffle, prev_block)

        results_table = raffle.results_table

        remaining_participants = cls._get_remaining_participants(raffle)

        recombined_remaining_participants = cls._shuffle_list(remaining_participants, block_data.seed)

        finished = cls._save_new_results_table_entries(
            results_table, recombined_remaining_participants, slicing_percentage
        )

        return finished


