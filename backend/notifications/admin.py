from django.contrib import admin

from notifications.models import NotificationSubscription


@admin.register(NotificationSubscription)
class NotificationSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'raffle', 'token', 'created_at')
