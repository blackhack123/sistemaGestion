# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2018-10-01 19:54
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auditoria', '0001_initial'),
        ('areas', '0001_initial'),
        ('personal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Estado',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('estado_aprobacion', models.CharField(max_length=1, null=True)),
                ('fecha_aprobacion', models.DateField(null=True)),
                ('observaciones_aprobacion', models.TextField(null=True)),
                ('estado_cierre_accion', models.CharField(max_length=1, null=True)),
                ('fecha_cierre_accion', models.DateField(null=True)),
                ('estado_detalle', models.CharField(default=0, max_length=1, null=True)),
                ('observacion_detalle', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PlanAccion',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('detalle_plan_accion', models.TextField(null=True)),
                ('plazo_plan_accion', models.DateField(null=True)),
                ('justificacion_plan', models.TextField(null=True)),
                ('observacion_plan', models.TextField(null=True)),
                ('estado_plan', models.CharField(default=0, max_length=1, null=True)),
                ('fecha_seguimiento', models.DateField(null=True)),
                ('detalle_seguimiento', models.TextField(null=True)),
                ('observacion_seguimiento', models.TextField(null=True)),
                ('estado_seguimiento', models.CharField(default=0, max_length=1, null=True)),
                ('responsable_plan_accion', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='responsable_plan_accion', to='personal.Personal')),
                ('responsable_seguimiento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='responsable_seguimiento', to='personal.Personal')),
            ],
        ),
        migrations.CreateModel(
            name='Revision',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fec_rev_director', models.DateField(null=True)),
                ('observacion_rev_director', models.CharField(max_length=100, null=True)),
                ('estado_rev_director', models.IntegerField(null=True)),
                ('fec_rev_auditor', models.DateField(null=True)),
                ('observacion_rev_auditor', models.CharField(max_length=100, null=True)),
                ('estado_rev_auditor', models.IntegerField(null=True)),
                ('admin', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='administrador', to='personal.Personal')),
                ('auditor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='auditor', to='personal.Personal')),
                ('auditoria', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='auditoria.Auditorias')),
                ('director', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='personal.Personal')),
            ],
        ),
        migrations.CreateModel(
            name='RevisionPlan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('justificacion_responsable', models.TextField(null=True)),
                ('observacion_rev_responsable', models.CharField(max_length=100, null=True)),
                ('fec_rev_responsable', models.DateField(null=True)),
                ('estado_rev_responsable', models.IntegerField(null=True)),
                ('justificacion_seguimiento', models.TextField(null=True)),
                ('observacion_rev_seguimiento', models.CharField(max_length=100, null=True)),
                ('fec_rev_seguimiento', models.DateField(null=True)),
                ('estado_rev_seguimiento', models.IntegerField(null=True)),
                ('plan', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sac.PlanAccion')),
                ('responsable', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='personal.Personal')),
                ('seguimiento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='seguimiento', to='personal.Personal')),
            ],
        ),
        migrations.CreateModel(
            name='Sac',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('numero_auditoria', models.CharField(max_length=50, null=True)),
                ('tipo_solicitud', models.CharField(max_length=2, null=True)),
                ('area', models.IntegerField(null=True)),
                ('origen', models.CharField(max_length=50, null=True)),
                ('fecha_solicitud', models.DateField(null=True)),
                ('criticidad', models.CharField(max_length=100, null=True)),
                ('descripcion_hallazgo', models.TextField(null=True)),
                ('estado_cabecera', models.CharField(default=0, max_length=1, null=True)),
                ('sac_jefe', models.CharField(default=0, max_length=1, null=True)),
                ('observacion_cabecera', models.CharField(max_length=50, null=True)),
                ('descripcion_correcion', models.TextField(null=True)),
                ('analisis_causa', models.TextField(null=True)),
                ('procedimiento', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='areas.Procesos')),
                ('responsable', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='responsable', to='personal.Personal')),
                ('solicitante', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='solicitante', to='personal.Personal')),
            ],
        ),
        migrations.AddField(
            model_name='revision',
            name='sac',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sac.Sac'),
        ),
        migrations.AddField(
            model_name='planaccion',
            name='sac',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sac.Sac'),
        ),
        migrations.AddField(
            model_name='estado',
            name='sac',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sac.Sac'),
        ),
    ]
