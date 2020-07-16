from core.utils import verify_and_recover_message, get_poaps_for_address


class PoapIntegrationService:

    @staticmethod
    def valid_participant_address(address, signature, raffle_id):
        message = {
            "address": address,
            "raffle_id": raffle_id
        }
        verify_and_recover_message(message, signature)
        return True

    @staticmethod
    def address_has_poap(address, poap_id):
        address_held_poap_ids = get_poaps_for_address(address)
        if not address_held_poap_ids:
            return False

        for address_held_poap_id in address_held_poap_ids:
            if address_held_poap_id == poap_id:
                return True

        return False

    @staticmethod
    def valid_poap_event(poap_id):
        # TODO implement
        return True

