from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    # Django ADMIN
    url(r'^admin/', admin.site.urls),

    # HIJACK
    url(r'^hijack/', include('hijack.urls')),

    # Core
    url(r'api/v1/', include('core.urls')),
]

if 'rosetta' in settings.INSTALLED_APPS:
    urlpatterns += [
        url(r'^rosetta/', include('rosetta.urls'))
    ]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

handler404 = 'backend.views.handler404'
handler500 = 'backend.views.handler500'
handler403 = 'backend.views.handler403'
