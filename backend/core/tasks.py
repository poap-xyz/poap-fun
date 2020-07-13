import json
import logging
from datetime import datetime
from time import sleep

from django_celery_beat.models import IntervalSchedule, PeriodicTask

from backend.celery import app
from core.models import Raffle
from core.services import raffle_results_service

logger = logging.getLogger("app")


@app.task(max_retries=0)
def test_task():
    print("HELLO WORD")


@app.task()
def generate_raffle_results_task(raffle_id):
    raffle = Raffle.objects.filter(id=raffle_id).first()
    if not raffle:
        logger.warning(f"raffle with id {raffle_id} not found when trying to generate results")
        return

    finished = raffle_results_service.generate_next_result_step(raffle)


@app.task()
def generate_results_for_expired_raffles_task():
    # fetch all the tasks and terminate the ones that are already done (cleanup)
    periodic_tasks = PeriodicTask.objects.filter(task="core.tasks.generate_raffle_results_task").all()
    for periodic_task in periodic_tasks:
        raffle_id = json.loads(periodic_task.args)[0]
        raffle = Raffle.objects.filter(id=raffle_id).first()
        if not raffle:
            logger.warning(
                f"raffle with id {raffle_id} not found while trying to evaluate task {periodic_task.id} for deletion"
            )
            continue

        if raffle.finalized:
            periodic_task.delete()

    # generate new tasks for raffles that need to be finalized
    schedule, _ = IntervalSchedule.objects.get_or_create(every=30, period=IntervalSchedule.SECONDS)

    raffles = Raffle.objects.filter(finalized=False, draw_datetime__lte=datetime.utcnow())

    for raffle in raffles:
        task, _ = PeriodicTask.objects.get_or_create(
            interval=schedule,
            name=f"generating_results_for_raffle_{raffle.id}",
            task="core.tasks.generate_raffle_results_task",
            args=json.dumps([raffle.id])
        )
