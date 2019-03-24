from __future__ import unicode_literals

from django.db import models
from areas.models import Areas, Procesos
from personal.models import Personal
# Create your models here.
class Normas(models.Model):
    
    nombre=models.CharField(max_length=50, unique=True)
    docfile = models.FileField(upload_to='normas/' ,null=True)
    estado=models.CharField(max_length=1)
    fec_ingresa = models.DateTimeField(blank=True, null=True)
    fec_modifica = models.DateTimeField(blank=True, null=True)
    usuario_ing_id = models.IntegerField(blank=True, null=True)
    usuario_mod_id = models.IntegerField(blank=True, null=True)
    auditor_lider = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)

class Clausulas(models.Model):

    id_norma=models.ForeignKey(Normas, on_delete=models.CASCADE)
    clausula=models.CharField(max_length=100)
    detalle=models.TextField()

#procesos vinculados con sus clausulas
class ProcesoClausula(models.Model):

    id_area=models.ForeignKey(Areas, on_delete=models.CASCADE)
    id_proceso=models.ForeignKey(Procesos, on_delete=models.CASCADE)
    id_norma=models.ForeignKey(Normas, on_delete=models.CASCADE)
    id_clausula=models.ForeignKey(Clausulas, on_delete=models.CASCADE)

