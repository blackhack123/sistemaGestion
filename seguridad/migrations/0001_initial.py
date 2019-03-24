# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2018-10-01 19:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('personal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='TipoUsuario',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tipo', models.CharField(max_length=30)),
                ('detalle', models.CharField(blank=True, max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Usuario',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('usuario', models.CharField(max_length=20)),
                ('clave', models.CharField(max_length=50)),
                ('estado', models.CharField(max_length=1)),
                ('fec_ingresa', models.DateTimeField(blank=True, null=True)),
                ('fec_modifica', models.DateTimeField(blank=True, null=True)),
                ('usuario_ing_id', models.IntegerField(blank=True, null=True)),
                ('usuario_mod_id', models.IntegerField(blank=True, null=True)),
                ('has_personal', models.CharField(default='on', max_length=3)),
                ('has_usuario', models.CharField(default='on', max_length=3)),
                ('has_area', models.CharField(default='on', max_length=3)),
                ('has_norma', models.CharField(default='on', max_length=3)),
                ('has_auditoria', models.CharField(default='on', max_length=3)),
                ('has_documental', models.CharField(default='on', max_length=3)),
                ('has_sac', models.CharField(default='on', max_length=3)),
                ('has_indicadores', models.CharField(default=0, max_length=3)),
                ('director', models.IntegerField(default=0)),
                ('colaborador', models.IntegerField(default=0)),
                ('auditor', models.IntegerField(default=0)),
                ('auditor_lider', models.IntegerField(default=0)),
                ('lider_norma', models.IntegerField(default=0)),
                ('permiso_lectura', models.IntegerField(default=0)),
                ('permiso_escritura', models.IntegerField(default=0)),
                ('id_personal', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='personal.Personal')),
                ('id_tipo_usuario', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='seguridad.TipoUsuario')),
            ],
        ),
    ]
