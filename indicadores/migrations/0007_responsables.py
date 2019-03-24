# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2019-03-15 21:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('indicadores', '0006_productos'),
    ]

    operations = [
        migrations.CreateModel(
            name='Responsables',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('correo', models.CharField(max_length=100, null=True)),
                ('estado', models.IntegerField(default=1)),
            ],
        ),
    ]