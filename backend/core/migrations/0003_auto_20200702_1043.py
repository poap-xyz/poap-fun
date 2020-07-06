# Generated by Django 3.0.7 on 2020-07-02 10:43

import datetime
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_poap_prize_raffle_rafflepoap'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='POAP',
            new_name='Event',
        ),
        migrations.AddField(
            model_name='prize',
            name='order',
            field=models.IntegerField(default=1, verbose_name='order'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='raffle',
            name='end_datetime',
            field=models.DateTimeField(default=datetime.datetime(2020, 7, 2, 10, 43, 21, 747149), verbose_name="raffle's end date and time"),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='raffle',
            name='description',
            field=models.TextField(verbose_name='description'),
        ),
        migrations.AlterField(
            model_name='raffle',
            name='draw_datetime',
            field=models.DateTimeField(verbose_name="raffle's draw date and time"),
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('address', models.CharField(max_length=50, verbose_name='address')),
                ('raffle', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='participants', to='core.Raffle', verbose_name='raffle')),
            ],
            options={
                'verbose_name': 'participant',
                'verbose_name_plural': 'participants',
            },
        ),
    ]