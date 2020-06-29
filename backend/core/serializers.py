from django.core import exceptions
from django.contrib.auth import get_user_model, password_validation
from django.contrib.auth.models import Group
from django.utils.translation import ugettext as _
from rest_framework import serializers




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
