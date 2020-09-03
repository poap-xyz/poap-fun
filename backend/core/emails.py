from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import EmailConfiguration
from .services import EmailService


def send_raffle_created_email(raffle, token):
    service = EmailService()

    service.create_message(
        recipients=raffle.contact,
        subject=None
    )
    config = EmailConfiguration.get_solo()
    service.set_template(config.raffle_created_template)
    data = {
        'raffle_id': raffle.id,
        'raffle_token': token,
        'raffle_draw_datetime': f'{raffle.draw_datetime.strftime("%d-%b-%Y %H:%M")} UTC' if raffle.draw_datetime else 'TBD'
    }
    service.set_data(data)
    if config.new_raffle_bcc_email and len(config.new_raffle_bcc_email.split(',')) > 0:
        for bcc in config.new_raffle_bcc_email.split(','):
            try:
                validate_email(bcc)
                service.set_bcc(bcc)
            except ValidationError as e:
                print("bad email, details:", e)

    service.send_email()
