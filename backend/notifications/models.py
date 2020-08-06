from django.db import models
from django.utils.translation import ugettext as _

from core.models import TimeStampedModel, Raffle


class NOTIFICATION_TYPE:
    ONE_HOUR = 'ONE_HOUR'
    ONE_MINUTE = 'ONE_MINUTE'
    HAS_STARTED = 'HAS_STARTED'
    HAS_ENDED = 'HAS_ENDED'

    items = [
        (ONE_HOUR, _('ONE_HOUR')),
        (ONE_MINUTE, _('ONE_MINUTE')),
        (HAS_STARTED, _('HAS_STARTED')),
        (HAS_ENDED, _('HAS_ENDED'))
    ]
    values = dict(items)


class NotificationSubscription(TimeStampedModel):

    class Meta:
        verbose_name = _("notification subscription")
        verbose_name_plural = _("notification subscriptions")

    raffle = models.ForeignKey(Raffle, on_delete=models.PROTECT)
    token = models.CharField(_("token"), max_length=255)
    is_complete = models.BooleanField(default=False)

    def __str__(self):
        return self.raffle.name

    def __repr__(self):
        return f"Notification Subscription(id: {self.id}, raffle: {self.raffle})"


class Notification(TimeStampedModel):
    notification_subscription = models.ForeignKey(NotificationSubscription, on_delete=models.PROTECT)
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE.items)
    response = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.type
