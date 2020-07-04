import json

import pytest
import requests
from django.urls import reverse
from model_bakery import baker

from rest_framework import status
from core.tests.test_fixtures import *

class TestRaffleAPIView:

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_raffle_create(self, api_client, raffle_data):

        raffle_create_url = reverse("raffles-list")

        response = api_client.post(
            raffle_create_url,
            content_type="application/json",
            data=json.dumps(raffle_data)
        )
        response_content = json.loads(response.content)
        assert response.status_code == status.HTTP_201_CREATED
        assert response_content["token"] is not None
        assert response_content["token"] is not ""

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_raffle_update(self, api_client, raffle_data):

        # Create a raffle since it's the only way to get the unhashed token
        raffle_create_url = reverse("raffles-list")
        response = api_client.post(
            raffle_create_url,
            content_type="application/json",
            data=json.dumps(raffle_data)
        )
        response_content = json.loads(response.content)
        token = response_content.get("token")

        raffle_edit_url = reverse("raffles-detail", kwargs={"id": response_content.get("id")})

        modified_raffle_data = {
            "name": "other raffle name"
        }

        headers = {"HTTP_AUTHORIZATION": token}

        response = api_client.patch(
            raffle_edit_url,
            content_type="application/json",
            data=json.dumps(modified_raffle_data),
            **headers
        )
        response_content = json.loads(response.content)
        assert response.status_code == status.HTTP_200_OK
        assert modified_raffle_data.get("name") == response_content.get("name")

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_raffle_update_unauthorized(self, api_client, raffle_data):
        # Create a raffle since it's the only way to get the unhashed token
        raffle_create_url = reverse("raffles-list")
        response = api_client.post(
            raffle_create_url,
            content_type="application/json",
            data=json.dumps(raffle_data)
        )
        response_content = json.loads(response.content)

        raffle_edit_url = reverse("raffles-detail", kwargs={"id": response_content.get("id")})

        modified_raffle_data = {
            "name": "other raffle name"
        }

        response = api_client.patch(
            raffle_edit_url,
            content_type="application/json",
            data=json.dumps(modified_raffle_data),
        )
        response_content = json.loads(response.content)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


class TestPrizeAPIView:

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_prize_update(self, api_client, raffle_data):
        # Create a raffle since it's the only way to get the unhashed token
        raffle_create_url = reverse("raffles-list")
        response = api_client.post(
            raffle_create_url,
            content_type="application/json",
            data=json.dumps(raffle_data)
        )
        response_content = json.loads(response.content)
        token = response_content.get("token")
        prizes = response_content.get("prizes")
        prize = prizes[0]
        prize_edit_url = reverse("prizes-detail", kwargs={"id": prize.get("id")})

        modified_prize_data = {
            "name": "other price name"
        }

        headers = {"HTTP_AUTHORIZATION": token}

        response = api_client.patch(
            prize_edit_url,
            content_type="application/json",
            data=json.dumps(modified_prize_data),
            **headers
        )
        response_content = json.loads(response.content)
        assert response.status_code == status.HTTP_200_OK
        assert modified_prize_data.get("name") == response_content.get("name")

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_prize_update_unauthorized(self, api_client, raffle_data):
        # Create a raffle since it's the only way to get the unhashed token
        raffle_create_url = reverse("raffles-list")
        response = api_client.post(
            raffle_create_url,
            content_type="application/json",
            data=json.dumps(raffle_data)
        )
        response_content = json.loads(response.content)
        token = response_content.get("token")
        prizes = response_content.get("prizes")
        prize = prizes[0]
        prize_edit_url = reverse("prizes-detail", kwargs={"id": prize.get("id")})

        modified_prize_data = {
            "name": "other price name"
        }

        response = api_client.patch(
            prize_edit_url,
            content_type="application/json",
            data=json.dumps(modified_prize_data),
        )
        response_content = json.loads(response.content)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
