# Generated by Django 3.1.5 on 2021-05-22 09:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0032_auto_20210522_1233'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='elementvalue',
            name='element_val_id_b92c04_idx',
        ),
    ]