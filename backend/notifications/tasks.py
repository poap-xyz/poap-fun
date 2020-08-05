from backend.celery import app
from notifications.services import notification_service


@app.task()
def send_subscription_notifications():
    notification_service.send_notifications()
