# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2019-03-21 23:47
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('indicadores', '0012_ejesestrategicos'),
    ]

    operations = [
        migrations.CreateModel(
            name='PesosResponsables',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pesoEmpresa', models.IntegerField()),
                ('pesoIndividual', models.IntegerField()),
                ('pesoTrabajoEquipo', models.IntegerField()),
                ('pesoOtros', models.IntegerField()),
                ('estado', models.IntegerField(default=1)),
                ('departamento', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='indicadores.Departamentos')),
                ('responsable', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='indicadores.Responsables')),
            ],
        ),
    ]