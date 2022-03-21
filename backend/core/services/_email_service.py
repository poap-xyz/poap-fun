import base64
import logging

from django.conf import settings

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition

from core.models import EmailConfiguration


logger = logging.getLogger("app")


class EmailService(object):

    def __init__(self):
        default_sender = 'notreply@poap.fun'
        try:
            config = EmailConfiguration.get_solo()
            default_sender = config.sender
        except:
            pass

        self._client = SendGridAPIClient(settings.SENDGRID_KEY)
        self._sender = default_sender
        self._message = None

    def create_message(self, recipients, subject):
        self._message = Mail(
            from_email=self._sender,
            to_emails=recipients,
            subject=subject
        )

    def set_template(self, template):
        self._message.template_id = template

    def set_bcc(self, bcc_email):
        self._message.add_bcc(bcc_email)

    def set_data(self, data):
        self._message.dynamic_template_data = data

    def add_attachment(self, data, file_name, file_type):
        encoded_file = base64.b64encode(data).decode()

        attached_file = Attachment(
            FileContent(encoded_file),
            FileName(file_name),
            FileType(file_type),
            Disposition('attachment')
        )
        self._message.attachment = attached_file

    def send_email(self):
        try:
            self._client.send(self._message)
            return True
        except Exception as e:
            logger.info('Sendgrid > ERROR > Send email ')
            logger.info(e)
            logger.info(self._message.get())
        return False
