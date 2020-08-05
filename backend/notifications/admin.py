from django.contrib import admin

from notifications.models import NotificationSubscription, Notification


@admin.register(NotificationSubscription)
class NotificationSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'raffle', 'token', 'created_at')


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'notification_subscription', 'type', 'created_at')
