import datetime
import json
import logging
import os
from collections import deque

import requests
from web3.auto.infura import w3
from django.utils.deconstruct import deconstructible


@deconstructible
class GenerateUniqueFilename(object):

    def __init__(self, sub_path):
        self.path = sub_path

    def __call__(self, instance, filename):
        head, ext = os.path.splitext(filename)
        # get filename
        if instance.pk:
            filename = filename
        else:
            # set filename with the unix epoch appended
            unix_epoch_millis = datetime.datetime.now().timestamp() * 1000000
            filename = f"{head}{unix_epoch_millis:.0f}{ext}"
        # return the whole path to the file
        return os.path.join(self.path, filename)


generate_unique_filename = GenerateUniqueFilename('text_editor_images/')


def verify_and_recover_message(message, signature):
    # TODO implement
    return message


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
