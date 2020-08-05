from django.utils.translation import ugettext as _
from rest_framework import serializers

from core.models import Raffle
from notifications.models import NotificationSubscription


class NotificationSubscriptionSerializer(serializers.ModelSerializer):
    raffle_id = serializers.IntegerField(min_value=0, required=True, write_only=True)

    class Meta:
        model = NotificationSubscription
        fields = (
            'id', 'raffle', 'raffle_id', 'token', 'created_at', 'modified_at',
        )

        extra_kwargs = {
            'id': {'read_only': True},
            'raffle': {'read_only': True},
            'created_at': {'read_only': True},
            'modified_at': {'read_only': True},
            'url': {'lookup_field': 'token'}
        }

    def validate(self, validated_data):
        raffle_id = validated_data.get('raffle_id', None)
        token = validated_data.get('token', None)

        if not Raffle.objects.filter(pk=raffle_id).exists():
            raise serializers.ValidationError(_('raffle_id does not exist in the DB'))

        if NotificationSubscription.objects.filter(token=token).exists():
            raise serializers.ValidationError(_('Subscription with this token already exists'))

        return validated_data
