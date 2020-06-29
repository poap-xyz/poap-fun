from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from .models import *


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # The forms to add and change user instances

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference the removed 'username' field
    readonly_fields = ('last_login', 'date_joined')
    fieldsets = (
        (
            _('Personal Info'),
            {
                'fields': (
                    'first_name', 'last_name', 'email', 'profile_image'
                )
            }
        ),
        # (
        #     _('Tool Info'),
        #     {
        #         'fields': (
        #             'password', 'contractor', 'phone'
        #         )
        #     }
        # ),
        (
            _('Group and Permissions Info'),
            {
                'fields': (
                    'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'
                )
            }
        ),
        (
            _('Audit Info'),
            {
                'fields': ('last_login', 'date_joined')
            }
        ),
    )
