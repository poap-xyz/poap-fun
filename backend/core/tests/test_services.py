import random
import random
import sys

from core.models import ResultsTableEntry
from core.services import raffle_results_service
from core.tests.test_fixtures import *


class TestRaffleResultsService:

    @pytest.mark.django_db
    def test_remaining_participants(self, raffle_with_participants):
        raffle = raffle_with_participants.raffle
        remaining_participants = raffle_with_participants.remaining_participants
        calculated_remaining_participants = raffle_results_service._get_remaining_participants(raffle)

        compare = lambda x, y: collections.Counter(x) == collections.Counter(y)
        assert compare(remaining_participants, calculated_remaining_participants)

    @pytest.mark.django_db
    def test_remaining_participants_ordering(self):
        raffle = baker.make('core.Raffle', one_address_one_vote=False)
        baker.make('core.ResultsTable', raffle=raffle)
        participant_1 = baker.make(
            'core.Participant', raffle=raffle, address="0x1", poap_id=11239
        )
        participant_2 = baker.make(
            'core.Participant', raffle=raffle, address="0x2", poap_id=1109
        )
        participant_3 = baker.make(
            'core.Participant', raffle=raffle, address="0x3", poap_id=109
        )
        participant_4 = baker.make(
            'core.Participant', raffle=raffle, address="0x4", poap_id=124
        )
        participant_5 = baker.make(
            'core.Participant', raffle=raffle, address="0x5", poap_id=154
        )
        calculated_remaining_participants = raffle_results_service._get_remaining_participants(raffle)
        assert calculated_remaining_participants[0] == participant_3
        assert calculated_remaining_participants[1] == participant_4
        assert calculated_remaining_participants[2] == participant_5
        assert calculated_remaining_participants[3] == participant_2
        assert calculated_remaining_participants[4] == participant_1

    @pytest.mark.django_db
    def test_remaining_participants_ordering_one_address_one_vote(self):
        raffle = baker.make('core.Raffle', one_address_one_vote=True)
        baker.make('core.ResultsTable', raffle=raffle)
        participant_1 = baker.make(
            'core.Participant', raffle=raffle, address="0x1", poap_id=11239
        )
        participant_2 = baker.make(
            'core.Participant', raffle=raffle, address="0x1", poap_id=1109
        )
        participant_3 = baker.make(
            'core.Participant', raffle=raffle, address="0x3", poap_id=109
        )
        participant_4 = baker.make(
            'core.Participant', raffle=raffle, address="0x4", poap_id=124
        )
        participant_5 = baker.make(
            'core.Participant', raffle=raffle, address="0x5", poap_id=154
        )
        calculated_remaining_participants = raffle_results_service._get_remaining_participants(raffle)
        assert len(calculated_remaining_participants) == 4
        assert calculated_remaining_participants[0] == participant_3
        assert calculated_remaining_participants[1] == participant_4
        assert calculated_remaining_participants[2] == participant_5
        assert calculated_remaining_participants[3] == participant_2

    @pytest.mark.django_db
    def test_save_new_results_table_entries(self):
        raffle = baker.make('core.Raffle')
        baker.make('core.ResultsTable', raffle=raffle)
        participant_1 = baker.make(
            'core.Participant', raffle=raffle, address="0x1", poap_id=109  # poap_id = 109
        )
        participant_2 = baker.make(
            'core.Participant', raffle=raffle, address="0x2", poap_id=1109  # poap_id = 1109
        )
        participant_3 = baker.make(
            'core.Participant', raffle=raffle, address="0x3", poap_id=11239  # poap_id = 11239
        )
        participant_4 = baker.make(
            'core.Participant', raffle=raffle, address="0x4", poap_id=124  # poap_id = 124
        )
        participant_5 = baker.make(
            'core.Participant', raffle=raffle, address="0x5", poap_id=154  # poap_id = 154
        )

        participants = [participant_1, participant_2, participant_3, participant_4, participant_5]

        block_data = baker.make("core.BlockData", gas_limit=109)
        raffle_results_service._save_new_results_table_entries(
            raffle.results_table, participants, block_data=block_data
        )
        table_entries_count = ResultsTableEntry.objects.filter(results_table=raffle.results_table).count()
        assert table_entries_count == 3

        table_entries = ResultsTableEntry.objects.order_by("order").all()
        assert table_entries[0].order == 2
        assert table_entries[0].participant == participant_1
        assert table_entries[1].order == 3
        assert table_entries[1].participant == participant_2
        assert table_entries[2].order == 4
        assert table_entries[2].participant == participant_3

    @pytest.mark.django_db
    def test_save_new_results_table_entries_empty_slash(self):
        raffle = baker.make('core.Raffle')
        baker.make('core.ResultsTable', raffle=raffle)
        participant_1 = baker.make(
            'core.Participant', raffle=raffle, address="0x1", poap_id=124  # poap_id = 124
        )
        participant_2 = baker.make(
            'core.Participant', raffle=raffle, address="0x2", poap_id=154  # poap_id = 154
        )

        participants = [participant_1, participant_2]

        block_data = baker.make("core.BlockData", gas_limit=109)
        raffle_results_service._save_new_results_table_entries(
            raffle.results_table, participants, block_data=block_data
        )
        table_entries_count = ResultsTableEntry.objects.filter(results_table=raffle.results_table).count()
        assert table_entries_count == 0

    # TODO missing test for one_address_one_vote