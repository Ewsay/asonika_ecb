# Generated by Django 3.1.5 on 2021-05-22 09:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0033_auto_20210522_1234'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='elementvalue',
            index=models.Index(fields=['num_param_value'], name='element_val_num_par_66e56d_idx'),
        ),
    ]
