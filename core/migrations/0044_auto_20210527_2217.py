# Generated by Django 3.1.5 on 2021-05-27 19:17

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0043_auto_20210523_1132'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='element',
            name='category_name',
        ),
        migrations.RemoveField(
            model_name='elementvalue',
            name='param_value_name',
        ),
        migrations.AlterField(
            model_name='elementvalue',
            name='param_value',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.parametervalues', verbose_name='Значение выборочного параметра'),
        ),
    ]
