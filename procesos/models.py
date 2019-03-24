from __future__ import unicode_literals

from django.db import models
from personal.models import Personal
from areas.models import Procesos, Areas

# Create your models here.

class Colaboradores(models.Model):

    id_personal=models.ForeignKey(Personal, on_delete=models.CASCADE)
    id_area=models.ForeignKey(Areas, on_delete=models.CASCADE, null=True)
    id_proceso=models.ForeignKey(Procesos, on_delete=models.CASCADE)
    


