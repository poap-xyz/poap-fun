# Generated by Django 3.0.7 on 2020-07-07 12:37

import core.utils
import core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_auto_20200702_1928'),
    ]

    operations = [
        migrations.AddField(
            model_name='raffle',
            name='finalized',
            field=models.BooleanField(default=False, verbose_name='finalized'),
        ),
        migrations.AlterField(
            model_name='resultstableentry',
            name='participant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='entries', to='core.Participant', verbose_name='participant'),
        ),
        migrations.AlterField(
            model_name='resultstableentry',
            name='results_table',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='entries', to='core.ResultsTable', verbose_name='results_table'),
        ),
        migrations.AlterField(
            model_name='texteditorimage',
            name='location',
            field=models.ImageField(upload_to=core.utils.GenerateUniqueFilename('text_editor_images/'), validators=[core.validators.validate_image_size]),
        ),
    ]
