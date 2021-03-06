# Generated by Django 3.0.7 on 2020-07-15 14:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0013_auto_20200713_1703'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='prize',
            options={'ordering': ['raffle', 'order'], 'verbose_name': 'prize', 'verbose_name_plural': 'prizes'},
        ),
        migrations.AlterModelOptions(
            name='raffle',
            options={'ordering': ['finalized', 'draw_datetime'], 'verbose_name': 'raffle', 'verbose_name_plural': 'raffles'},
        ),
        migrations.RenameField(
            model_name='texteditorimage',
            old_name='location',
            new_name='file',
        ),
        migrations.AlterField(
            model_name='blockdata',
            name='gas_limit',
            field=models.BigIntegerField(verbose_name='gas limit'),
        ),
    ]
