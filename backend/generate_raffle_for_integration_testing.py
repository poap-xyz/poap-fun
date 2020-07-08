from core.models import Raffle, Participant

raffle_data = {
    "name": "test integration raffle",
    "description": "this is a test raffle used as an example",
    "contact": "info@xivis.com",
    "draw_datetime": "2020-06-14T04:12:36",
    "registration_deadline": "2020-06-14T04:12:36",
    "one_address_one_vote": True,
}
raffle = Raffle.objects.create(**raffle_data)
participant_1 = Participant.objects.create(
    address="0x01",
    raffle=raffle,
    poap_id="0x01",
)
participant_2 = Participant.objects.create(
    address="0x02",
    raffle=raffle,
    poap_id="0x02",
)
participant_3 = Participant.objects.create(
    address="0x03",
    raffle=raffle,
    poap_id="0x03",
)
participant_4 = Participant.objects.create(
    address="0x04",
    raffle=raffle,
    poap_id="0x04",
)
participant_5 = Participant.objects.create(
    address="0x05",
    raffle=raffle,
    poap_id="0x05",
)
participant_6 = Participant.objects.create(
    address="0x06",
    raffle=raffle,
    poap_id="0x06",
)
