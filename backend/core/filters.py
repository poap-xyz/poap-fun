from django_filters import rest_framework as filters
from core.models import User


class UserFilter(filters.FilterSet):

    class Meta:
        model = User
        fields = {
            'first_name': ['exact', 'icontains'],
            'last_name': ['exact', 'icontains'],
            'email': ['exact', 'icontains']
        }
