
from celery.schedules import crontab

beat_schedule = {
    #    'example-task-1': {
    #        'task': 'example.tasks.get_last_prices_short',
    #        'schedule': crontab(hour='10,12,14,18,20', minute='30'),
    #    },
    'test-task': {
        'task': 'core.tasks.test_task',
        'schedule': crontab(minute='*/10'),
    }
}
