import json
import tempfile
from datetime import datetime, timedelta

import pytest
import requests
from PIL import Image
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

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_filter_by_date(self, api_client):
        raffle_1 = baker.make("core.Raffle", draw_datetime=datetime.strptime("2020-07-14", "%Y-%m-%d"))
        raffle_2 = baker.make("core.Raffle", draw_datetime=datetime.strptime("2020-08-14", "%Y-%m-%d"))
        raffle_3 = baker.make("core.Raffle", draw_datetime=datetime.strptime("2020-09-14", "%Y-%m-%d"))
        raffle_list_url = f"{reverse('raffles-list')}?draw_datetime__gte=2020-08-14T00:00:00"
        response = api_client.get(raffle_list_url)
        content = json.loads(response.content)

        assert response.status_code == status.HTTP_200_OK
        assert len(content["results"]) == 2

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_filter_by_name(self, api_client):
        raffle_1 = baker.make(
            "core.Raffle", name="raffle 1", draw_datetime=datetime.strptime("2020-08-14", "%Y-%m-%d")
        )
        raffle_2 = baker.make(
            "core.Raffle", name="raffle 2", draw_datetime=datetime.strptime("2020-09-14", "%Y-%m-%d")
        )
        raffle_list_url = f"{reverse('raffles-list')}?name__icontains=1"
        response = api_client.get(raffle_list_url)
        content = json.loads(response.content)
        assert response.status_code == status.HTTP_200_OK
        assert len(content["results"]) == 1
        assert content["results"][0]["name"] == "raffle 1"

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_filter_by_event_participation(self, api_client):
        raffle_1_draw_datetime = datetime.utcnow() + timedelta(hours=9)
        raffle_1 = baker.make("core.Raffle", name="raffle 1", draw_datetime=raffle_1_draw_datetime)
        event_1 = baker.make("core.Event", event_id=1)
        raffle_event_1 = baker.make("core.RaffleEvent", raffle=raffle_1, event=event_1)
        event_2 = baker.make("core.Event", event_id=2)
        raffle_event_2 = baker.make("core.RaffleEvent", raffle=raffle_1, event=event_2)

        raffle_2_draw_datetime = datetime.utcnow() + timedelta(hours=9)
        raffle_2 = baker.make("core.Raffle", name="raffle 2", draw_datetime=raffle_2_draw_datetime)
        event_4 = baker.make("core.Event", event_id=4)
        raffle_event_3 = baker.make("core.RaffleEvent", raffle=raffle_2, event=event_4)

        raffle_list_url = reverse("raffles-list") + "?events_participated_in=[1, 2, 3]"
        response = api_client.get(raffle_list_url)
        content = json.loads(response.content)
        print(f"content: {content}")
        assert response.status_code == status.HTTP_200_OK
        assert len(content["results"]) == 1
        assert content["results"][0]["name"] == "raffle 1"

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_filter_by_participant(self, api_client):
        raffle_1 = baker.make("core.Raffle", name="raffle 1")
        raffle_2 = baker.make("core.Raffle")
        participant = baker.make("core.Participant", address="0x1", raffle=raffle_1)

        raffle_list_url = f"{reverse('raffles-list')}?participants__address=0x1"
        response = api_client.get(raffle_list_url)
        content = json.loads(response.content)
        assert response.status_code == status.HTTP_200_OK
        assert len(content["results"]) == 1
        assert content["results"][0]["name"] == "raffle 1"


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


class TestParticipantAPIView:

    def test_get_all_participants_for_raffle(self):
        pass

    def test_sign_up_valid_user(self):
        pass

    def test_sign_up_invalid_address(self):
        pass

    def test_sign_up_invalid_poaps(self):
        pass

    


class TestTextEditorImageAPIView:

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_image_upload(self, api_client):

        image = Image.new('RGB', (100, 100))

        tmp_file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(tmp_file)
        tmp_file.seek(0)

        image_post_url = reverse("text-editor-image")
        response = api_client.post(
            image_post_url,
            format="multipart",
            data={"file": tmp_file}
        )
        assert response.status_code == status.HTTP_201_CREATED
        content = json.loads(response.content)
        location = content.get("location", None)
        assert location