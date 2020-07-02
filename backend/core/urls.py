from django.conf.urls import url
from rest_framework_jwt.views import refresh_jwt_token
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'users', views.UserViewSet, basename='users'),
router.register(r'groups', views.GroupViewSet, basename='groups')
router.register(r'raffles', views.RaffleViewSet, basename='raffles')

urlpatterns = [
    url(r'^login/refresh/$', refresh_jwt_token),
    url(r'^login/$', views.CustomObtainJSONWebToken.as_view()),
    url(r'^raffle/image$', views.TextEditorImageView.as_view()),
]
urlpatterns += router.urls
