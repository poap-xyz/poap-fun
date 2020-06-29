# Dear dev,
#    Please copy this file into a .py file and write here any custom setting
#    you need to run this project locally.
#    Below you'll find the basics
#    Regards,
#    rama

import os

ALLOWED_HOSTS = ['api.localhost']

# DATABASE
DATABASES = {
   'default': {
       'ENGINE': 'django.db.backends.postgresql_psycopg2',
       'NAME': os.getenv('DB_NAME', 'db_name'),
       'USER': os.getenv('DB_USER', 'db_username'),
       'PASSWORD': os.getenv('DB_PASS', 'db_password'),
       'HOST': os.getenv('DB_SERVICE', 'localhost'),
       'PORT': os.getenv('DB_PORT', '5432'),
   }
}

# EMAIL
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'django.cas.server@gmail.com'
EMAIL_HOST_PASSWORD = '404_password_not_found'
EMAIL_FROM_ADDRESS = 'django.cas.server@gmail.com'


# Development server
if os.getenv('DEVSERVER', 'true') == 'true':
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

