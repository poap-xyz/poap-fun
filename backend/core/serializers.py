from django.core import exceptions
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import Group
from django.utils.translation import ugettext as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.models import Raffle, TextEditorImage, Prize, Event, RaffleEvent, Participant, ResultsTable, \
    ResultsTableEntry, BlockData
from core.services import poap_integration_service
from core.emails import send_raffle_created_email

UserModel = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name',)


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    username = serializers.EmailField()

    class Meta:
        model = UserModel
        fields = (
            'id', 'username', 'password', 'first_name', 'last_name', 'email', 'groups', 'is_active', 'profile_image'
        )

        extra_kwargs = {
            'id': {'read_only': True},
            'is_active': {'read_only': True},
            'email': {'read_only': True},
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = UserModel.objects.create_user(**validated_data)
        user.email = user.username
        user.save()
        return user

    def update(self, instance, validated_data):
        instance = super().update(instance, validated_data)

        instance.email = instance.username
        instance.save()

        return instance

    def validate(self, validated_data):
        username = validated_data.get('username', None)
        password = validated_data.get('password', None)

        if self.instance:
            if username:
                if UserModel.objects.filter(username=username).exclude(id=self.instance.id).exists():
                    raise serializers.ValidationError(_('Email already exists'))

                if UserModel.objects.filter(email=username).exclude(id=self.instance.id).exists():
                    raise serializers.ValidationError(_('Email already exists'))

            if password:
                raise serializers.ValidationError(_('you cant patch the password'))
        else:
            if password:
                try:
                    password_validation.validate_password(password=password, user=UserModel(**validated_data))
                except exceptions.ValidationError as e:
                    raise serializers.ValidationError(_(" - ".join(e)))

            if username:
                if UserModel.objects.filter(username=username).exists():
                    raise serializers.ValidationError(_('Email already exists'))

                if UserModel.objects.filter(email=username).exists():
                    raise serializers.ValidationError(_('Email already exists'))

        return validated_data


class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = ["id", "name", "order"]


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ["id", "event_id", "name"]


class RaffleSerializer(serializers.ModelSerializer):
    prizes = PrizeSerializer(many=True)
    events = EventSerializer(many=True)
    token = serializers.CharField(
        allow_blank=True,
        read_only=True,
        required=False,
        source="_token",
        default=""
    )

    class Meta:
        model = Raffle
        fields = [
            "id", "name", "description", "contact", "draw_datetime", "end_datetime", "start_date_helper",
            "one_address_one_vote", "prizes", "events", "token", "results_table", "finalized", "email_required"
        ]

        extra_kwargs = {
            'results_table': {'read_only': True},
            'finalized': {'read_only': True},
        }


    def validate(self, validated_data):
        if "draw_datetime" in validated_data:
            if not validated_data["draw_datetime"] and not validated_data["start_date_helper"]:
                raise ValidationError("Please submit a text for the start date")
        return validated_data

    def create(self, validated_data):
        prizes_data = validated_data.pop("prizes")
        events_data = validated_data.pop("events")
        raffle = Raffle.objects.create(**validated_data)

        # Update token
        token = raffle._token

        for prize_data in prizes_data:
            Prize.objects.create(raffle=raffle, **prize_data)
        for event_data in events_data:
            # the event is validated in the serializer,
            # so if it does not exist we create it
            event, _ = Event.objects.get_or_create(event_id=event_data["event_id"])
            # update the name if the name has changed
            if event_data["name"] != event.name:
                event.name = event_data["name"]
                event.save(update_fields=["name"])
            RaffleEvent.objects.create(event=event, raffle=raffle)

        # Send contact the edit information
        if token:
            send_raffle_created_email(raffle, token)

        return raffle

    def update(self, instance, validated_data):
        prizes_data = validated_data.pop("prizes", [])
        events_data = validated_data.pop("events", None)
        if events_data:
            raise ValidationError("cannot modify events through a raffle, use the event resource")

        if instance.finalized:
            raise ValidationError("cannot edit a finalized raffle")

        for prize_data in prizes_data:
            Prize.objects.create(raffle=instance, **prize_data)
        return super(RaffleSerializer, self).update(instance, validated_data)


class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = ["id", "address", "ens_name", "poap_id", "event_id"]


class MultiParticipantSerializer(serializers.Serializer):
    """
    Specific serializer used to validate the creation of
    multiple participants from a single address
    """
    address = serializers.CharField(max_length=50)
    signature = serializers.CharField(max_length=255)
    email = serializers.EmailField(max_length=255, required=False, allow_blank=True)
    message = serializers.CharField()
    raffle_id = serializers.IntegerField()

    def validate_raffle_id(self, value):
        raffle = Raffle.objects.filter(id=value)
        if not raffle.exists():
            raise ValidationError("raffle id must belong to a valid raffle")
        return value

    def validate(self, attrs):
        # validate that the participant is who he claims to be
        authenticated = poap_integration_service.valid_participant_address(
            attrs["address"], attrs["signature"], attrs["raffle_id"]
        )
        if not authenticated:
            raise ValidationError(
                "the address does not correspond with the signature"
            )

        raffle = Raffle.objects.filter(id=attrs["raffle_id"]).first()
        if raffle.has_participant(attrs["address"]):
            raise ValidationError(
                "This address is already participating"
            )

        if raffle.email_required and 'email' not in attrs:
            raise ValidationError(
                "An email is required for raffle registration"
            )
        return attrs

    def update(self, instance, validated_data):
        raise NotImplementedError

    def create(self, validated_data):
        address = validated_data.get("address")
        signature = validated_data.get("signature")
        message = validated_data.get("message")
        email = validated_data.get("email")
        raffle = Raffle.objects.filter(id=validated_data.get("raffle_id")).first()
        Participant.objects.create_from_address(
            address=address,
            signature=signature,
            message=message,
            raffle=raffle,
            email=email
        )
        return Participant.objects.filter(raffle=raffle, address=address.lower())


class TextEditorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextEditorImage
        fields = "__all__"


class ResultsTableEntrySerializer(serializers.ModelSerializer):
    participant = ParticipantSerializer(many=False)

    class Meta:
        model = ResultsTableEntry
        fields = ["id", "order", "participant"]


class ResultsTableSerializer(serializers.ModelSerializer):
    entries = ResultsTableEntrySerializer(many=True)

    class Meta:
        model = ResultsTable
        fields = ["id", "raffle_id", "entries"]


class BlockDataSerializer(serializers.ModelSerializer):

    class Meta:
        model = BlockData
        fields = ["id", "raffle", "order", "block_number", "gas_used", "timestamp"]
