# Generated by Django 3.1.5 on 2021-05-22 09:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0036_auto_20210522_1249'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='parametervalues',
            index=models.Index(fields=['name', 'id'], name='parameter_v_name_a6f205_idx'),
        ),
    ]