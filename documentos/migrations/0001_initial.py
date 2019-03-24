# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2018-10-01 19:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('areas', '0001_initial'),
        ('personal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Documento',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('path', models.FileField(max_length=200, null=True, upload_to=b'')),
                ('nombre', models.CharField(max_length=50, null=True)),
                ('descripcion', models.CharField(max_length=100, null=True)),
                ('version', models.CharField(max_length=50, null=True)),
                ('fec_subido', models.DateField(null=True)),
                ('estado', models.IntegerField(default=0)),
                ('procedimiento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='areas.Procesos')),
                ('proceso', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='areas.Areas')),
                ('subido_por', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='personal.Personal')),
            ],
        ),
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fec_rev_director', models.DateField(null=True)),
                ('estado_rev_director', models.IntegerField()),
                ('observacion_rev_director', models.CharField(max_length=100, null=True)),
                ('fec_rev_lider', models.DateField(null=True)),
                ('estado_rev_lider', models.IntegerField()),
                ('observacion_rev_lider', models.CharField(max_length=100, null=True)),
                ('fec_rev_admin', models.DateField(null=True)),
                ('estado_rev_admin', models.IntegerField()),
                ('observacion_rev_admin', models.CharField(max_length=100, null=True)),
                ('admin', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='admin', to='personal.Personal')),
                ('director', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='director', to='personal.Personal')),
                ('documento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='documentos.Documento')),
                ('lider', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lider', to='personal.Personal')),
            ],
        ),
    ]
