from rest_framework import viewsets, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from notifications.models import NotificationSubscription
from notifications.serializers import NotificationSubscriptionSerializer, NotificationUnsubscriptionSerializer


class NotificationSubscriptionViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    http_method_names = ['post']
    serializer_class = NotificationSubscriptionSerializer

    def get_queryset(self):
        model = self.serializer_class.Meta.model
        queryset = model.objects.filter().order_by('-id')
        return queryset

    def perform_create(self, serializer):
        instance = serializer.save()


class NotificationUnsubscriptionViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    http_method_names = ['post']

    def create(self, request):
        serializer = NotificationUnsubscriptionSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        raffle_id = request.data.get('raffle_id')
        token = request.data.get('token')

        NotificationSubscription.objects.filter(raffle__id=raffle_id, token=token).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
