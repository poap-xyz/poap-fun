from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r'notification-subscriptions', views.NotificationSubscriptionViewSet, basename='notification-subscriptions')

urlpatterns = router.urls
