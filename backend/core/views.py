import json

from django_filters import rest_framework as filters
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.parsers import FileUploadParser
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_jwt.views import APIView

from core.filters import UserFilter, ParticipantFilter, RaffleFilter, ResultsTableFilter, BlockDataFilter
from core.models import User, Raffle, Event, Prize, Participant, ResultsTable, BlockData
from .permissions import RaffleTokenPermission, PrizeRaffleTokenPermission
from .serializers import RaffleSerializer, TextEditorImageSerializer, EventSerializer, \
    PrizeSerializer, ParticipantSerializer, MultiParticipantSerializer, ResultsTableSerializer, \
    BlockDataSerializer


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    http_method_names = ['get', ]
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    lookup_field = 'id'


class PrizeViewSet(viewsets.ModelViewSet):
    queryset = Prize.objects.all()
    serializer_class = PrizeSerializer
    lookup_field = 'id'
    http_method_names = ['get', 'delete', ]

    def get_permissions(self):
        restricted_actions = ['update', 'partial_update', 'destroy']

        if self.action in restricted_actions:
            permission_classes = [PrizeRaffleTokenPermission]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


class RaffleViewSet(viewsets.ModelViewSet):
    serializer_class = RaffleSerializer
    lookup_field = 'id'
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    http_method_names = ['get', 'post', 'patch', 'put']
    filter_class = RaffleFilter

    def get_queryset(self):
        model = self.serializer_class.Meta.model
        queryset = model.objects.filter().order_by('finalized', 'draw_datetime')
        return queryset

    def list(self, request, **kwargs):
        events = request.query_params.get('events_participated_in', None)
        if not events:
            return super(RaffleViewSet, self).list(request, **kwargs)

        raffles = Raffle.get_valid_raffles_for_event_set(json.loads(events))
        serializer = RaffleSerializer(raffles, many=True)
        return Response({"results": serializer.data})

    def get_permissions(self):
        restricted_actions = ['update', 'partial_update', 'destroy']

        if self.action in restricted_actions:
            permission_classes = [RaffleTokenPermission]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]


class ParticipantViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    filter_backends = (filters.DjangoFilterBackend, )
    filter_class = ParticipantFilter
    pagination_class = None
    http_method_names = ['get', 'post', ]

    def get_queryset(self):
        self.queryset = Participant.objects.all()

        if self.request.query_params and 'raffle' in self.request.query_params:
            raffle_id = self.request.query_params['raffle']
            raffle = Raffle.objects.filter(id=raffle_id).first()
            if raffle and raffle.one_address_one_vote:
                self.queryset = self.queryset.filter(raffle=raffle).distinct('address').order_by('address', 'poap_id')
        return self.queryset

    @action(detail=False, methods=['Post'])
    def signup_address(self, request):
        signature = request.data.get("signature", None)
        message = request.data.get("message", None)

        if not message and not signature:
            return Response(
                ("you must provide a message containing the raffle id and"
                 " the address, along with a signature for the message"),
                status=status.HTTP_400_BAD_REQUEST
            )

        if not message:
            return Response(
                "you must provide a message containing the raffle id and address",
                status=status.HTTP_400_BAD_REQUEST
            )

        if not signature:
            return Response(
                "Missing signature for message",
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = MultiParticipantSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        participants_queryset = serializer.save()
        participants = ParticipantSerializer(participants_queryset, many=True)
        return Response(participants.data, status=status.HTTP_201_CREATED)

    def create(self, request):
        return Response(
            "Method not implemented",
            status=status.HTTP_400_BAD_REQUEST
        )


class ResultsViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = ResultsTable.objects.all()
    serializer_class = ResultsTableSerializer
    lookup_field = 'id'
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    filter_class = ResultsTableFilter
    http_method_names = ['get', ]


class BlocksViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = BlockData.objects.all()
    serializer_class = BlockDataSerializer
    lookup_field = 'id'
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    filter_class = BlockDataFilter
    pagination_class = None
    http_method_names = ['get', ]


class TextEditorImageView(APIView):
    permission_classes = [AllowAny]

    parser_class = (FileUploadParser,)

    def post(self, request):
        image_serializer = TextEditorImageSerializer(data=request.data)
        if image_serializer.is_valid():
            image_serializer.save()
            # TODO - Review HTTP Scheme
            host = request.META.get('HTTP_HOST', 'api.localhost')
            response_data = ({"location": "https://" + host + image_serializer.data.get("file")})
            return Response(response_data, status=status.HTTP_201_CREATED)
        else:
            return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
