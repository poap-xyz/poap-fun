from django.conf.urls import url
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users'),
router.register(r'groups', views.GroupViewSet, basename='groups')
router.register(r'raffles', views.RaffleViewSet, basename='raffles')
router.register(r'events', views.EventViewSet, basename='events')
router.register(r'prizes', views.PrizeViewSet, basename='prizes')

urlpatterns = [
    url(r'^login/refresh/$', refresh_jwt_token),
    url(r'^login/$', views.CustomObtainJSONWebToken.as_view()),
    url(r'^raffles/text-editor-image$', views.TextEditorImageView.as_view()),
]
urlpatterns += router.urls
