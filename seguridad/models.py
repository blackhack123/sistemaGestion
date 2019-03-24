from __future__ import unicode_literals

from django.db import models
from personal.models import Personal
# Create your models here.

class TipoUsuario(models.Model):
    tipo = models.CharField(max_length=30)
    detalle = models.CharField(max_length=50, blank=True, null=True)


class Usuario(models.Model):

    usuario = models.CharField(max_length=20)
    clave = models.CharField(max_length=50)
    estado = models.CharField(max_length=1)
    fec_ingresa = models.DateTimeField(blank=True, null=True)
    fec_modifica = models.DateTimeField(blank=True, null=True)
    usuario_ing_id = models.IntegerField(blank=True, null=True)
    usuario_mod_id = models.IntegerField(blank=True, null=True)
    id_tipo_usuario = models.ForeignKey(TipoUsuario, on_delete=models.CASCADE, null=True)
    id_personal=models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    has_personal=models.CharField(max_length=3, default="on")
    has_usuario=models.CharField(max_length=3, default="on")
    has_area=models.CharField(max_length=3, default="on")
    has_norma=models.CharField(max_length=3, default="on")
    has_auditoria=models.CharField(max_length=3, default="on")
    has_documental=models.CharField(max_length=3, default="on")
    has_documental=models.CharField(max_length=3, default="on")
    has_sac=models.CharField(max_length=3, default="on")
    has_indicadores=models.CharField(max_length=3, default=0)
    director = models.IntegerField(default=0)
    colaborador = models.IntegerField(default=0)
    auditor = models.IntegerField(default=0)
    auditor_lider = models.IntegerField(default=0)
    lider_norma = models.IntegerField(default=0)
    permiso_lectura = models.IntegerField(default=0)
    permiso_escritura = models.IntegerField(default=0)



