from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'notification-subscriptions', views.NotificationSubscriptionViewSet, basename='notification-subscriptions')
router.register(r'notification-unsubscriptions', views.NotificationUnsubscriptionViewSet, basename='notification-unsubscriptions')

urlpatterns = router.urls
