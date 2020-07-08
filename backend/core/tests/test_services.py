import random
import random
import sys

from core.models import ResultsTableEntry
from core.services import raffle_results_service
from core.tests.test_fixtures import *


class TestRaffleResultsService:

    def test_shuffle_list(self):
        original_list_1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        original_list_2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        seed = random.randint(0, sys.maxsize)
        shuffled_list_1 = raffle_results_service._shuffle_list(original_list_1, seed)
        shuffled_list_2 = raffle_results_service._shuffle_list(original_list_2, seed)

        assert shuffled_list_1 == shuffled_list_2

    @pytest.mark.django_db
    def test_remaining_participants(self, raffle_with_participants):
        raffle = raffle_with_participants.raffle
        remaining_participants = raffle_with_participants.remaining_participants
        calculated_remaining_participants = raffle_results_service._get_remaining_participants(raffle)

        compare = lambda x, y: collections.Counter(x) == collections.Counter(y)
        assert compare(remaining_participants, calculated_remaining_participants)

    @pytest.mark.django_db
    def test_save_new_results_table_entries(self, raffle_with_participants):
        raffle = raffle_with_participants.raffle
        remaining_participants = raffle_with_participants.remaining_participants
        block_data = baker.make("core.BlockData")
        raffle_results_service._save_new_results_table_entries(
            raffle.results_table, remaining_participants, slicing_percentage=0.5, block_data=block_data
        )
        table_entries_count = ResultsTableEntry.objects.filter(results_table=raffle.results_table).count()
        raffle_participants_count = raffle.participants.count()
        assert table_entries_count == raffle_participants_count
