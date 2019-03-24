from __future__ import unicode_literals

from django.db import models
from normas.models import Normas, ProcesoClausula, Clausulas
from areas.models import Areas, Procesos
from seguridad.models import Usuario
from personal.models import Personal

# Create your models here.
class Auditores(models.Model):

    id_norma=models.ForeignKey(Normas, on_delete=models.CASCADE, null=True)
    id_area=models.ForeignKey(Areas, on_delete=models.CASCADE, null=True)
    id_proceso=models.ForeignKey(Procesos, on_delete=models.CASCADE, null=True)
    id_auditor=models.ForeignKey(Usuario, on_delete=models.CASCADE)
    proceso_clausula = models.ForeignKey(ProcesoClausula, on_delete=models.CASCADE, null=True)


class Auditorias(models.Model):
    
    numero_auditoria=models.CharField(max_length=50 ,blank=True, null=True)
    lugar=models.CharField(max_length=50)
    fec_inicio=models.DateField()
    hora_inicio=models.TimeField(blank=True, null=True)
    fec_fin=models.DateField()
    hora_fin=models.TimeField(blank=True, null=True)
    id_auditor=models.ForeignKey(Auditores, on_delete=models.CASCADE)
    id_norma=models.ForeignKey(Normas, on_delete=models.CASCADE)
    id_area=models.ForeignKey(Areas, on_delete=models.CASCADE)
    id_proceso=models.ForeignKey(Procesos, on_delete=models.CASCADE, null=True)
    id_clausula = models.ForeignKey(Clausulas, on_delete=models.CASCADE, null=True)
    objetivo=models.CharField(max_length=100)


class ListaVerificacion(models.Model):
    auditoria = models.CharField(max_length=50)
    auditor = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='nombre_audit')
    lista_verificacion = models.TextField()
    observacion = models.CharField(max_length=300, null=True)
    auditor_lider = models.ForeignKey(Personal, on_delete=models.CASCADE, related_name='auditor_lider')