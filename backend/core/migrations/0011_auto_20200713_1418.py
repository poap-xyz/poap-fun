# Generated by Django 3.0.7 on 2020-07-13 17:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20200707_1237'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='raffle',
            name='registration_deadline',
        ),
        migrations.AlterField(
            model_name='resultstable',
            name='raffle',
            field=models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, related_name='results_table', to='core.Raffle', verbose_name='raffle'),
        ),
    ]
