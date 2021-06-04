import datetime

from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required


@staff_member_required
def raffle_join_form(request):
    now = datetime.datetime.now()
    html = "<html><body>It is now %s.</body></html>" % now
    return HttpResponse(html)
