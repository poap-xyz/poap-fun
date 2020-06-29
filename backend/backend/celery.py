
from __future__ import absolute_import, unicode_literals
import os
from celery import Celery
import logging

logger = logging.getLogger("Celery")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

app = Celery('backend')

app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks()

app.conf.update(
    ADMINS=('VonPix', 'info@vonpix.com'),
    CELERY_SEND_TASK_ERROR_EMAILS=True)


@app.task(bind=True)
def debug_task(self):
    print('Request: {0!r}'.format(self.request))