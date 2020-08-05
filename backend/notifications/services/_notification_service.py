from datetime import datetime, timedelta

import firebase_admin
from firebase_admin import messaging

from notifications.models import Notification, NOTIFICATION_TYPE, NotificationSubscription


class NotificationService:
    firebase_app = None

    def __init__(self):
        self.firebase_app = firebase_admin.initialize_app()

    def send_fcm(self, token, msg):
        message = messaging.Message(
            notification = {
               "body": msg,
               "title": msg,
           },
            token=token,
        )

        response = messaging.send(message)

        return response

    def send_notification(self, notification_subscription, type):
        if Notification.objects.filter(notification_subscription=notification_subscription, type=type).exists():
            return None

        if type == NOTIFICATION_TYPE.ONE_HOUR:
            msg = f'Raffle {notification_subscription.raffle.name} will start in 1 hour'
        elif type == NOTIFICATION_TYPE.ONE_MINUTE:
            msg = f'Raffle {notification_subscription.raffle.name} will start in 1 minute'
        elif type == NOTIFICATION_TYPE.HAS_STARTED:
            msg = f'Raffle {notification_subscription.raffle.name} has started'
        elif type == NOTIFICATION_TYPE.HAS_ENDED:
            msg = f'Raffle {notification_subscription.raffle.name} has ended'
        else:
            return None

        response = self.send_fcm(notification_subscription.token, msg)

        notification = Notification(
            notification_subscription=notification_subscription,
            type=type,
            response=response
        )
        notification.save()

    def send_notifications(self):
        now = datetime.now()
        one_minute = now + timedelta(minutes=1)
        one_hour = now + timedelta(hours=1)

        one_minute_raffle_subscriptions = NotificationSubscription.objects\
            .filter(raffle__draw_datetime=one_minute, is_complete=False)
        one_hour_raffle_subscriptions = NotificationSubscription.objects\
            .filter(raffle__draw_datetime=one_hour, is_complete=False)
        in_progress_raffle_subscriptions = NotificationSubscription.objects\
            .filter(raffle__draw_datetime___gte=now, raffle__finalized=False, is_complete=False)
        finalized_raffle_subscriptions = NotificationSubscription.objects\
            .filter(raffle__finalized=True, is_complete=False)

        for notification_subscription in one_minute_raffle_subscriptions:
            self.send_notification(notification_subscription, NOTIFICATION_TYPE.ONE_MINUTE)

        for notification_subscription in one_hour_raffle_subscriptions:
            self.send_notification(notification_subscription, NOTIFICATION_TYPE.ONE_HOUR)

        for notification_subscription in in_progress_raffle_subscriptions:
            self.send_notification(notification_subscription, NOTIFICATION_TYPE.HAS_STARTED)

        for notification_subscription in finalized_raffle_subscriptions:
            self.send_notification(notification_subscription, NOTIFICATION_TYPE.HAS_ENDED)
            notification_subscription.is_complete = True
            notification_subscription.save()
