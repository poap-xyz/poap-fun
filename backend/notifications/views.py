from rest_framework import viewsets
from rest_framework.permissions import AllowAny

from notifications.serializers import NotificationSubscriptionSerializer


class NotificationSubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    http_method_names = ['post', 'delete']
    serializer_class = NotificationSubscriptionSerializer
    lookup_field = 'token'

    def get_queryset(self):
        model = self.serializer_class.Meta.model
        queryset = model.objects.filter().order_by('-id')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()
