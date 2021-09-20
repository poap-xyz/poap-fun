from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import ugettext_lazy as _

from solo.admin import SingletonModelAdmin

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
        (
            _('Tool Info'),
            {
                'fields': (
                    'password',
                )
            }
        ),
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


@admin.register(Raffle)
class RaffleAdmin(admin.ModelAdmin):
    list_display = ('name', 'id', 'draw_datetime', 'end_datetime', 'email_required', 'finalized')
    list_filter = ('finalized', 'published')


@admin.register(RaffleEvent)
class RaffleEventAdmin(admin.ModelAdmin):
    list_display = ('raffle', 'event')


@admin.register(Prize)
class PrizeAdmin(admin.ModelAdmin):
    list_display = ('name', 'order', 'raffle')


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('event_id', 'name')


@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('address', 'raffle', 'poap_id', 'event_id', 'email')


@admin.register(ResultsTable)
class ResultsTabletAdmin(admin.ModelAdmin):
    pass


@admin.register(ResultsTableEntry)
class ResultsTableEntryAdmin(admin.ModelAdmin):
    list_display = ('order', 'participant', 'results_table')
    list_filter = ('results_table',)


@admin.register(BlockData)
class BlockDataAdmin(admin.ModelAdmin):
    list_display = ('order', 'raffle', 'block_number', 'gas_used')

@admin.register(RaffleLock)
class RaffleLockAdmin(admin.ModelAdmin):
    list_display = ('raffle', 'locked', 'modified_at')


admin.site.register(EmailConfiguration, SingletonModelAdmin)