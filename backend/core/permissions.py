from rest_framework import permissions


class RaffleTokenPermission(permissions.BasePermission):
    """
    Permission class that validates the raffle token for edition
    """
    def has_object_permission(self, request, view, obj):
        raffle_token = request.headers.get("Authorization", None)
        is_valid = False

        try:
            is_valid = obj.is_valid_token(raffle_token)
        except AttributeError:
            is_valid = False

        return is_valid


class PrizeRaffleTokenPermission(permissions.BasePermission):
    """
       Permission class that validates the raffle's token for edition
    """
    def has_object_permission(self, request, view, obj):
        raffle_token = request.headers.get("Authorization", None)
        is_valid = False

        try:
            is_valid = obj.raffle.is_valid_token(raffle_token)
        except AttributeError:
            is_valid = False

        return is_valid