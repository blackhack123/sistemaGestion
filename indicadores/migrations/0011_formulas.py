# -*- coding: utf-8 -*-
# Generated by Django 1.9.8 on 2019-03-21 00:53
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('indicadores', '0010_variables'),
    ]

    operations = [
        migrations.CreateModel(
            name='Formulas',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion', models.CharField(blank=True, max_length=300, null=True)),
                ('operador1', models.CharField(blank=True, max_length=100, null=True)),
                ('operador2', models.CharField(blank=True, max_length=100, null=True)),
                ('operador3', models.CharField(blank=True, max_length=100, null=True)),
                ('operador4', models.CharField(blank=True, max_length=100, null=True)),
                ('operador5', models.CharField(blank=True, max_length=100, null=True)),
                ('operador6', models.CharField(blank=True, max_length=100, null=True)),
                ('estado', models.IntegerField(default=1)),
                ('variable1', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='variable_1', to='indicadores.Variables')),
                ('variable2', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='variable_2', to='indicadores.Variables')),
                ('variable3', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='variable_3', to='indicadores.Variables')),
                ('variable4', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='variable_4', to='indicadores.Variables')),
                ('variable5', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='variable_5', to='indicadores.Variables')),
                ('variable6', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='variable_6', to='indicadores.Variables')),
            ],
        ),
    ]
