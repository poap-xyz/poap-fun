import logging

from core.models import Raffle
from notifications.models import NOTIFICATION_TYPE
from notifications.services import notification_service

logger = logging.getLogger("app")


def send_one_hour_raffle_notifications(raffle_id):
    raffle = Raffle.objects.filter(id=raffle_id).first()
    if not raffle:
        logger.warning(f"raffle with id {raffle_id} not found when trying to generate notifications")
        return

    notification_service.send_raffle_notifications(raffle, NOTIFICATION_TYPE.ONE_HOUR)


def send_one_minute_raffle_notifications(raffle_id):
    raffle = Raffle.objects.filter(id=raffle_id).first()
    if not raffle:
        logger.warning(f"raffle with id {raffle_id} not found when trying to generate notifications")
        return

    notification_service.send_raffle_notifications(raffle, NOTIFICATION_TYPE.ONE_MINUTE)


def send_has_started_raffle_notifications(raffle_id):
    raffle = Raffle.objects.filter(id=raffle_id).first()
    if not raffle:
        logger.warning(f"raffle with id {raffle_id} not found when trying to generate notifications")
        return

    notification_service.send_raffle_notifications(raffle, NOTIFICATION_TYPE.HAS_STARTED)


def send_has_ended_raffle_notifications(raffle_id):
    raffle = Raffle.objects.filter(id=raffle_id).first()
    if not raffle:
        logger.warning(f"raffle with id {raffle_id} not found when trying to generate notifications")
        return

    notification_service.send_raffle_notifications(raffle, NOTIFICATION_TYPE.HAS_ENDED)
