
from celery.schedules import crontab

beat_schedule = {
    'send-subscription-notifications': {
        'task': 'notifications.tasks.send_subscription_notifications',
        'schedule': crontab(minute='*/1'),
    }
}
