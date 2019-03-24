from __future__ import unicode_literals

from django.db import models
#from normas.models import Normas, Clausulas
from personal.models import Personal


class Areas(models.Model):
    area=models.CharField(max_length=50)
    descripcion=models.CharField(max_length=100)
    id_personal=models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    estado=models.CharField(max_length=1)
    tipo_proceso = models.CharField(max_length=20, null=True) 
    fec_ingresa = models.DateTimeField(blank=True, null=True)
    fec_modifica = models.DateTimeField(blank=True, null=True)
    usuario_ing_id = models.IntegerField(blank=True, null=True)
    usuario_mod_id = models.IntegerField(blank=True, null=True)

class Procesos(models.Model):
    proceso = models.CharField(max_length=150)
    url_carpeta = models.CharField(max_length=300, null=True)
    tipo_proceso = models.CharField(max_length=1, null=True)
    disponible=models.CharField(max_length=1, null=True)
    estado=models.CharField(max_length=1)


class Area_Proceso(models.Model):
    area = models.ForeignKey(Areas, on_delete=models.CASCADE, blank=True, null=True)
    proceso = models.ForeignKey(Procesos, on_delete=models.CASCADE, blank=True, null=True)
    personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    rol = models.IntegerField(null=True, blank=True)
    personal_disponible = models.CharField(max_length=1, null=True)


class Personal(models.Model):
    procedimiento = models.ForeignKey(Area_Proceso, on_delete=models.CASCADE, related_name='procedimiento', null=True)
    personal = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    rol = models.IntegerField(null=True)
