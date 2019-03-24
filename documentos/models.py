from __future__ import unicode_literals

from django.db import models
from personal.models import Personal
from areas.models import Areas, Procesos


class Documento(models.Model):

    path = models.FileField(null=True, max_length=200)
    nombre = models.CharField(max_length=50, null=True)
    descripcion = models.CharField(max_length=100, null=True)
    version = models.CharField(max_length=50, null=True)
    subido_por = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    fec_subido = models.DateField(null=True)
    proceso = models.ForeignKey(Areas, on_delete=models.CASCADE, null=True)
    procedimiento = models.ForeignKey(Procesos, on_delete=models.CASCADE, null=True)
    estado = models.IntegerField(default=0)


class Revision(models.Model):
    
    #documento
    documento = models.ForeignKey(Documento, on_delete=models.CASCADE,null=True)
    #director de area
    director = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='director')
    fec_rev_director = models.DateField(null=True)
    estado_rev_director = models.IntegerField()
    observacion_rev_director = models.CharField(max_length=100,null=True)
    #lider de norma
    lider = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='lider')
    fec_rev_lider = models.DateField(null=True)
    estado_rev_lider = models.IntegerField()
    observacion_rev_lider = models.CharField(max_length=100, null=True)
    #admin
    admin = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='admin')
    fec_rev_admin = models.DateField(null=True)
    estado_rev_admin = models.IntegerField()
    observacion_rev_admin = models.CharField(max_length=100, null=True)
