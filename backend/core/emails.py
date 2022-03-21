import csv
from io import StringIO

from django.core.validators import validate_email
from django.core.exceptions import ValidationError

from .models import EmailConfiguration, ResultsTable, ResultsTableEntry
from .services import EmailService


def get_admin_emails(email_string):
    emails = []
    if email_string and len(email_string.split(',')) > 0:
        for bcc in email_string.split(','):
            try:
                validate_email(bcc)
                emails.append(bcc)
            except ValidationError as e:
                print("bad email, details:", e)
    return emails


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

    # Add admins
    admin_emails = get_admin_emails(config.new_raffle_bcc_email)
    for email in admin_emails: service.set_bcc(email)

    service.send_email()


def send_raffle_results_email(raffle):
    service = EmailService()

    service.create_message(
        recipients=raffle.contact,
        subject=None
    )

    # Basic template data
    config = EmailConfiguration.get_solo()
    service.set_template(config.raffle_results_template)
    data = {'raffle_id': raffle.id}
    service.set_data(data)

    # Calculate results
    table = ResultsTable.objects.filter(raffle=raffle).first()
    if not table: return

    entries = ResultsTableEntry.objects.filter(results_table=table).order_by('order')
    results = [['Position', 'Address', 'ENS', 'POAP Id', 'Email', 'Signature validated?'],]

    for entry in entries:
        results.append([
            (entry.order + 1),
            entry.participant.address,
            entry.participant.ens_name,
            entry.participant.poap_id,
            entry.participant.email,
            "Yes" if entry.participant.signature.startswith('0x') else "No"
        ])

    output_file = StringIO()
    csv.writer(output_file).writerows(results)

    # Add attachment
    service.add_attachment(output_file.getvalue().encode(), 'results.csv', 'text/csv')

    # Add admins
    admin_emails = get_admin_emails(config.new_raffle_bcc_email)
    for email in admin_emails: service.set_bcc(email)

    service.send_email()
