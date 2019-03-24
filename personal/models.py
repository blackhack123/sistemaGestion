from __future__ import unicode_literals

from django.db import models


# Create your models here.
class Cargo(models.Model):
    nombre=models.CharField(max_length=50)
    estado=models.CharField(max_length=1, default=1)
    descripcion=models.CharField(max_length=100, null=True)

    def __str__(self):
            return self.nombre

class AreaPersonal(models.Model):
    nombre=models.CharField(max_length=50)
    estado=models.CharField(max_length=1, default=1)
    descripcion=models.CharField(max_length=100, null=True)
    
    
class Personal(models.Model):
    nombre=models.CharField(max_length=50)
    telefono=models.CharField(max_length=9, null=True)
    celular=models.CharField(max_length=10, null=True)
    correo=models.CharField(max_length=50)
    estado=models.CharField(max_length=1, default=1, null=True)
    id_cargo=models.ForeignKey(Cargo, on_delete=models.CASCADE, null=True, related_name='cargo')
    id_areapersonal=models.ForeignKey(AreaPersonal, on_delete=models.CASCADE, null=True)
    carpeta=models.CharField(max_length=100, null=True),
    firma = models.FileField(null=True, max_length=200)

    def __str__(self):
        return self.nombre