# Generated by Django 3.1.5 on 2021-03-25 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_auto_20210319_1756'),
    ]

    operations = [
        migrations.CreateModel(
            name='ParameterValues',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=150, verbose_name='Значение параметра')),
            ],
        ),
        migrations.AddField(
            model_name='parameters',
            name='values',
            field=models.ManyToManyField(blank=True, to='core.ParameterValues'),
        ),
    ]