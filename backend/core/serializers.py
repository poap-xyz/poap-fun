from django.core import exceptions
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import Group
from django.utils.translation import ugettext as _
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from core.models import Raffle, TextEditorImage, Prize, Event, RaffleEvent, Participant
from core.services import poap_validation_service

UserModel = get_user_model()


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('id', 'name', )


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

    def validate(self, data):
        if not poap_validation_service.valid_poap_event(data):
            return ValidationError("The poap event is invalid")
        return data


class RaffleSerializer(serializers.ModelSerializer):
    prizes = PrizeSerializer(many=True)
    events = EventSerializer(many=True)
    token = serializers.CharField(allow_blank=True, read_only=True, required=False, source="_token", default="")

    class Meta:
        model = Raffle
        fields = [
            "id", "name", "description", "contact", "draw_datetime", "end_datetime",
            "one_address_one_vote", "prizes", "events", "token"
        ]

    def create(self, validated_data):
        prizes_data = validated_data.pop("prizes")
        events_data = validated_data.pop("events")
        raffle = Raffle.objects.create(**validated_data)
        for prize_data in prizes_data:
            Prize.objects.create(raffle=raffle, **prize_data)
        for event_data in events_data:
            # the event is validated in the serializer, so if it does not exist we create it
            event, _ = Event.objects.get_or_create(event_id=event_data["event_id"])
            # update the name if the name has changed
            if event_data["name"] != event.name:
                event.name = event_data["name"]
                event.save(update_fields=["name"])
            RaffleEvent.objects.create(event=event, raffle=raffle)
        return raffle

    def update(self, instance, validated_data):
        prizes_data = validated_data.pop("prizes", None)
        events_data = validated_data.pop("events", None)
        if prizes_data and events_data:
            raise ValidationError("cannot modify prizes or events through a raffle, use their respective resources")
        if prizes_data:
            raise ValidationError("cannot modify prizes through a raffle, use the prize resource")
        if events_data:
            raise ValidationError("cannot modify events through a raffle, use the event resource")
        return super(RaffleSerializer, self).update(instance, validated_data)


class ParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = Participant
        fields = "__all__"

    def validate(self, attrs):
        # validate that the participant is who he claims to be
        authenticated = poap_validation_service.valid_participant_address(attrs["address"], attrs["signature"])
        if not authenticated:
            return ValidationError("the address does not correspond with the signature")

        has_claimed_poap = poap_validation_service.address_has_poap(attrs["poap_id"])
        if not has_claimed_poap:
            return ValidationError({"poap_id": "address does not have possession this poap"})


class TextEditorImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TextEditorImage
        fields = "__all__"
