from __future__ import unicode_literals


from django.db import models



class Objetivos(models.Model):
    codigo = models.CharField(max_length=30)
    nombre = models.CharField(max_length=200)
    objetivo = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    indicador = models.CharField(max_length=50)
    signo = models.CharField(max_length=1)
    operacion = models.IntegerField()
    ponderacion = models.CharField(max_length=50, null=True)
    periodos = models.IntegerField(null=True)
    meta = models.IntegerField()
    meta_inicio = models.CharField(max_length=50, null=True)
    meta_fin = models.CharField(max_length=50, null=True)
    observacion = models.CharField(max_length=200, null=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' %(self.nombre)


class Departamentos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=200, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' %(self.nombre)


class Productos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=200, null=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' %(self.nombre)


class Responsables(models.Model):
    nombre = models.CharField(max_length=200)
    correo = models.CharField(max_length=100, null=True)
    telefono = models.CharField(max_length=10, null=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' %(self.nombre)


class Planes(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=300, null=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' % (self.nombre)


class Variables(models.Model):
    nombre = models.CharField(max_length=200)
    operacion = models.IntegerField()
    operacionEntrePeriodos = models.IntegerField(null=True, blank=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' % (self.nombre)


class Formulas(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=300, null=True, blank=True)
    operador1 = models.CharField(max_length=100, null=True, blank=True)
    variable1 = models.ForeignKey(Variables, on_delete=models.CASCADE, null=True, related_name='variable_1')
    operador2 = models.CharField(max_length=100, null=True, blank=True)
    variable2 = models.ForeignKey(Variables, on_delete=models.CASCADE, null=True, related_name='variable_2')
    operador3 = models.CharField(max_length=100, null=True, blank=True)
    variable3 = models.ForeignKey(Variables, on_delete=models.CASCADE, null=True, related_name='variable_3')
    operador4 = models.CharField(max_length=100, null=True, blank=True)
    variable4 = models.ForeignKey(Variables, on_delete=models.CASCADE, null=True, related_name='variable_4')
    operador5 = models.CharField(max_length=100, null=True, blank=True)
    variable5 = models.ForeignKey(Variables, on_delete=models.CASCADE, null=True, related_name='variable_5')
    operador6 = models.CharField(max_length=100, null=True, blank=True)
    variable6 = models.ForeignKey(Variables, on_delete=models.CASCADE, null=True, related_name='variable_6')
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' % (self.nombre)


class EjesEstrategicos(models.Model):
    nombre = models.CharField(max_length=200)
    descripcion = models.CharField(max_length=300, null=True)
    estado = models.IntegerField(default=1)
    def __unicode__(self):
        return u'%s' % (self.nombre)


class PesosResponsables(models.Model):
    responsable = models.ForeignKey(Responsables, on_delete=models.CASCADE)
    departamento = models.ForeignKey(Departamentos, on_delete=models.CASCADE)
    pesoEmpresa = models.IntegerField()
    pesoIndividual = models.IntegerField()
    pesoTrabajoEquipo = models.IntegerField()
    pesoOtros = models.IntegerField()
    estado = models.IntegerField(default=1)
