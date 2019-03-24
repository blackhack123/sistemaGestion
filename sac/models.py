from __future__ import unicode_literals

from django.db import models
from personal.models import Personal
from areas.models import Procesos
from auditoria.models import  Auditorias


class Sac(models.Model):
    sac = models.ForeignKey('self', null=True, on_delete=models.CASCADE, related_name='sac_anterior')
    numero_auditoria=models.CharField(max_length=50, null=True)
    tipo_solicitud=models.CharField(max_length=2, null=True)
    area=models.IntegerField(null=True)
    procedimiento = models.ForeignKey(Procesos, on_delete=models.CASCADE, null=True)
    origen=models.CharField(max_length=50, null=True)
    fecha_solicitud=models.DateField(null=True)
    criticidad=models.CharField(max_length=100, null=True)
    responsable=models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='responsable')
    solicitante=models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='solicitante')
    descripcion_hallazgo=models.TextField(null=True)
    estado_cabecera=models.CharField(max_length=1, null=True, default=0)
    sac_jefe=models.CharField(max_length=1, null=True, default=0)
    observacion_cabecera=models.CharField(max_length=50, null=True)
    descripcion_correcion=models.TextField(null=True)
    analisis_causa=models.TextField(null=True)


class PlanAccion(models.Model):
    sac = models.ForeignKey(Sac, on_delete=models.CASCADE, null=True)
    recursoHumano = models.IntegerField(null=True)
    detalleRecursoHumano = models.CharField(max_length=300, null=True)
    recursoTecnico = models.IntegerField(null=True)
    detalleRecursoTecnico = models.CharField(max_length=300, null=True)
    recursoFinanciero = models.IntegerField(null=True)
    detalleRecursoFinanciero = models.CharField(max_length=300, null=True)
    detalle_plan_accion=models.TextField(null=True)
    plazo_plan_accion=models.DateField(null=True)
    responsable_plan_accion=models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='responsable_plan_accion')
    justificacion_plan=models.TextField(null=True)
    observacion_plan = models.TextField(null=True)
    estado_plan = models.CharField(max_length=1, null=True, default=0)
    fecha_seguimiento=models.DateField(null=True)
    responsable_seguimiento=models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='responsable_seguimiento')
    detalle_seguimiento=models.TextField(null=True)
    observacion_seguimiento = models.TextField(null=True)
    estado_seguimiento=models.CharField(max_length=1, null=True, default=0)


class Estado(models.Model):
    sac=models.ForeignKey(Sac, on_delete=models.CASCADE, null=True)
    estado_aprobacion=models.CharField(max_length=1, null=True)
    fecha_aprobacion=models.DateField(null=True)
    observaciones_aprobacion=models.TextField(null=True)
    estado_cierre_accion=models.CharField(max_length=1, null=True)
    fecha_cierre_accion=models.DateField(null=True)
    estado_detalle=models.CharField(max_length=1, null=True, default=0)
    observacion_detalle=models.CharField(max_length=50, null=True)


class Revision(models.Model):
    sac = models.ForeignKey(Sac, on_delete=models.CASCADE, null=True)
    auditoria = models.ForeignKey(Auditorias, on_delete=models.CASCADE, null=True)
    fec_rev_director = models.DateField(null=True)
    observacion_rev_director = models.CharField(max_length=100,null=True)
    director = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    estado_rev_director = models.IntegerField(null=True)
    fec_rev_auditor = models.DateField(null=True)
    observacion_rev_auditor = models.CharField(max_length=100, null=True)
    auditor = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='auditor')
    estado_rev_auditor = models.IntegerField(null=True)
    admin = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='administrador')


class RevisionPlan(models.Model):
    plan = models.ForeignKey(PlanAccion, on_delete=models.CASCADE, null=True)
    responsable = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True)
    justificacion_responsable = models.TextField(null=True)
    observacion_rev_responsable = models.CharField(max_length=100,null=True)
    fec_rev_responsable = models.DateField(null=True)
    estado_rev_responsable = models.IntegerField(null=True)
    seguimiento = models.ForeignKey(Personal, on_delete=models.CASCADE, null=True, related_name='seguimiento')
    justificacion_seguimiento = models.TextField(null=True)
    observacion_rev_seguimiento = models.CharField(max_length=100, null=True)
    fec_rev_seguimiento = models.DateField(null=True)
    estado_rev_seguimiento = models.IntegerField(null=True)

    


