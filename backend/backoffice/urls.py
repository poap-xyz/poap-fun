from django.urls import path

from . import views

urlpatterns = [
    path('raffle-join/', views.raffle_join_form, name='raffle-join'),
]