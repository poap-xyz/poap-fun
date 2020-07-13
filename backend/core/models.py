import logging
import random

from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import ugettext as _
from pytz import utc

from core.utils import generate_unique_filename
from core.validators import validate_image_size


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


class Event(TimeStampedModel):
    """
    Represents a valid event that can be required by a raffle.
    """

    class Meta:
        verbose_name = _("event")
        verbose_name_plural = _("events")

    # represents the event identifier for the POAP API
    event_id = models.CharField(_("event id"), max_length=255)
    # For internal and debugging use only
    name = models.CharField(_("name"), max_length=256)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"Event(id: {self.id}, event_id: {self.event_id}, name:{self.name})"


class Raffle(TimeStampedModel):
    """
    Represents a raffle.
    """

    class Meta:
        verbose_name = _("raffle")
        verbose_name_plural = _("raffles")
        ordering = ['-draw_datetime']

    name = models.CharField(_("name"), max_length=256)
    description = models.TextField(_("description"))
    contact = models.EmailField(_("contact email"))
    token = models.CharField(_("raffle token"), max_length=256)
    # all raffle dates MUST be in UTC TODO find a way to enforce this invariant
    draw_datetime = models.DateTimeField(_("raffle's draw date and time"))
    end_datetime = models.DateTimeField(_("raffle's end date and time"), null=True, blank=True)
    registration_deadline = models.DateTimeField(_("raffle's registration deadline"))
    # if true, no matter how many poaps the address has, it counts as one vote.
    # if false, each of the address's poaps counts as a vote
    one_address_one_vote = models.BooleanField(_("one address one vote"))
    events = models.ManyToManyField(Event, through="RaffleEvent", related_name="raffles", verbose_name="events")
    # used to store raw token to return after creation
    _token = ''

    @property
    def active(self):
        return utc.now < self.draw_datetime

    def is_valid_token(self, raw_token):
        logger.info(f"verifying token for {self.__repr__()}")
        # leverage django's hashing implementations
        return check_password(raw_token, self.token)

    @staticmethod
    def generate_token():
        raw_token = str(random.randint(0, 999999)).zfill(6)
        token = make_password(raw_token)
        return raw_token, token

    def save(self, **kwargs):
        # if the object does not have the id, then we are
        # creating and not saving, thus we hash the token
        if not self.id:
            logger.info(f"creating {self.__repr__()}")
            raw_token, token = self.generate_token()
            self._token = raw_token
            self.token = token
        super().save(**kwargs)

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"Raffle(id: {self.id}, name: {self.name})"


class Prize(TimeStampedModel):
    """
    Represents the price to be won in a raffle.
    """

    class Meta:
        verbose_name = _("prize")
        verbose_name_plural = _("prizes")
        ordering = ['raffle', 'order']

    name = models.CharField(_("prize name"), max_length=255)
    raffle = models.ForeignKey(Raffle, verbose_name="raffle", related_name="prizes", on_delete=models.PROTECT)
    # The order in which the prize is ranked eg. First prize, Second price and so on
    order = models.IntegerField(_("order"))

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"Prize(id: {self.id}, name: {self.name}, raffle: {self.raffle})"


class RaffleEvent(TimeStampedModel):
    """
    Explicit many to many relationship mapping table between a raffle and it's required events.
    """

    class Meta:
        verbose_name = _("raffle event")
        verbose_name_plural = _("raffle events")
        unique_together = [["raffle", "event"]]

    raffle = models.ForeignKey(
        Raffle, verbose_name=_("raffle"), related_name="raffle_events", on_delete=models.CASCADE
    )
    event = models.ForeignKey(
        Event, verbose_name=_("event"), related_name="event_raffles", on_delete=models.CASCADE
    )

    def __str__(self):
        return f"RafflePoap(id: {self.id},raffle: {self.raffle}, event:{self.event})"

    def __repr__(self):
        return self.__str__()


class Participant(TimeStampedModel):
    """
    Represents the participant in a raffle
    """

    class Meta:
        verbose_name = _("participant")
        verbose_name_plural = _("participants")
        unique_together = [["raffle", "poap_id"]]

    address = models.CharField(_("address"), max_length=50)
    raffle = models.ForeignKey(Raffle, verbose_name=_("raffle"), related_name="participants", on_delete=models.PROTECT)
    poap_id = models.CharField(_("poap id"), max_length=100)

    def __str__(self):
        return self.address

    def __repr__(self):
        return f"Participant(id: {self.id}, address: {self.address})"


class ResultsTable(TimeStampedModel):
    """
    Represents the results from a raffle
    """

    class Meta:
        verbose_name = _("results table")
        verbose_name_plural = _("results tables")

    raffle = models.OneToOneField(
        Raffle, verbose_name=_("raffle"), related_name="result_table", on_delete=models.PROTECT, unique=True
    )

    def __str__(self):
        return f"Results table for raffle {self.raffle}"

    def __repr__(self):
        return f"ResultsTable(raffle.id: {self.raffle.id})"


class ResultsTableEntry(TimeStampedModel):
    """
    Represents a participant entry in the results table of a raffle
    """

    class Meta:
        verbose_name = _("results table entry")
        verbose_name_plural = _("results table entries")

    participant = models.ForeignKey(
        Participant, verbose_name=_("participant"), related_name="results_table_entries", on_delete=models.PROTECT
    )
    results_table = models.ForeignKey(
        ResultsTable, verbose_name=_('results_table'), related_name="results_table_entries", on_delete=models.PROTECT
    )
    # The order for the table entry in which it was selected for
    # the raffle. eg, 1 for first place, 2 for 2nd place etc...
    order = models.IntegerField(_("order"))

    def __str__(self):
        return f"results table entry for table {self.results_table}, participant {self.participant}"

    def __repr__(self):
        return (
            f"ResultsTableEntry("
            f"id: {self.id}, participant: {self.participant}, results_table:{self.results_table}, order: {self.order}"
            f")"
        )


class BlockData(TimeStampedModel):
    """
    Represents the block data used to draw the results of the raffle
    """

    class Meta:
        verbose_name = _("block data")
        verbose_name_plural = _("block data")

    # the raffle in which this block was used
    raffle = models.ForeignKey(Raffle, verbose_name=_("raffle"), related_name="blocks_data", on_delete=models.PROTECT)
    # The order in which the block was used in the raffle
    order = models.IntegerField(_("order"))

    block_number = models.BigIntegerField(_("block number"))

    # The block nonce may not fit in the DB, save the 64 least significant bits
    nonce = models.BigIntegerField(_("block nonce"))

    # the seed that was derived from the nonce (nonces often do not fit in integers)
    seed = models.IntegerField(_("seed"), null=True, blank=True)

    def __str__(self):
        return f"Block data N°{self.order} for {self.raffle}"

    def __repr__(self):
        return f"BlockData(id: {self.id}, raffle: {self.raffle}, raffle_id: {self.raffle.id})"


class TextEditorImage(TimeStampedModel):
    """
    Represents the image uploaded by Tiny MCE
    """

    file = models.ImageField(upload_to=generate_unique_filename, validators=[validate_image_size])