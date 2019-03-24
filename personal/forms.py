from django import forms
from django.core.validators import MinLengthValidator
 
from personal.models import Personal, Cargo

class CargoForm(forms.Form):
    pk = forms.CharField(max_length=50)

    nombre = forms.CharField(max_length=50)
    nombre.widget.attrs.update({'class':'form-control', 'required':'required'})

    descripcion = forms.CharField(max_length=100)
    descripcion.widget.attrs.update({'class':'form-control'})

    opcionesEstado = (('1', 'Activo'),('0', 'Inactivo'),)
    estado = forms.ChoiceField(choices=opcionesEstado)
    estado.widget.attrs.update({'class':'form-control', 'required':'required'})


class PersonalForm(forms.Form):

    pk = forms.CharField(max_length=50)

    nombre = forms.CharField(max_length=50)
    nombre.widget.attrs.update({'class':'form-control', 'required': 'true' })

    telefono = forms.CharField(max_length=9)
    telefono.widget.attrs.update({'class':'form-control', 'pattern':'[0-9]+', 'title':'Ingrese solo numeros', 'minlength':'9'})

    celular = forms.CharField(max_length=10)
    celular.widget.attrs.update({'type':'number', 'class':'form-control', 'required': 'true', 'minlength':'10', 'pattern':'[0-9]+', 'title':'Ingrese solo numeros'})

    correo = forms.CharField(max_length=50)
    correo.widget.attrs.update({'class':'form-control', 'required':'true', 'onblur':'validarEmail($(this).val());', 'pattern':'[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$', 'title':'Email Invalido'})

    opcionesEstado = (('1', 'Activo'),('0', 'Inactivo'),)
    estado = forms.ChoiceField(choices=opcionesEstado )
    estado.widget.attrs.update({'class':'form-control', 'required':'true'})

    cargo = forms.CharField(max_length=50)
    area = forms.CharField(max_length=50)

    firma =forms.FileField()
    firma.widget.attrs.update({'class':'form-control', 'id': 'firma'})


    
class AreaForm(forms.Form):
    id = forms.CharField(max_length=50)

    nombre = forms.CharField(max_length=50)
    nombre.widget.attrs.update({'class':'form-control', 'required':'required'})

    descripcion = forms.CharField(max_length=100)
    descripcion.widget.attrs.update({'class':'form-control'})

    opcionesEstado = (('1', 'Activo'),('0', 'Inactivo'),)
    estado = forms.ChoiceField(choices=opcionesEstado)
    estado.widget.attrs.update({'class':'form-control', 'required':'required'})

