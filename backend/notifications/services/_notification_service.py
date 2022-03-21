import logging
import firebase_admin
from django.conf import settings
from firebase_admin import credentials, messaging

from notifications.models import Notification, NOTIFICATION_TYPE, NotificationSubscription

logger = logging.getLogger("app")


class NotificationService:

    def __init__(self):
        # the file is generated in:
        #    https://console.firebase.google.com/u/1/project/prod-poap-fun/settings/serviceaccounts/adminsdk
        cred = credentials.Certificate(settings.GOOGLE_APPLICATION_CREDENTIALS)
        firebase_admin.initialize_app(cred)

    def send_fcm(self, token, msg, url):
        title = 'POAP.fun alert'
        poap_badge = 'https://poap.fun/favicons/favicon-96x96.png'
        notification = messaging.Notification(
            title=title,
            body=msg,
            image=poap_badge
        )

        webpush =  messaging.WebpushConfig(
            notification=messaging.WebpushNotification(
                title=title,
                body=msg,
                icon=poap_badge,
                badge=poap_badge,
                image=poap_badge,
            ),
            fcm_options=messaging.WebpushFCMOptions(
                link=url
            )
        )

        message = messaging.Message(
            notification=notification,
            webpush = webpush,
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

        url = f'https://poap.fun/{notification_subscription.raffle.id}'

        response = self.send_fcm(notification_subscription.token, msg, url)

        notification = Notification(
            notification_subscription=notification_subscription,
            type=type,
            response=response
        )
        notification.save()

    def send_raffle_notifications(self, raffle, type):
        notification_subscriptions = NotificationSubscription.objects.filter(raffle=raffle)

        for notification_subscription in notification_subscriptions:
            try:
                self.send_notification(notification_subscription, type)
                if type == NOTIFICATION_TYPE.HAS_ENDED:
                    notification_subscription.is_complete = True
                    notification_subscription.save()
            except Exception as e:
                logger.warning(f"Notification error >> Subscription {notification_subscription.id}")
                logger.warning(e)
