from datetime import datetime

from django.test import TestCase

from core.models import Raffle


class RaffleTestCase(TestCase):

    def setUp(self):
        self.name = 'raffle name'
        self.description = 'raffle description'
        self.contact = 'test@email.com'
        self.draw_datetime = datetime.now()
        self.end_datetime = datetime.now()
        self.token = 'token'
        self.raffle = Raffle.objects.create(
            name=self.name,
            description=self.description,
            contact=self.contact,
            draw_datetime=self.draw_datetime,
            end_datetime=self.end_datetime,
            token=self.token,
        )

    def test_hash_token(self):
        """
        Test that the token is not being stored as plaintext
        """
        assert self.token != self.raffle.token

    def test_verify_token(self):
        """
        Test that the hash verification mechanism works
        """
        assert self.raffle.verify_token(self.token)

    def test_modification_integrity(self):
        """
        Test that if the object is modified, the token still validates
        """
        self.raffle.description = 'new description'
        self.raffle.save()
        assert self.raffle.verify_token(self.token)

