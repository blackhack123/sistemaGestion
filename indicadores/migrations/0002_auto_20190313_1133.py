# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2019-03-13 16:33
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('indicadores', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='objetivos',
            name='fecha',
        ),
        migrations.AlterField(
            model_name='objetivos',
            name='objetivo',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='indicadores.Objetivos'),
        ),
    ]
