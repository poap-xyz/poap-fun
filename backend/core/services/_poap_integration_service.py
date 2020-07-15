import json
import logging
from collections import deque

import requests

from core.utils import verify_and_recover_message


class PoapIntegrationService:

    @staticmethod
    def valid_participant_address(address, signature, raffle_id):
        message = {
            "address": address,
            "raffle_id": raffle_id
        }
        verify_and_recover_message(message, signature)
        return True

    @classmethod
    def address_has_poap(cls, address, poap_id):
        address_held_poap_ids = cls.get_poaps_for_address(address)
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

    @staticmethod
    def get_poaps_for_address(address):
        """
        Returns a deque containing all the poap_ids held by the address

        Args:
            address:
                an ethereum address against which tokens will be looked up

        Returns:
            poap_ids
                a deque containing all the poap_ids of the poaps held by the address

        """
        logger = logging.getLogger("app")

        if not address:
            return None

        request_url = f"https://api.poap.xyz/actions/scan/{address}"
        response = requests.get(request_url)

        if not response.ok:
            logger.warning(f"failed to find poaps for address {address}, request to poap api was not successful")
            return None

        events = json.loads(response.content)

        event_ids = deque()
        poap_ids = deque()
        for event in events:
            try:
                event_id = event["tokenId"]
                poap_id = event["event"]["id"]
            except KeyError:
                logger.error("Unexpected response format from poap API")
                return None
            event_ids.append(event_id)
            poap_ids.append(poap_id)

        return event_ids, poap_ids

