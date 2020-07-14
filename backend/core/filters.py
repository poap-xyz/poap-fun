from django.db import models as django_models
from django_filters import rest_framework as filters, DateFilter, IsoDateTimeFilter
from core.models import User, Raffle


class UserFilter(filters.FilterSet):

    class Meta:
        model = User
        fields = {
            'first_name': ['exact', 'icontains'],
            'last_name': ['exact', 'icontains'],
            'email': ['exact', 'icontains']
        }


class RaffleFilter(filters.FilterSet):

    class Meta:
        model = Raffle
        fields = {
            'name': ['exact', 'icontains'],
            'draw_datetime': ['exact', 'gte', 'lte'],
            'end_datetime': ['exact', 'gte', 'lte'],
            'participants__address': ['exact'],
            # 'finalized': ['exact', ],
        }

        filter_overrides = {
            django_models.DateField: {
                'filter_class': DateFilter
            },
            django_models.DateTimeField: {
                'filter_class': IsoDateTimeFilter
            },
        }
