from django import forms

class ProcesoForm(forms.Form):

    idProceso=forms.CharField(max_length=10)
    idProceso.widget.attrs.update({'id':'idProceso'})


    proceso = forms.CharField(max_length=150)
    proceso.widget.attrs.update({'class':'form-control', 'id':'proceso', 'required':'required', 'onkeyup':'javascript:copiar_valores_input($(this).val());'})

    docProceso=forms.FileField()
    docProceso.widget.attrs.update({'class':'form-control', 'id': 'docProceso'})

    #se agregar por sugerencia
    opcionesTipo = (('1', 'Vertical'),('0', 'Transversal'),)
    tipo_proceso = forms.ChoiceField(choices=opcionesTipo)
    tipo_proceso.widget.attrs.update({'class':'form-control', 'id':'tipo_proceso', 'required':'required'})

    opcionesEstado = (('1', 'Activo'),('0', 'Inactivo'),)
    estado = forms.ChoiceField(choices=opcionesEstado)
    estado.widget.attrs.update({'class':'form-control', 'id':'estado', 'required':'required'})


class ReemplazarForm(forms.Form):


    archivo=forms.FileField()
    archivo.widget.attrs.update({'class':'form-control', 'required':'required'})

    archivo_anterior=forms.CharField(max_length=10)
    archivo_anterior.widget.attrs.update({'id':'archivo_anterior'})

    carpeta_anterior=forms.CharField(max_length=10)
    carpeta_anterior.widget.attrs.update({'id':'carpeta_anterior'})