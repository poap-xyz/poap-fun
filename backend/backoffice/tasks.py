import logging

from backend.celery import app
from backoffice.models import Task
from core.services import raffle_multi_join

logger = logging.getLogger("app")


@app.task()
def multi_raffle_join(task_id):
    task = Task.objects.filter(id=task_id).first()
    if not task:
        logger.warning(f"Task with id {task_id} not found when trying to join users to raffle")
        return

    raffle_multi_join.process(task)
