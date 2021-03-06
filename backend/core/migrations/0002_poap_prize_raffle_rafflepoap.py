# Generated by Django 3.0.7 on 2020-07-01 19:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='POAP',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('poap_id', models.CharField(editable=False, max_length=255, verbose_name='poap id')),
            ],
            options={
                'verbose_name': 'poap',
                'verbose_name_plural': 'poaps',
            },
        ),
        migrations.CreateModel(
            name='Raffle',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=256, verbose_name='nombre')),
                ('description', models.TextField(verbose_name='descripción')),
                ('contact', models.EmailField(max_length=254, verbose_name='contact email')),
                ('draw_datetime', models.DateTimeField(verbose_name='raffle date and time')),
                ('token', models.CharField(editable=False, max_length=256, verbose_name='raffle token')),
            ],
            options={
                'verbose_name': 'raffle',
                'verbose_name_plural': 'raffles',
            },
        ),
        migrations.CreateModel(
            name='RafflePOAP',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('poap', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.PROTECT, related_name='poap_raffles', to='core.Raffle', verbose_name='poap')),
                ('raffle', models.ForeignKey(editable=False, on_delete=django.db.models.deletion.PROTECT, related_name='raffle_poaps', to='core.Raffle', verbose_name='raffle')),
            ],
            options={
                'verbose_name': 'raffle poap',
                'verbose_name_plural': 'raffle poaps',
            },
        ),
        migrations.CreateModel(
            name='Prize',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('name', models.CharField(max_length=255, verbose_name='prize name')),
                ('raffle', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='prizes', to='core.Raffle', verbose_name='raffle')),
            ],
            options={
                'verbose_name': 'prize',
                'verbose_name_plural': 'prizes',
            },
        ),
    ]
