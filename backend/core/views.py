from datetime import datetime

from django.contrib.auth import authenticate
from django.contrib.auth.models import Group

from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework_jwt.serializers import JSONWebTokenSerializer
from rest_framework_jwt.settings import api_settings
from rest_framework_jwt.views import JSONWebTokenAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import OrderingFilter
from rest_framework import status, viewsets
from django_filters import rest_framework as filters

from core.filters import UserFilter
from core.models import User

from .serializers import UserSerializer, GroupSerializer


class CustomObtainJSONWebToken(JSONWebTokenAPIView):
    serializer_class = JSONWebTokenSerializer

    def post(self, request, *args, **kwargs):
        data = request.data

        if not data.get('username', None):
            return Response({'error': 'username required'}, status=status.HTTP_400_BAD_REQUEST)

        # Allow email login as well as normal username flow
        if data['username'] and '@' in data['username']:
            if not User.objects.filter(username=data['username']).exists():
                user = User.objects.filter(email=data['username']).first()
                if user: data['username'] = user.username

        # Get serializer from received data
        serializer = self.get_serializer(data=data)

        # Check user validation
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Check authentication process validation
        user = serializer.object.get('user') or request.user
        token = serializer.object.get('token')

        user_authenticated = authenticate(username=user.username, password=data['password'])
        if not user_authenticated:
            return Response({'error': 'Authentication failed'}, status=status.HTTP_400_BAD_REQUEST)

        # Calculate jwt response token
        jwt_response_payload_handler = api_settings.JWT_RESPONSE_PAYLOAD_HANDLER
        response_token = jwt_response_payload_handler(token, user, request)

        # Serialize authenticated user (with custom serializer) and add token info to response
        user_serializer = UserSerializer(user_authenticated).data
        user_serializer['token'] = response_token['token']
        response = Response(user_serializer)

        # Set expiration in cookie (if needed)
        if api_settings.JWT_AUTH_COOKIE:
            expiration = (datetime.utcnow() + api_settings.JWT_EXPIRATION_DELTA)
            response.set_cookie(api_settings.JWT_AUTH_COOKIE, token, expires=expiration, httponly=True)

        # Return authenticated user
        return response


class UserViewSet(viewsets.ModelViewSet):
    authentication_classes = [JSONWebTokenAuthentication]
    serializer_class = UserSerializer
    filter_backends = (filters.DjangoFilterBackend, OrderingFilter)
    filter_class = UserFilter
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_permissions(self):
        permission_classes = [IsAuthenticated]
        if self.action == 'create':
            permission_classes = [AllowAny]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        queryset = User.objects.filter(is_active=True, id=self.request.user.id)
        # Filter superusers from listings
        if not self.request.user.is_superuser:
            queryset = queryset.exclude(is_superuser=True)
        return queryset

    # Custom DELETE call to deactivate instead of delete db object (attribute 'is_active' is required)
    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class GroupViewSet(viewsets.ModelViewSet):
    authentication_classes = [JSONWebTokenAuthentication]
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', ]
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
