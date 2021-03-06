# Generated by Django 3.1.5 on 2021-05-23 08:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0042_auto_20210522_1328'),
    ]

    operations = [
        migrations.AddField(
            model_name='element',
            name='category_name',
            field=models.CharField(blank=True, max_length=60, null=True, verbose_name='Название категории'),
        ),
        migrations.AddField(
            model_name='elementvalue',
            name='param_value_name',
            field=models.CharField(blank=True, max_length=60, null=True, verbose_name='Значение выборочного параметра'),
        ),
        migrations.AlterField(
            model_name='elementvalue',
            name='param_value',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='core.parametervalues', verbose_name='Номер выборочного параметра'),
        ),
    ]
