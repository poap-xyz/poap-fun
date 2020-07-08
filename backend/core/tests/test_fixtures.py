import collections

import pytest
from model_bakery import baker
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
@pytest.mark.django_db
def raffle():
    return baker.make('core.Raffle', name="test raffle")


@pytest.fixture
def raffle_data():
    raffle_data = {
        "name": "test raffle",
        "description": "this is a test raffle used as an example",
        "contact": "info@xivis.com",
        "draw_datetime": "2020-06-14T04:12:36",
        "registration_deadline": "2020-06-14T04:12:36",
        "one_address_one_vote": True,
        "prizes": [
            {
                "name": "test prize 1",
                "order": 1
            },
            {
                "name": "test prize 2",
                "order": 2
            }
        ],
        "events": [
            {
                "event_id": "0x17b987cc21a129",
                "name": "test event 1"
            },
            {
                "event_id": "0x99453cc21aa1a2ff9",
                "name": "test event 2"
            }
        ]
    }
    return raffle_data


@pytest.fixture
@pytest.mark.django_db
def raffle_with_participants():
    RaffleWithParticipants = collections.namedtuple('RaffleWithParticipants', 'raffle remaining_participants')
    raffle = baker.make('core.Raffle')
    participants = baker.make('core.Participant', raffle=raffle, _quantity=6)
    results_table = baker.make('core.ResultsTable', raffle=raffle)

    fixed_participants = participants[:3]
    remaining_participants = participants[3:]
    order = len(participants)
    for participant in fixed_participants:
        table_entry = baker.make(
            'core.ResultsTableEntry',
            participant=participant,
            results_table=results_table,
            order=order
        )
        order -= 1

    return RaffleWithParticipants(raffle, remaining_participants)
