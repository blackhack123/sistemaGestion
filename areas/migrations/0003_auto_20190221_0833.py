# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2019-02-21 13:33
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('areas', '0002_auto_20181001_1715'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='procesos',
            name='estado_admin',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='estado_colaborador',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='estado_encargado',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='estado_lider',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='fec_ingresa',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='fec_modifica',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='id_area',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='observaciones_admin',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='observaciones_encargado',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='observaciones_lider',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='usuario_ing_id',
        ),
        migrations.RemoveField(
            model_name='procesos',
            name='usuario_mod_id',
        ),
    ]
