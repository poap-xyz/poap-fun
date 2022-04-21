import json
import tempfile
from datetime import timedelta, datetime

from PIL import Image
from django.urls import reverse
from django.utils import timezone
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
        baker.make(
            "core.Raffle",
            draw_datetime=timezone.make_aware(datetime.strptime("2020-07-14", "%Y-%m-%d"))
        )
        baker.make(
            "core.Raffle",
            draw_datetime=timezone.make_aware(datetime.strptime("2020-08-14", "%Y-%m-%d"))
        )
        baker.make(
            "core.Raffle",
            draw_datetime=timezone.make_aware(datetime.strptime("2020-09-14", "%Y-%m-%d"))
        )
        raffle_list_url = f"{reverse('raffles-list')}?draw_datetime__gte=2020-08-14T00:00:00"
        response = api_client.get(raffle_list_url)
        content = json.loads(response.content)

        assert response.status_code == status.HTTP_200_OK
        assert len(content["results"]) == 2

    @pytest.mark.urls("core.urls")
    @pytest.mark.django_db
    def test_filter_by_name(self, api_client):
        baker.make(
            "core.Raffle",
            name="raffle 1",
            draw_datetime=timezone.make_aware(datetime.strptime("2020-08-14", "%Y-%m-%d"))
        )
        baker.make(
            "core.Raffle",
            name="raffle 2",
            draw_datetime=timezone.make_aware(datetime.strptime("2020-09-14", "%Y-%m-%d"))
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
        raffle_1_draw_datetime = timezone.now() + timedelta(hours=9)
        raffle_1 = baker.make("core.Raffle", name="raffle 1", draw_datetime=raffle_1_draw_datetime)
        event_1 = baker.make("core.Event", event_id=1)
        raffle_event_1 = baker.make("core.RaffleEvent", raffle=raffle_1, event=event_1)
        event_2 = baker.make("core.Event", event_id=2)
        raffle_event_2 = baker.make("core.RaffleEvent", raffle=raffle_1, event=event_2)

        raffle_2_draw_datetime = timezone.now()+ timedelta(hours=9)
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