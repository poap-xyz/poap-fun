# Generated by Django 3.0.7 on 2021-04-07 16:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0031_emailconfiguration_raffle_results_template'),
    ]

    operations = [
        migrations.CreateModel(
            name='RaffleLock',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('modified_at', models.DateTimeField(auto_now=True)),
                ('locked', models.BooleanField(default=False)),
                ('raffle', models.OneToOneField(on_delete=django.db.models.deletion.PROTECT, to='core.Raffle', verbose_name='raffle')),
            ],
            options={
                'verbose_name': 'raffle lock',
                'verbose_name_plural': 'raffle locks',
            },
        ),
    ]
