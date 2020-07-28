from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'raffles', views.RaffleViewSet, basename='raffles')
router.register(r'events', views.EventViewSet, basename='events')
router.register(r'prizes', views.PrizeViewSet, basename='prizes')
router.register(r'participants', views.ParticipantViewSet, basename='participants')
router.register(r'results', views.ResultsViewSet, basename='participants')
router.register(r'blocks', views.BlocksViewSet, basename='blocks')

urlpatterns = [
    url(r'^raffles/text-editor-image/$', views.TextEditorImageView.as_view(), name='text-editor-image'),
]
urlpatterns += router.urls
