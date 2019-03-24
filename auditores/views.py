# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect

from django.http import JsonResponse, HttpResponse

#IMPORTAMOS LA CONEXION PARA QUERY PERSONALIZADO
from django.db import connection
#importamos la conversion a dict
from principal.views import dictfetchall, render_to_pdf, notificacion_lider_norma
#importamos date
from datetime import datetime    
import json
from django.utils.encoding import smart_str
from django.db.models import Count

from auditoria.models import Auditorias, Auditores, ListaVerificacion
from sac.models import Sac, PlanAccion
from personal.models import Personal
from areas.models import Areas, Procesos
from normas.models import Normas
from documentos.models import Documento, Revision
#importamos FORM del Documento
from documentos.forms import DocumentacionForm
from procesos.forms import ReemplazarForm
from normas.models import Normas
from documentos.models import Documento, Revision




#VISTA PRINCIPAL AUDITOR
def auditor(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

       return render(request, 'auditor/auditor.html', {})


#grid auditorias designadas
def audDesignadas(request):

        #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        cursor = connection.cursor()
        #query personalizado
        query = "SELECT auditoria_auditorias.id AS id_auditoria, auditoria_auditorias.lugar,  auditoria_auditorias.fec_inicio, auditoria_auditorias.fec_fin, "
        query = query + " auditoria_auditorias.hora_fin, auditoria_auditorias.objetivo, auditoria_auditorias.id_area_id, auditoria_auditorias.id_norma_id, "
        query = query + " auditoria_auditorias.hora_inicio, auditoria_auditorias.numero_auditoria, auditoria_auditorias.id_auditor_id, "
        query = query + " auditoria_auditorias.id_proceso_id, auditoria_auditorias.numero_auditoria, "
        query = query + " normas_normas.nombre AS nombre_norma, normas_clausulas.clausula, "
        query = query + " areas_areas.area AS nombre_area, "
        query = query + " areas_procesos.proceso AS nombre_proceso, "
        query = query + " personal_personal.nombre AS nombre_auditor "
        query = query + " FROM auditoria_auditorias "
        query = query + " LEFT JOIN normas_normas on auditoria_auditorias.id_norma_id = normas_normas.id "
        query = query + " LEFT JOIN normas_clausulas on auditoria_auditorias.id_clausula_id = normas_clausulas.id "
        query = query + " LEFT JOIN areas_areas on auditoria_auditorias.id_area_id = areas_areas.id "
        query = query + " LEFT JOIN areas_procesos on auditoria_auditorias.id_proceso_id = areas_procesos.id "
        query = query + " LEFT JOIN personal_personal ON auditoria_auditorias.id_auditor_id = personal_personal.id"
        query = query + " WHERE auditoria_auditorias.id_auditor_id = %s "

        #id_auditor = str(request.session['idUsuario'])
        params = [request.session['idUsuario']]
        
        #ejecutar query
        cursor.execute(query, params)

        #convertir query a dict
        rows = dictfetchall(cursor)
        
        # CONVIERTE  QuerySet  a list object
        auditores_list = list(rows) 

        if auditores_list:
            #RETORNA  
            return JsonResponse(auditores_list, safe=False)
        else:
            #RETORNA MENSAJE DE NO EXISTEN SECUENCIAS Y PERMITE CREAR
            json = {
            'resultado':'no_ok',
            'mensaje': 'no existen Procesos',
            }
            return JsonResponse(json, safe=False)

def selNorAud(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        #validar si recibe los datos por ajax
        if request.method == 'POST' and request.is_ajax():


            #abrimos conexion
            cursor = connection.cursor()

            #query personalizado
            query ="SELECT normas_normas.docfile "
            query = query + "FROM auditoria_auditores"
            query = query + " LEFT JOIN normas_normas ON auditoria_auditores.id_norma_id = normas_normas.id"
            query = query + " WHERE auditoria_auditores.id_auditor_id = %s "

            #parametros
            params =str(request.session['idUsuario'])
            
            cursor.execute(query, params)
            #convertir query a dict
            rows = dictfetchall(cursor)
            
            # CONVIERTE  QuerySet  a list object
            normaUrl= list(rows) 

            json = {
            'resultado':'ok_select',
            'normaUrl': normaUrl
            }

            return JsonResponse(json, safe=False)

        else:

            return render(request, 'seguridad/login.html', {})


def auditDoc(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})
    
    else:
        cursor = connection.cursor()
        #listado directorios y archivos
        query = " SELECT DISTINCT areas_areas.area AS proceso "
        query = query + " FROM auditoria_auditorias "
        query = query + " LEFT JOIN areas_areas ON auditoria_auditorias.id_area_id = areas_areas.id "
        query = query + " WHERE auditoria_auditorias.id_auditor_id =%s "
        params=[request.session['idUsuario']]
        cursor.execute(query, params)
        rows_directorios = dictfetchall(cursor)

        alldirectorys = []
        import os
        for directorios in rows_directorios:
            for root, dirs, files in os.walk('media/gestionDocumental'):
                for directory in dirs:
                    if directory == directorios['proceso']:
                        element = {}
                        element['directorio'] =  directory
                        element['ruta_absoluta'] = root+'/'+directory
                        alldirectorys.append(element)

        #numero de auditorias
        query = " SELECT DISTINCT auditoria_auditorias.numero_auditoria "
        query = query + " FROM auditoria_auditorias "
        query = query + " WHERE auditoria_auditorias.id_auditor_id =%s"
        params=[request.session['idUsuario']]
        
        cursor.execute(query, params)
        rows = dictfetchall(cursor)

        query = " SELECT DISTINCT normas_normas.nombre, normas_normas.docfile "
        query = query + " FROM auditoria_auditorias "
        query = query + " LEFT JOIN normas_normas ON normas_normas.id = auditoria_auditorias.id_norma_id "
        query = query + " WHERE auditoria_auditorias.id_auditor_id =%s "
        query = query + " GROUP BY normas_normas.nombre "
        params = [request.session['idUsuario']]

        cursor.execute(query, params)
        rows_nomas = dictfetchall(cursor)

        context={
            'archivos_list': alldirectorys,
            'documentoForm':DocumentacionForm,
            'reemplazarForm':ReemplazarForm,
            #'directorios':list_dir,
            'auditorias': rows,
            'normas_list':Normas.objects.all().filter(estado=1),
            'normas': rows_nomas
        }

        return render(request, 'auditor/docAuditor.html', context)
    


def selPlanEjec(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            numero_auditoria = request.POST.get('numero_auditoria')

            #fecha actual
            now = datetime.now()
            fechaActual=now.strftime("%Y-%m-%d")

            #objetivo
            cursor = connection.cursor()
            query = " SELECT auditoria_auditorias.objetivo "
            query = query + " FROM auditoria_auditorias WHERE auditoria_auditorias.id_auditor_id = %(auditor)s "
            query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s"
            query = query + " GROUP BY objetivo "
            #parametros
            params ={'auditor':request.session['idUsuario'], 'auditoria':numero_auditoria}
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
            # CONVIERTE  QuerySet  a list object
            objetivos = list(rows)

            # AUDITOR LIDER
            query = " SELECT normas_normas.auditor_lider_id, personal_personal.nombre "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN normas_normas ON auditoria_auditorias.id_norma_id = normas_normas.id "
            query = query + " LEFT JOIN personal_personal ON normas_normas.auditor_lider_id= personal_personal.id "
            query = query + " WHERE auditoria_auditorias.id_auditor_id = %(auditor)s "
            query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s "
            query = query + " LIMIT 1"
            # parametros
            params = {'auditor': request.session['idUsuario'], 'auditoria': numero_auditoria}
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
            # CONVIERTE  QuerySet  a list object
            auditorLider_list = list(rows)


            #ALCANCE
            query = " SELECT areas_areas.area, auditoria_auditorias.id_area_id "
            query = query + " FROM auditoria_auditorias LEFT JOIN areas_areas ON areas_areas.id = auditoria_auditorias.id_area_id "
            query = query + " WHERE auditoria_auditorias.id_auditor_id = %(auditor)s "
            query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s"
            query = query + " GROUP BY area "
            #parametros
            params ={'auditor':request.session['idUsuario'], 'auditoria':numero_auditoria}
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
            # CONVIERTE  QuerySet  a list object
            alcance_list= list(rows) 


            #CRITERIO DE LA AUDITORIA
            query = " SELECT areas_procesos.proceso "
            query = query + " FROM areas_procesos LEFT JOIN auditoria_auditorias ON areas_procesos.id = auditoria_auditorias.id_proceso_id "
            query = query + " WHERE auditoria_auditorias.id_auditor_id = %(auditor)s "
            query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s GROUP BY proceso "
            #parametros
            params ={'auditor':request.session['idUsuario'], 'auditoria':numero_auditoria}
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
            # CONVIERTE  QuerySet  a list object
            procesos_list= list(rows) 


            #detalle de plan de ejecucion
            """
            query = " SELECT DISTINCT auditoria_auditorias.fec_inicio,  auditoria_auditorias.hora_inicio,  areas_procesos.proceso AS procedimiento, "
            query = query + " normas_clausulas.clausula,  personal_personal.nombre AS auditor, auditado.nombre AS auditado "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN areas_procesos ON auditoria_auditorias.id_proceso_id = areas_procesos.id "
            query = query + " LEFT JOIN personal_personal ON auditoria_auditorias.id_auditor_id = personal_personal.id "
            query = query + " LEFT JOIN normas_procesoclausula ON auditoria_auditorias.id_proceso_id = normas_procesoclausula.id_proceso_id "
            query = query + " LEFT JOIN normas_clausulas ON normas_procesoclausula.id_clausula_id = normas_procesoclausula.id_clausula_id "
            query = query + " LEFT JOIN areas_areas ON areas_areas.id = auditoria_auditorias.id_area_id "
            query = query + " LEFT JOIN personal_personal auditado ON areas_areas.id_personal_id = auditado.id "
            query = query + " WHERE auditoria_auditorias.id_auditor_id = %(auditor)s "
            query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s"
            query = query + " ORDER BY areas_procesos.proceso "
            """
            query = " SELECT auditoria_auditorias.fec_inicio, auditoria_auditorias.hora_inicio, areas_procesos.proceso AS procedimiento, "
            query = query + " normas_normas.nombre AS norma, normas_clausulas.clausula, personal_personal.nombre AS auditor, "
            query = query + " auditado.nombre AS auditado "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN areas_procesos ON auditoria_auditorias.id_proceso_id = areas_procesos.id "
            query = query + " LEFT JOIN normas_normas ON auditoria_auditorias.id_norma_id = normas_normas.id  "
            query = query + " LEFT JOIN normas_clausulas ON auditoria_auditorias.id_clausula_id = normas_clausulas.id "
            query = query + " LEFT JOIN personal_personal ON auditoria_auditorias.id_auditor_id = personal_personal.id "
            query = query + " LEFT JOIN areas_areas ON auditoria_auditorias.id_area_id = areas_areas.id "
            query = query + " LEFT JOIN personal_personal auditado ON areas_areas.id_personal_id = auditado.id "
            query = query + " WHERE auditoria_auditorias.id_auditor_id =%(auditor)s "
            query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s "
            query = query + " ORDER BY  norma, clausula "

            # parametros
            params = {'auditor': request.session['idUsuario'], 'auditoria': numero_auditoria}
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
            # CONVIERTE  QuerySet  a list object
            detalle_list = list(rows)

            #contexto
            data = {
                'auditoria':numero_auditoria,
                'fechaActual':fechaActual,
                'objetivos':objetivos,
                'alcances':alcance_list,
                'procesos_list':procesos_list,
                'detalle_list':detalle_list,
                'auditorLider_list':auditorLider_list
            }
            return JsonResponse(data, safe=False)
            """
            pdf = render_to_pdf('reportes/pdf/pdfPlanEjecAudit.html', context)

            #FORZAR DOWNLOAD PDF
            if pdf:
                response = HttpResponse(pdf, content_type='application/pdf')
                filename = "Plan_Ejecucion_AuditoriaInterna%s.pdf" %("000_000_001")
                content = "inline; filename='%s'" %(filename)

                content = "attachment; filename='%s'" %(filename)
                response['Content-Disposition'] = content
                return response
            """



def pdfPlanEjecucion(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')
    else:

        if request.method == 'POST':

            texto_ckeditor = request.POST.get('plan_ejecucion') 
            
            context={
                'contenido':texto_ckeditor
            }

            pdf = render_to_pdf('reportes/pdf/pdfPlanEjecAudit.html', context)
            #forzar la descarga
            if pdf:
                response = HttpResponse(pdf, content_type='application/pdf')
                filename = "Lista_verificacion%s.pdf" %("_001")
                content = "inline; filename='%s'" %(filename)

                content = "attachment; filename='%s'" %(filename)
                response['Content-Disposition'] = content
                return response
            



def audiSac(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:


        cursor = connection.cursor()
        query = " SELECT DISTINCT auditoria_auditorias.numero_auditoria FROM  auditoria_auditorias "
        cursor.execute(query)
        rows = dictfetchall(cursor)
        # CONVIERTE  QuerySet  a list object
        num_auditorias_list= list(rows) 


        context={
            #Numero Auditoria
            'sacs':Sac.objects.values('id').all().filter(estado_cabecera=5),
            'auditorias':num_auditorias_list,
            'jefes':Personal.objects.values('id', 'nombre').all().filter(estado=1),
            'solicitante':request.session['idUsuario']
        }
        return render(request, 'auditor/sacsAuditor.html', context)



def gridSacAuditor(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'GET' and request.is_ajax():
            from seguridad.models import Usuario
            auditor = Usuario.objects.get(id_personal_id=request.session['idUsuario'])
            if auditor.auditor == 1:
                query = "SELECT sac_sac.id, auditoria_auditorias.numero_auditoria, auditoria_auditorias.lugar, auditoria_auditorias.fec_inicio, auditoria_auditorias.hora_inicio, "
                query = query + " areas_areas.area AS proceso, areas_procesos.proceso AS procedimiento, personal_personal.nombre AS encargado, personal_auditor.nombre AS auditor, sac_sac.estado_cabecera, "
                query = query + " sac_sac.observacion_cabecera, sac_sac.criticidad , sac_sac.descripcion_hallazgo, sac_sac.analisis_causa, sac_sac.descripcion_correcion, "
                query = query + " sac_sac.sac_id "
                query = query + " FROM sac_sac "
                query = query + " LEFT JOIN auditoria_auditorias ON sac_sac.numero_auditoria = auditoria_auditorias.numero_auditoria "
                query = query + " LEFT JOIN areas_areas ON sac_sac.area = areas_areas.id "
                query = query + " LEFT JOIN areas_procesos ON sac_sac.procedimiento_id = areas_procesos.id  "
                query = query + " LEFT JOIN personal_personal ON sac_sac.responsable_id = personal_personal.id "
                query = query + " LEFT JOIN personal_personal personal_auditor ON sac_sac.solicitante_id = personal_auditor.id "
                query = query + " WHERE sac_sac.solicitante_id =%s "
                query = query + " GROUP BY sac_sac.id ORDER BY numero_auditoria "
            else:
                #query jefe area
                query = "SELECT sac_sac.id, auditoria_auditorias.numero_auditoria, auditoria_auditorias.lugar, auditoria_auditorias.fec_inicio, auditoria_auditorias.hora_inicio, "
                query = query + " areas_areas.area AS proceso, areas_procesos.proceso AS procedimiento, personal_personal.nombre AS encargado, personal_auditor.nombre AS auditor, sac_sac.estado_cabecera, "
                query = query + " sac_sac.observacion_cabecera, sac_sac.criticidad , sac_sac.descripcion_hallazgo, sac_sac.analisis_causa, sac_sac.descripcion_correcion, sac_sac.sac_jefe, "
                query = query + " sac_sac.sac_id "
                query = query + " FROM sac_sac "
                query = query + " LEFT JOIN auditoria_auditorias ON sac_sac.numero_auditoria = auditoria_auditorias.numero_auditoria "
                query = query + " LEFT JOIN areas_areas ON sac_sac.area = areas_areas.id "
                query = query + " LEFT JOIN areas_procesos ON sac_sac.procedimiento_id = areas_procesos.id  "
                query = query + " LEFT JOIN personal_personal ON sac_sac.responsable_id = personal_personal.id "
                query = query + " LEFT JOIN personal_personal personal_auditor ON sac_sac.solicitante_id = personal_auditor.id "
                query = query + " WHERE sac_sac.responsable_id =%s "
                query = query + " GROUP BY sac_sac.id ORDER BY numero_auditoria "

            cursor = connection.cursor()
            #params=str(request.session['idUsuario'])
            
            params=[request.session['idUsuario']]
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
                
            sac_list=list(rows)

            return JsonResponse(sac_list, safe=False)



def adminSacLider(request):

        #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        context={
            'auditorias':Auditorias.objects.raw('SELECT id, numero_auditoria FROM auditoria_auditorias GROUP BY numero_auditoria '),
            'sacs':Sac.objects.values('id').all().filter(estado_cabecera=5),
        }
        return render(request, 'lider/adminSac.html', context)



def gridSacLider(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'GET' and request.is_ajax():

            query = "SELECT sac_sac.id, auditoria_auditorias.numero_auditoria, auditoria_auditorias.lugar, auditoria_auditorias.fec_inicio, auditoria_auditorias.hora_inicio, "
            query = query + " areas_areas.area AS proceso, areas_procesos.proceso AS procedimiento, personal_personal.nombre AS encargado, personal_auditor.nombre AS auditor, sac_sac.estado_cabecera, "
            query = query + " sac_sac.observacion_cabecera, sac_sac.criticidad , sac_sac.descripcion_hallazgo, sac_sac.analisis_causa, sac_sac.descripcion_correcion, sac_sac.sac_id "
            query = query + " FROM sac_sac "
            query = query + " LEFT JOIN auditoria_auditorias ON sac_sac.numero_auditoria = auditoria_auditorias.numero_auditoria "
            query = query + " LEFT JOIN areas_areas ON sac_sac.area = areas_areas.id "
            query = query + " LEFT JOIN areas_procesos ON sac_sac.procedimiento_id = areas_procesos.id  "
            query = query + " LEFT JOIN personal_personal ON sac_sac.responsable_id = personal_personal.id "
            query = query + " LEFT JOIN personal_personal personal_auditor ON sac_sac.solicitante_id = personal_auditor.id "
            query = query + " LEFT JOIN normas_normas ON auditoria_auditorias.id_norma_id = normas_normas.id "
            query = query + " WHERE normas_normas.auditor_lider_id =%s "
            query = query + " GROUP BY  sac_sac.id "

            cursor = connection.cursor()
            #params=str(request.session['idUsuario'])
            
            params=[request.session['idUsuario']]
            cursor.execute(query, params)
            rows = dictfetchall(cursor)
                
            sac_list=list(rows)

            return JsonResponse(sac_list, safe=False)


def getInformeAuditoria(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST':

            numero_auditoria = request.POST.get('numero_auditoria')

            cursor = connection.cursor()
            query = " SELECT auditoria_auditorias.fec_inicio AS fecha_realizacion, auditoria_auditorias.lugar, auditoria_auditorias.objetivo "
            query = query + " FROM auditoria_auditorias "
            query = query + " WHERE auditoria_auditorias.numero_auditoria=%s "
            query = query + " GROUP BY auditoria_auditorias.numero_auditoria "
            params=[numero_auditoria]
            cursor.execute(query, params)
            #encabezado
            rows_encabezado = dictfetchall(cursor)

            # encabezado para normas
            cursor = connection.cursor()
            query = " SELECT DISTINCT normas_normas.nombre "
            query = query + " FROM    auditoria_auditorias "
            query = query + " LEFT JOIN normas_normas ON normas_normas.id = auditoria_auditorias.id_norma_id "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%s "
            params = [numero_auditoria]
            cursor.execute(query, params)

            rows_encabezado_norma = dictfetchall(cursor)  # end

            query = " SELECT areas_areas.area AS proceso,  areas_procesos.proceso AS procedimiento, personal_personal.nombre AS auditor "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN areas_areas ON auditoria_auditorias.id_area_id = areas_areas.id  "
            query = query + " LEFT JOIN areas_procesos ON auditoria_auditorias.id_proceso_id = areas_procesos.id "
            query = query + " LEFT JOIN personal_personal ON auditoria_auditorias.id_auditor_id = personal_personal.id "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%s "
            query = query + " GROUP BY  areas_areas.area,  areas_procesos.proceso "
            params=[numero_auditoria]
            cursor.execute(query, params)
            #alcance_equipo
            rows_alcance_equipo = dictfetchall(cursor)


            query = " SELECT DISTINCT personal_personal.nombre, personal_cargo.nombre AS cargo "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN areas_area_proceso ON auditoria_auditorias.id_proceso_id = areas_area_proceso.proceso_id "
            query = query + " LEFT JOIN personal_personal ON areas_area_proceso.personal_id = personal_personal.id "
            query = query + " LEFT JOIN personal_cargo ON personal_personal.id_cargo_id = personal_cargo.id "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%s "
            query = query + "  AND personal_personal.nombre IS NOT null "
            params = [numero_auditoria]
            cursor.execute(query, params)
            # involucrados
            rows_involucrados = dictfetchall(cursor)

            query = " SELECT DISTINCT personal_personal.nombre, personal_cargo.nombre AS cargo "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN normas_normas ON auditoria_auditorias.id_norma_id = normas_normas.id "
            query = query + " LEFT JOIN personal_personal ON normas_normas.auditor_lider_id = personal_personal.id "
            query = query + " LEFT JOIN personal_cargo ON personal_personal.id_cargo_id = personal_cargo.id "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%s "
            params = [numero_auditoria]
            cursor.execute(query, params)
            # auditor_lider
            rows_auditor_lider = dictfetchall(cursor)


            query = "SELECT DISTINCT personal_personal.nombre, personal_cargo.nombre AS cargo "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN personal_personal ON auditoria_auditorias.id_auditor_id = personal_personal.id "
            query = query + " LEFT JOIN personal_cargo ON personal_personal.id_cargo_id = personal_cargo.id "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%s "
            params = [numero_auditoria]
            cursor.execute(query, params)
            # auditor
            rows_auditor = dictfetchall(cursor)

            query = "SELECT DISTINCT sac_sac.id, areas_areas.area, sac_sac.criticidad, "
            query += " sac_sac.descripcion_hallazgo, sac_sac.analisis_causa "
            query += " FROM auditoria_auditorias "
            query += " LEFT JOIN sac_sac ON auditoria_auditorias.numero_auditoria = sac_sac.numero_auditoria "
            query += " LEFT JOIN areas_areas ON sac_sac.area = areas_areas.id "
            query += " WHERE auditoria_auditorias.numero_auditoria=%s "
            params = [numero_auditoria]
            cursor.execute(query, params)
            rows_noConformidades = dictfetchall(cursor)

            data={
                'encabezado':rows_encabezado,
                'encabezadoNorma':rows_encabezado_norma,
                'alcance_equipo':rows_alcance_equipo,
                'involucrados': rows_involucrados,
                'auditor_lider':rows_auditor_lider,
                'auditor':rows_auditor,
                'rows_noConformidades':rows_noConformidades
            }
            return JsonResponse(data, safe=False)


def pdfInformeAuditoria(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST':

            informe = request.POST.get('informe_auditoria')

            context={
                'informe':informe
            }
            
            pdf = render_to_pdf('reportes/pdf/pdfInformeAuditoria.html', context)
            #forzar la descarga
            if pdf:
                response = HttpResponse(pdf, content_type='application/pdf')
                filename = "Informe_auditoria%s.pdf" %("_001")
                content = "inline; filename='%s'" %(filename)

                content = "attachment; filename='%s'" %(filename)
                response['Content-Disposition'] = content
                return response


def setProceso(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            numero_auditoria = request.POST.get('numero_auditoria')

            cursor = connection.cursor()

            query = " SELECT DISTINCT areas_areas.id, areas_areas.area AS proceso "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN areas_areas ON auditoria_auditorias.id_area_id = areas_areas.id "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%(num_auditoria)s "
            query = query + " AND auditoria_auditorias.id_auditor_id =%(id_usuario)s "

            params = {'num_auditoria':numero_auditoria, 'id_usuario':request.session['idUsuario']}
            cursor.execute(query, params)

            rows=dictfetchall(cursor)

            #auditoria = Auditorias.objects.values('id', 'numero_auditoria', 'id_area_id').all().filter(numero_auditoria=numero_auditoria)
            auditoria_list = list(rows)
            
            return JsonResponse(auditoria_list, safe=False)


def setJefeArea(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_area=request.POST.get('id_area')
            jefe=Areas.objects.values('id_personal_id').all().filter(pk=id_area)
            jefe_list=list(jefe)

            if request.POST.get('numero_auditoria'):
                
                cursor = connection.cursor()

                query = " SELECT DISTINCT areas_procesos.id, areas_procesos.proceso AS procedimiento "
                query = query + " FROM auditoria_auditorias "
                query = query + " LEFT JOIN areas_procesos ON auditoria_auditorias.id_proceso_id = areas_procesos.id "
                query = query + " WHERE auditoria_auditorias.numero_auditoria =%(num_auditoria)s"
                query = query + " AND auditoria_auditorias.id_area_id =%(area)s "
                query = query + " AND auditoria_auditorias.id_auditor_id =%(id_usuario)s "

                params={'num_auditoria':request.POST.get('numero_auditoria'), 'area':id_area, 'id_usuario':request.session['idUsuario'] }
                cursor.execute(query, params)

                rows = dictfetchall(cursor)
                data={
                    'procedimientos':rows,
                    'jefe':jefe_list
                }
                return JsonResponse(data, safe=False)
            else:
                return JsonResponse(jefe_list, safe=False)



def insertSacAuditor(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():
            if 'sac_anterior' in request.POST:
                sac_anterior = request.POST.get('sac_anterior')
            else:
                sac_anterior = None
            numero_auditoria= request.POST.get('numero_auditoria')
            area= request.POST.get('area')
            jefe_area= request.POST.get('jefe_area')
            procedimiento = request.POST.get('procedimiento')
            tipo_solicitud= request.POST.get('tipo_solicitud')
            fecha_solicitud= request.POST.get('fecha_solicitud')
            criticidad= request.POST.get('criticidad')
            responsable= request.POST.get('responsable')
            solicitante= request.POST.get('solicitante')
            descripcion_hallazgo= request.POST.get('descripcion_hallazgo')

            responsable_id=Personal.objects.filter(pk=responsable)
            encabezado_sac=Sac(
                sac_id = sac_anterior,
                numero_auditoria=numero_auditoria,
                area=area,
                procedimiento_id=procedimiento,
                tipo_solicitud=tipo_solicitud,
                fecha_solicitud=fecha_solicitud,
                criticidad=criticidad,
                responsable_id=responsable,
                solicitante_id=solicitante,
                descripcion_hallazgo=descripcion_hallazgo,
                estado_cabecera=0
            )
            encabezado_sac.save()
  
            json = {
            'resultado':'ok_insert',
            'mensaje': 'Datos Grabados Correctamente !!',
            }
            return JsonResponse(json, safe=False)



def getProcedimientos(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():  

            numero_auditoria = request.POST.get('numero_auditoria')
            area = request.POST.get('area')

            cursor = connection.cursor()

            query = " SELECT areas_procesos.id, areas_procesos.proceso AS procedimiento "
            query = query + " FROM auditoria_auditorias "
            query = query + " LEFT JOIN areas_procesos ON auditoria_auditorias.id_proceso_id = areas_procesos.id  "
            query = query + " WHERE auditoria_auditorias.numero_auditoria =%(auditoria)s "
            query = query + " AND auditoria_auditorias.id_area_id =%(area)s "
            query = query + " AND auditoria_auditorias.id_auditor_id =%(auditor)s "
            params = {'auditoria':numero_auditoria, 'area':area, 'auditor':request.session['idUsuario']}

            cursor.execute(query, params)

            rows = dictfetchall(cursor)

            if rows:
                json = {
                    'resultado':'ok_select',
                    'procedimientos': rows,
                }
            else:
                json = {
                    'resultado':'no_ok',
                    'mensaje': 'No existen Procedimientos !!', 
                }
            return JsonResponse(json, safe=False)



def updateSacAuditor(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():    

            id_sac= request.POST.get('id_sac')
            if 'sac_anterior' in request.POST:
                sac_anterior = request.POST.get('sac_anterior')
            else:
                sac_anterior = None
            numero_auditoria= request.POST.get('numero_auditoria')
            area= request.POST.get('area')
            jefe_area= request.POST.get('jefe_area')
            procedimiento = request.POST.get('procedimiento')
            tipo_solicitud= request.POST.get('tipo_solicitud')
            fecha_solicitud= request.POST.get('fecha_solicitud')
            criticidad= request.POST.get('criticidad')
            responsable= request.POST.get('responsable')
            solicitante= request.POST.get('solicitante')
            descripcion_hallazgo= request.POST.get('encabezado')

            Sac.objects.filter(pk=id_sac).update(
                sac_id = sac_anterior,
                numero_auditoria=numero_auditoria,
                area=area,
                procedimiento_id =procedimiento,
                tipo_solicitud=tipo_solicitud,
                fecha_solicitud=fecha_solicitud,
                criticidad=criticidad,
                responsable_id=responsable,
                solicitante_id=solicitante,
                descripcion_hallazgo=descripcion_hallazgo,
                estado_cabecera=0, #pendiente de aprobacion
                
            )


            if 'notificacionAuditor' in request.session:
                del request.session['notificacionAuditor']
                
            json = {
            'resultado':'ok_update',
            'mensaje': 'Datos Grabados Correctamente !!',
            }
            return JsonResponse(json, safe=False)

def lider(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

       return render(request, 'lider/lider.html', {})



def adminLiderDoc(request):
    
    """
    LISTADO DE DIRECTORIO POR ID USUARIO 
    Y PROCESO VINCULADO
    """
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:


        cursor = connection.cursor()
        query = " SELECT DISTINCT areas_areas.area AS proceso "
        query = query + " FROM auditoria_auditorias "
        query = query + " LEFT JOIN normas_normas ON auditoria_auditorias.id_norma_id = normas_normas.id "
        query = query + " LEFT JOIN areas_areas ON auditoria_auditorias.id_area_id = areas_areas.id "
        query = query + " WHERE normas_normas.auditor_lider_id =%s "
        params=[request.session['idUsuario']]
        cursor.execute(query, params)

        rows_directorios = dictfetchall(cursor)

        alldirectorys = []
        import os
        for directorios in rows_directorios:
            for root, dirs, files in os.walk('media/gestionDocumental'):
                for directory in dirs:
                    if directory == directorios['proceso']:
                        print  directorios['proceso']
                        element = {}
                        element['directorio'] =  directory
                        element['ruta_absoluta'] = root+'/'+directory
                        alldirectorys.append(element)

        context = {
            'archivos_list': alldirectorys,
            'documentoForm':DocumentacionForm,
            'reemplazarForm':ReemplazarForm
        }
        return render(request, 'lider/directorios.html', context)

def estadoDocLider(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')
    else:
        """
        cursor = connection.cursor()
        query = " SELECT personal_personal.nombre AS jefe_proceso, areas_procesos.proceso, areas_procesos.estado_colaborador, areas_procesos.estado_encargado, areas_procesos.estado_lider, areas_procesos.estado_admin, "
        query = query + " areas_procesos.id AS id_proceso "
        query = query + " FROM areas_procesos "
        query = query + " LEFT JOIN areas_area_proceso ON areas_procesos.id = areas_area_proceso.proceso_id "
        query = query + " LEFT JOIN areas_areas ON areas_area_proceso.area_id = areas_areas.id "
        query = query + " LEFT JOIN personal_personal ON areas_areas.id_personal_id = personal_personal.id "
        query = query + " WHERE areas_area_proceso.personal_id =%s "
        params =[request.session['idUsuario']]
       
        cursor.execute(query , params)
        rows = dictfetchall(cursor)
        list_estado_documentos = list(rows)
        """
        context={
            #'estado_documentos':list_estado_documentos,
        }
        return render(request, 'lider/estadoDocumentacion.html', context)
    

def updateDocLider(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')
    else:

        id_revision = request.POST.get('id_revision')
        id_documento = request.POST.get('id_documento')

        estado = request.POST.get('estado_documento')
        if estado == '2' :
            observacion = request.POST.get('observaciones_documento')
        else:
            observacion = None
        import datetime
        fecha_actual = datetime.datetime.now().strftime ("%Y-%m-%d")

        Documento.objects.filter(pk=id_documento).update(
            estado = estado
        )

       
        Revision.objects.filter(pk=id_revision).update(
            fec_rev_lider = fecha_actual,
            estado_rev_lider = estado,
            observacion_rev_lider = observacion
        )

        #se elimina notificacion si existe
        if  'notificacionLider' in request.session :
            del request.session['notificacionLider']

        #return redirect('estadoDocLider')
        return  redirect('estadodoc_lidernorma')



def pdfListVerificacion(request):
    
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')
    else:

        if request.method == 'POST':

            texto_ckeditor = request.POST.get('lista_verificacion') 
            
            context={
                'contenido':texto_ckeditor
            }

            pdf = render_to_pdf('reportes/pdf/pdfListaVerificacion.html', context)
            #forzar la descarga
            if pdf:
                response = HttpResponse(pdf, content_type='application/pdf')
                filename = "Lista_verificacion%s.pdf" %("_001")
                content = "inline; filename='%s'" %(filename)

                content = "attachment; filename='%s'" %(filename)
                response['Content-Disposition'] = content
                return response
            


def GridDocumentacionLider(request):

    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        cursor = connection.cursor()
        #if 'nivelUsuario' in request.session :
        query = " SELECT DISTINCT documentos_documento.id AS id_documento, documentos_documento.path, documentos_documento.descripcion, "
        query = query + " documentos_documento.version, documentos_documento.estado, documentos_documento.fec_subido, "
        query = query + " documentos_documento.nombre, areas_areas.area AS proceso,  areas_procesos.proceso AS procedimiento, "
        query = query + " personal_personal.nombre AS nombre_responsable, documentos_documento.procedimiento_id "
        query = query + " FROM auditoria_auditorias "
        query = query + " LEFT JOIN normas_normas ON auditoria_auditorias.id_norma_id = normas_normas.id "
        query = query + " LEFT JOIN documentos_documento ON auditoria_auditorias.id_area_id = documentos_documento.proceso_id "
        query = query + " LEFT JOIN areas_areas ON auditoria_auditorias.id_area_id = areas_areas.id "
        query = query + " LEFT JOIN areas_procesos ON auditoria_auditorias.id_proceso_id = areas_procesos.id "
        query = query + " LEFT JOIN personal_personal ON documentos_documento.subido_por_id = personal_personal.id "
        query = query + " WHERE normas_normas.auditor_lider_id =%s "
        query = query + " GROUP BY  documentos_documento.nombre "


        """
        query = " SELECT DISTINCT documentos_documento.id AS id_documento, documentos_documento.path, documentos_documento.descripcion, "
        query = query + " documentos_documento.version, documentos_documento.estado, documentos_documento.fec_subido, "
        query = query + " documentos_documento.nombre, areas_areas.area AS proceso,  areas_procesos.proceso AS procedimiento, "
        query = query + " personal_personal.nombre AS nombre_responsable, documentos_documento.procedimiento_id "
        query = query + " FROM documentos_documento "
        query = query + " LEFT JOIN areas_areas ON documentos_documento.proceso_id = areas_areas.id "
        query = query + " LEFT JOIN areas_procesos ON documentos_documento.procedimiento_id = areas_procesos.id "
        query = query + " LEFT JOIN personal_personal ON documentos_documento.subido_por_id = personal_personal.id "
        query = query + " LEFT JOIN documentos_revision ON documentos_documento.id = documentos_revision.documento_id "
        query = query + " WHERE documentos_revision.lider_id =%s "
        """
        params = [request.session['idUsuario']]
        cursor.execute(query, params)
        rows = dictfetchall(cursor)

        if rows:
            #RETORNA  
            return JsonResponse(rows, safe=False)
        else:
            #RETORNA MENSAJE DE NO EXISTEN
            json = {
            'resultado':'no_ok',
            'mensaje': 'no existen Documentos',
            }
            return JsonResponse(json, safe=False)

def GridDocumentacionLiderNorma(request):

    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:
        cursor = connection.cursor()

        query = " SELECT DISTINCT documentos_documento.id AS id_documento, documentos_documento.path, documentos_documento.descripcion, "
        query = query + " documentos_documento.version, documentos_documento.estado, documentos_documento.fec_subido, "
        query = query + " documentos_documento.nombre, areas_areas.area AS proceso,  areas_procesos.proceso AS procedimiento, "
        query = query + " personal_personal.nombre AS nombre_responsable, documentos_documento.procedimiento_id "
        query = query + " FROM documentos_documento "
        query = query + " LEFT JOIN areas_areas ON documentos_documento.proceso_id = areas_areas.id "
        query = query + " LEFT JOIN areas_procesos ON documentos_documento.procedimiento_id = areas_procesos.id "
        query = query + " LEFT JOIN personal_personal ON documentos_documento.subido_por_id = personal_personal.id "
        query = query + " LEFT JOIN documentos_revision ON documentos_documento.id = documentos_revision.documento_id "
        query = query + " WHERE documentos_revision.lider_id =%s "

        params = [request.session['idUsuario']]
        cursor.execute(query, params)
        rows = dictfetchall(cursor)

        if rows:
            #RETORNA
            return JsonResponse(rows, safe=False)
        else:
            #RETORNA MENSAJE DE NO EXISTEN
            json = {
            'resultado':'no_ok',
            'mensaje': 'no existen Documentos',
            }
            return JsonResponse(json, safe=False)

@notificacion_lider_norma
def LiderNorma(request):
    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        cursor = connection.cursor()
        query = " SELECT DISTINCT areas_areas.area AS proceso "
        query = query + " FROM areas_area_proceso "
        query = query + " LEFT JOIN areas_areas ON areas_area_proceso.area_id = areas_areas.id  "
        query = query + " WHERE areas_area_proceso.personal_id =%s "
        params = [request.session['idUsuario']]
        cursor.execute(query, params)

        rows_directorios = dictfetchall(cursor)
        #listar directorios y archivos
        alldirectorys = []
        import os
        for directorios in rows_directorios:
            for root, dirs, files in os.walk('media/gestionDocumental'):
                for directory in dirs:
                    if directory == directorios['proceso']:
                        element = {}
                        element['directorio'] = directory
                        element['ruta_absoluta'] = root + '/' + directory
                        alldirectorys.append(element)

        context={
            'archivos_list': alldirectorys
        }
        return render(request, 'norma_lider/directorios.html', context)


@notificacion_lider_norma
def DocumentosLiderNorma(request):

    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        context = {}
        return render(request, 'norma_lider/estadoDocumentacion.html', context)


def SelectDataListaVerificacion(request):
    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        #numero auditoria
        numero_auditoria = request.POST.get('numero_auditoria')
        auditor = request.session['idUsuario']

        auditoria = Auditorias.objects.all().filter(numero_auditoria=numero_auditoria, id_auditor_id=auditor).first()
        fec_auditoria = auditoria.fec_inicio

        #ALCANCE
        cursor = connection.cursor()
        query = " SELECT DISTINCT(normas_clausulas.clausula) "
        query = query + " FROM auditoria_auditores "
        query = query + " LEFT JOIN auditoria_auditorias ON auditoria_auditores.id_auditor_id = auditoria_auditorias.id_auditor_id "
        query = query + " LEFT JOIN normas_procesoclausula ON auditoria_auditores.proceso_clausula_id = normas_procesoclausula.id "
        query = query + "  LEFT JOIN normas_clausulas ON normas_procesoclausula.id_clausula_id = normas_clausulas.id "
        query = query + " WHERE auditoria_auditores.id_auditor_id = %(auditor)s  "
        query = query + " AND auditoria_auditorias.numero_auditoria =%(auditoria)s"
        params = {'auditor': auditor, 'auditoria': numero_auditoria}
        cursor.execute(query, params)
        rows_clausulas = dictfetchall(cursor)

        #auditor_area = Auditores.objects.all().filter(id_auditor_id=auditor).first()
        auditor_area = Auditorias.objects.all().filter(id_auditor_id=auditor).first()
        proceso_auditado = Areas.objects.get(pk=auditoria.id_area_id)
        responsable_auditado = proceso_auditado.id_personal

        data = {
            'resultado': 'ok_select',
            'auditoria': numero_auditoria,
            'fec_auditoria': fec_auditoria,
            'responsable_auditado': smart_str(auditor_area.id_area.id_personal.nombre),
            'auditor_designado': str(request.session['nombreUsuario']),
            'proceso': smart_str(auditor_area.id_area.area),
            'referencias': rows_clausulas,
        }
        return JsonResponse(data, safe=False)