import logging

from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext as _
from pytz import utc

logger = logging.getLogger("app")


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    ``created`` and ``modified`` fields.
    """
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(AbstractUser):
    profile_image = models.URLField(max_length=200, null=True, blank=True, default=None)


class Raffle(TimeStampedModel):
    """
    Represents a raffle.
    """

    class Meta:
        verbose_name = _('raffle')
        verbose_name_plural = _('raffles')

    name = models.CharField(_('name'), max_length=256)
    description = models.TextField(_('description'))
    contact = models.EmailField(_('contact email'))
    # all raffle dates MUST be in UTC TODO find a way to enforce this invariant
    draw_datetime = models.DateTimeField(_("raffle's draw date and time"))
    end_datetime = models.DateTimeField(_("raffle's end date and time"))
    token = models.CharField(_("raffle token"), max_length=256, editable=False)

    @property
    def active(self):
        return utc.now < self.draw_datetime

    def verify_token(self, raw_token):
        logger.info(f"verifying token for {self.__repr__()}")
        # leverage django"s hashing implementations
        return check_password(raw_token, self.token)

    def save(self, **kwargs):
        # if the object does not have the id, then we are
        # creating and not saving, thus we hash the token
        if not self.id:
            logger.info(f"creating {self.__repr__()}")
            self.token = make_password(self.token)
        super().save(**kwargs)


class Prize(TimeStampedModel):
    """
    Represents the price to be won in a raffle.
    """

    class Meta:
        verbose_name = _('prize')
        verbose_name_plural = _('prizes')

    name = models.CharField(_('prize name'), max_length=255)
    raffle = models.ForeignKey(Raffle, verbose_name='raffle', related_name='prizes', on_delete=models.PROTECT)


class RafflePOAP(TimeStampedModel):
    """
    Explicit many to many relationship mapping table between a raffle and it's required poaps.
    """

    class Meta:
        verbose_name = _('raffle poap')
        verbose_name_plural = _('raffle poaps')

    raffle = models.ForeignKey(
        Raffle, verbose_name=_('raffle'), related_name='raffle_poaps', editable=False, on_delete=models.PROTECT
    )
    poap = models.ForeignKey(
        Raffle, verbose_name=_('poap'), related_name='poap_raffles', editable=False, on_delete=models.PROTECT
    )


class POAP(TimeStampedModel):
    """
    Represents a valid poap that can be required by a raffle.
    """
    class Meta:
        verbose_name = _('poap')
        verbose_name_plural = _('poaps')

    # represents the poap identifier for the POAP API
    poap_id = models.CharField(_('poap id'), max_length=255, editable=False)

