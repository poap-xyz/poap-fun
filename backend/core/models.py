import json
import random
import logging
from collections import deque
from datetime import datetime

from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext as _
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import make_password, check_password

from django_celery_beat.models import IntervalSchedule, PeriodicTask

from solo.models import SingletonModel

from core.utils import generate_unique_filename, get_poaps_for_address, get_address_name
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
        ordering = ['finalized', 'draw_datetime']

    name = models.CharField(_("name"), max_length=256)
    description = models.TextField(_("description"))
    contact = models.EmailField(_("contact email"))
    token = models.CharField(_("raffle token"), max_length=256)
    # all raffle dates MUST be in UTC TODO find a way to enforce this invariant
    draw_datetime = models.DateTimeField(_("raffle's draw date and time"))
    end_datetime = models.DateTimeField(_("raffle's end date and time"), null=True, blank=True)
    # if true, no matter how many poaps the address has, it counts as one vote.
    # if false, each of the address's poaps counts as a vote
    one_address_one_vote = models.BooleanField(_("one address one vote"))
    events = models.ManyToManyField(Event, through="RaffleEvent", related_name="raffles", verbose_name="events")
    # marked as true when all results have been generated for the raffle
    finalized = models.BooleanField(_("finalized"), default=False)
    # used to store raw token to return after creation
    _token = ''

    @staticmethod
    def get_valid_raffles_for_event_set(event_ids):
        raffles = Raffle.objects.filter(draw_datetime__gte=datetime.utcnow(), events__event_id__in=event_ids)
        raffles = raffles.prefetch_related('events')
        raffles = raffles.distinct().all()
        return raffles

    @property
    def active(self):
        return datetime.utcnow() < self.draw_datetime

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

            # send_raffle_created_email()

        super().save(**kwargs)

        task_name = f'generating_results_for_raffle_{self.id}'
        task = PeriodicTask.objects.filter(name=task_name).first()
        if not self.finalized:
            schedule, _ = IntervalSchedule.objects.get_or_create(every=3, period=IntervalSchedule.SECONDS)
            if not task:
                task = PeriodicTask(
                    name=task_name,
                    interval=schedule,
                    task="core.tasks.generate_raffle_results_task",
                    args=json.dumps([self.id]),
                )

            if self.draw_datetime > timezone.now():
                task.start_time = self.draw_datetime
            else:
                task.start_time = None

            task.save()
        elif task:
            task.enabled = False
            task.save()

    def __str__(self):
        return self.name

    def __repr__(self):
        return f"Raffle(id: {self.id}, name: {self.name})"

    @classmethod
    def get_valid_poaps_for_raffle(cls, user_poaps, raffle):
        valid_events = set([int(event.event_id) for event in raffle.events.all()])
        registered_poaps = Participant.objects.filter(raffle=raffle).values_list('poap_id', flat=True)
        valid_poaps = []
        for each in user_poaps:
            if int(each['event']) in valid_events and each['poap'] not in registered_poaps:
                valid_poaps.append(each)
        return valid_poaps

    def has_participant(self, address):
        return self.participants.filter(address=address.lower()).exists()


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


class ParticipantManager(models.Manager):

    def create_from_address(self, address, signature, raffle, message):
        user_poaps = get_poaps_for_address(address)
        if not len(user_poaps) > 0:
            return ValidationError("could not get poaps for address")

        valid_poaps_for_raffle = Raffle.get_valid_poaps_for_raffle(user_poaps, raffle)
        if not len(valid_poaps_for_raffle) > 0:
            return ValidationError("the participant does not have any required poap")

        ens_name = get_poaps_for_address(address)

        participants = deque()
        for each in valid_poaps_for_raffle:
            participant = Participant(
                address=address.lower(),
                ens_name=ens_name,
                signature=signature,
                poap_id=each['poap'],
                event_id=each['event'],
                message=message,
                raffle=raffle
            )
            participants.append(participant)

        Participant.objects.bulk_create(participants)
        return participants


class Participant(TimeStampedModel):
    """
    Represents the participant in a raffle
    """

    class Meta:
        verbose_name = _("participant")
        verbose_name_plural = _("participants")
        unique_together = [["raffle", "poap_id"]]

    address = models.CharField(_("address"), max_length=50)
    ens_name = models.CharField(_("ens name"), max_length=255, null=True, blank=True)
    raffle = models.ForeignKey(Raffle, verbose_name=_("raffle"), related_name="participants", on_delete=models.PROTECT)
    poap_id = models.IntegerField(_("poap id"))
    event_id = models.CharField(_("event id"), max_length=100)
    signature = models.CharField(_("signature"), max_length=255)
    message = models.TextField(_("message"), null=True, blank=True)

    objects = ParticipantManager()

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
        Raffle, verbose_name=_("raffle"), related_name="results_table", on_delete=models.PROTECT, unique=True
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
        ordering = ['results_table', 'order']

    participant = models.ForeignKey(
        Participant, verbose_name=_("participant"), related_name="entries", on_delete=models.PROTECT
    )
    results_table = models.ForeignKey(
        ResultsTable, verbose_name=_('results_table'), related_name="entries", on_delete=models.PROTECT
    )
    # The order for the table entry in which it was selected for
    # the raffle. eg, 1 for first place, 2 for 2nd place etc...
    order = models.IntegerField(_("order"))

    def __str__(self):
        return f"{self.order}º - {self.results_table.raffle} - {self.participant}"

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
        ordering = ['raffle', '-order']

    # the raffle in which this block was used
    raffle = models.ForeignKey(Raffle, verbose_name=_("raffle"), related_name="blocks_data", on_delete=models.PROTECT)
    # The order in which the block was used in the raffle
    order = models.IntegerField(_("order"))

    block_number = models.BigIntegerField(_("block number"))

    # The block nonce may not fit in the DB, save the 64 least significant bits
    gas_limit = models.BigIntegerField(_("gas limit"))

    def __str__(self):
        return f"Block data N°{self.order} for {self.raffle}"

    def __repr__(self):
        return f"BlockData(id: {self.id}, raffle: {self.raffle}, raffle_id: {self.raffle.id})"


class TextEditorImage(TimeStampedModel):
    """
    Represents the image uploaded by Tiny MCE
    """

    file = models.ImageField(upload_to=generate_unique_filename, validators=[validate_image_size])


class EmailConfiguration(SingletonModel):
    sender = models.CharField(max_length=255, null=True, blank=True)
    welcome_template = models.CharField(max_length=255, null=True, blank=True)
    raffle_created_template = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return _("Email Configuration")

    class Meta:
        verbose_name = _("Email Configuration")
