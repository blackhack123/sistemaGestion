import os
from os import listdir
from django import forms
from principal.views import dictfetchall
class DocumentacionForm(forms.Form):


    archivo=forms.FileField()
    archivo.widget.attrs.update({'class':'form-control', 'required':'required'})
