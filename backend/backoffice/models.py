from django.db import models

from core.models import User


class Task(models.Model):

    TASK_STATES = (
        ('CREATED', 'created'),
        ('IN_PROGRESS', 'in_progress'),
        ('COMPLETE', 'complete'),
        ('ERROR', 'error')
    )

    task_name = models.CharField(max_length=255)
    params = models.TextField(null=True, blank=True)
    result = models.TextField(null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    state = models.CharField(max_length=50,
                             choices=TASK_STATES,
                             default='CREATED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '{} by {} - {}'.format(
            self.task_name,
            self.created_by,
            self.state
        )