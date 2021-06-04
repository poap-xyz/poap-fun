import json
from datetime import datetime, timedelta

from django.urls import reverse
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.admin.views.decorators import staff_member_required

from django_celery_beat.models import IntervalSchedule, PeriodicTask

from .forms import RaffleMultiJoinForm
from .models import Task


@staff_member_required
def raffle_join_form(request):
    form = RaffleMultiJoinForm()

    if request.method == 'POST':
        form = RaffleMultiJoinForm(request.POST)
        if form.is_valid():
            # Create Task
            raffle = form.cleaned_data['raffle']
            addresses = form.cleaned_data['addresses']
            params = {
                'raffle_id': raffle.id,
                'addresses': addresses.splitlines()
            }
            task = Task(
                task_name='Raffle Multiple Join',
                params=json.dumps(params),
                created_by=request.user
            )
            task.save()

            # Create Celery job
            schedule, _ = IntervalSchedule.objects.get_or_create(every=3, period=IntervalSchedule.SECONDS)
            periodic_task, _ = PeriodicTask.objects.get_or_create(
                name=f'program_admin_raffle_multi_join_{task.id}',
                interval=schedule,
                one_off=True,
                task="backoffice.tasks.multi_raffle_join",
                args=json.dumps([task.id]),
            )
            periodic_task.enabled = True
            periodic_task.start_time = datetime.now() + timedelta(seconds=5)
            periodic_task.save()

            # Redirect to status page
            return HttpResponseRedirect(reverse('raffle-join-results', args=[task.id]))

    ctx = {'form': form}
    return render(request, 'backoffice/raffle_multi_join_form.html', ctx)


@staff_member_required
def raffle_join_results(request, task_id):
    task = Task.objects.filter(id=task_id).first()

    if not task:
        return HttpResponseRedirect(reverse('raffle-join-form'))

    ctx = {
        'task': task,
        'formatted_results': '' if not task.result else json.loads(task.result)
    }
    return render(request, 'backoffice/raffle_multi_join_form_result.html', ctx)