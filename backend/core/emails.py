from .models import EmailConfiguration
from .services import EmailService


def send_raffle_created_email(raffle):
    service = EmailService()

    service.create_message(
        recipients=raffle.contact,
        subject=None
    )
    config = EmailConfiguration.get_solo()
    service.set_template(config.raffle_created_template)
    data = {
        'raffle_id': raffle.id,
        'raffle_token': raffle._token,
        'raffle_draw_datetime': f'{raffle.draw_datetime.strftime("%d-%b-%Y %H:%M")} UTC' if raffle.draw_datetime else 'TBD'
    }
    service.set_data(data)
    service.send_email()
