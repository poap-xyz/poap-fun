import logging

from backend.celery import app
from core.models import Raffle, RaffleLock
from core.services import raffle_results_service

logger = logging.getLogger("app")


@app.task()
def generate_raffle_results_task(raffle_id):
    raffle = Raffle.objects.filter(id=raffle_id).first()
    if not raffle:
        logger.warning(f"raffle with id {raffle_id} not found when trying to generate results")
        return

    db_lock, _ = RaffleLock.objects.get_or_create(raffle=raffle)
    if db_lock.locked:
        logger.warning(f"raffle with id {raffle_id} is locked")
        return

    db_lock.lock()

    raffle_results_service.generate_next_result_step(raffle)

    db_lock.unlock()
