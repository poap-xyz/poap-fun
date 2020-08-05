from django.core.management.base import BaseCommand

from notifications.services import notification_service


class Command(BaseCommand):
    help = ""

    def handle(self, *args, **options):
        notification_service.send_notifications()
