from django import forms


class FormNorma(forms.Form):

    idNorma=forms.CharField(max_length=10)
    idNorma.widget.attrs.update({'id':'idNorma'})

    norma = forms.CharField(max_length=50)
    norma.widget.attrs.update({'class':'form-control', 'id':'norma', 'required':'required'})

    docNorma=forms.FileField()
    docNorma.widget.attrs.update({'class':'form-control', 'id': 'docNorma', 'onChange':'required_pdf(this)',  'required':'required'})

    opcionesEstado = (('1', 'Activo'),('0', 'Inactivo'))
    estado = forms.ChoiceField(choices=opcionesEstado)
    estado.widget.attrs.update({'class':'form-control', 'id':'estado', 'required':'required'})