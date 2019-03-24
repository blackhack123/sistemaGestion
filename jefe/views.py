# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.shortcuts import redirect
from django.http import HttpResponse, JsonResponse
import json
#IMPORTAMOS LA CONEXION PARA QUERY PERSONALIZADO
from django.db import connection, transaction
#dictfetchall
from principal.views import dictfetchall, notificacion_director
#models
from personal.models import Personal
from auditoria.models import Auditorias
from sac.models import Sac, PlanAccion
from areas.models import Procesos
from documentos.models import Documento, Revision

#importamos el form documento
from documentos.forms import DocumentacionForm
from procesos.forms import ReemplazarForm
from documentos.models import Documento, Revision
from normas.models import Normas


# Create your views here.
@notificacion_director
def jefe(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        
        cursor = connection.cursor()
        query = "SELECT auditoria_auditorias.numero_auditoria FROM  auditoria_auditorias GROUP BY auditoria_auditorias.numero_auditoria "
        cursor.execute(query)
        rows = dictfetchall(cursor)
        
        #CONVIERTE  QuerySet  a list object
        num_auditorias_list= list(rows) 

        context={
            'personal':Personal.objects.values('id', 'nombre').filter(estado=1),
            'auditorias':num_auditorias_list,
            'jefes':Personal.objects.values('id', 'nombre').all().filter(estado=1),
            'sacs':Sac.objects.values('id').all().filter(estado_cabecera=1),
        }
        
        return render(request, 'jefeArea/jefe.html', context)


def updateSacJefe(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_sac = request.POST.get('id_sac')
            descripcion_correcion = request.POST.get('descripcion_correcion')
            analisis_causa= request.POST.get('analisis_causa')

            if descripcion_correcion:

                descripcion = descripcion_correcion
            else:

                descripcion = None

            Sac.objects.filter(pk=id_sac).update(
                descripcion_correcion=descripcion,
                analisis_causa=analisis_causa,
                estado_cabecera = 3
            )
            if 'notificacionJefe' in request.session:
                del request.session['notificacionJefe']

            data = {
                'resultado':'ok_update',
                'mensaje': 'Datos Actualizados Correctamente !!',
            }
            return HttpResponse(json.dumps(data), content_type="application/json")


def insertPlanAccion(request):

    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():
            
            planes = request.POST.get('data')
            id_sac = request.POST.get('id_sac')

            import json
            planes_json = json.loads(planes)

            
            for plan in planes_json['gridData']:
                with transaction.atomic():
                    plan_accion = PlanAccion(
                        detalle_plan_accion = plan['detalle'],
                        plazo_plan_accion = plan['plazo'],
                        responsable_plan_accion_id = plan['responsable'],
                        sac_id = plan['id_sac'],
                        recursoHumano = plan['recursoHumano'],
                        detalleRecursoHumano = plan['detalleRecursoHumano'],
                        recursoTecnico = plan['recursoTecnico'],
                        detalleRecursoTecnico = plan['detalleRecursoTecnico'],
                        recursoFinanciero = plan['recursoFinanciero'],
                        detalleRecursoFinanciero = plan['detalleRecursoFinanciero']
                    )
                    plan_accion.save()
            
            Sac.objects.filter(pk=id_sac).update(
                sac_jefe = None
            )
            if 'notificacionJefe' in request.session:
                del request.session['notificacionJefe']

            json = {
                'resultado':'ok_insert',
                'mensaje': 'Datos Grabados Correctamente !!',
            }
            return JsonResponse(json, safe=False)
            


def updatePlan(request):

    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        if request.method == 'POST' and request.is_ajax():

            id_plan = request.POST.get('id_plan')
            plan = request.POST.get('plan')
            plazo = request.POST.get('plazo')
            responsable_id = request.POST.get('responsable_id')

            PlanAccion.objects.filter(pk=id_plan).update(
                detalle_plan_accion=plan,
                plazo_plan_accion=plazo,
                responsable_plan_accion_id = responsable_id
            )

            json = {
                'resultado':'ok_update',
                'mensaje': 'Datos Grabados Correctamente !!',
            }
            return JsonResponse(json, safe=False)



def deletePlanAccion(request):

    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        if request.method == 'POST' and request.is_ajax():
            
            id_plan = request.POST.get('id_plan')

            #eliminar plan
            PlanAccion.objects.filter(pk=id_plan).delete()
            #resultado
            json = {
                'resultado':'ok_delete',
                'mensaje': 'Datos Eliminados Correctamente !!',
            }
            return JsonResponse(json, safe=False)



def selectPlanAccion(request):
    
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

            id_sac = request.GET['id_sac']
            
            
            cursor = connection.cursor()
            query = " SELECT sac_planaccion.detalle_plan_accion, sac_planaccion.plazo_plan_accion,  sac_planaccion.responsable_plan_accion_id "
            query = query + " FROM sac_planaccion "
            query = query + " WHERE sac_planaccion.sac_id=%s"
            params=[id_sac]

            cursor.execute(query, params)

            rows = dictfetchall(cursor)
    
            from sac.views import json_serial
            return HttpResponse(json.dumps(rows,  default=json_serial), content_type="application/json")



def selectPlanColab(request):
    
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        
        if request.method == 'POST' and request.is_ajax():
            
            id_plan = request.POST.get('id_plan')
            
            
            cursor = connection.cursor()
            query = " SELECT * "
            query = query + " FROM sac_planaccion "
            query = query + " WHERE sac_planaccion.id=%s"
            params=[id_plan]

            cursor.execute(query, params)

            rows = dictfetchall(cursor)
    
            from sac.views import json_serial
            return HttpResponse(json.dumps(rows,  default=json_serial), content_type="application/json")


@notificacion_director
def adminJefeDoc(request):
    
    """
    LISTADO DE DIRECTORIO POR ID USUARIO 
    Y PROCESO VINCULADO
    """
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:


        cursor = connection.cursor()
        query = " SELECT DISTINCT areas_areas.area AS proceso "
        query = query + " FROM areas_area_proceso "
        query = query + " LEFT JOIN areas_areas ON areas_area_proceso.area_id = areas_areas.id  "
        #query = query + " LEFT JOIN areas_personal ON areas_area_proceso.id = areas_personal.procedimiento_id "
        query = query + " WHERE areas_area_proceso.personal_id =%s "
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
                    
        context={
            'archivos_list': alldirectorys,
            'documentoForm':DocumentacionForm,
            'reemplazarForm':ReemplazarForm
        }
        return render(request, 'jefeArea/directorios.html', context)


@notificacion_director
def estadoDocJefe(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')
    else:


        context={
        }
        return render(request, 'jefeArea/estadoDocumentacion.html', context)



def updateDocJefe(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')
    else:


        id_revision = request.POST.get('id_revision')
        id_documento = request.POST.get('id_documento')
        #estado 2=observacion 3=aprobado
        estado = request.POST.get('estado_documento')

        import datetime
        fecha_actual = datetime.datetime.now().strftime ("%Y-%m-%d")

        #existe observacion
        if estado == '2':

            observacion = request.POST.get('observaciones_documento')
        else:
            observacion = None



        Documento.objects.filter(pk=id_documento).update(
            estado = estado
        )


        Revision.objects.filter(pk=id_revision).update(
            fec_rev_director = fecha_actual,
            estado_rev_director = estado,
            observacion_rev_director = observacion
        )
        #borrar alerta
        if  'notificacionDocPorRevisar' in request.session  :
            del request.session['notificacionDocPorRevisar'] 

        return redirect('estadoDocJefe')


def selectNotLider(request):
        # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:
        if request.method == "POST" and request.is_ajax():
            
            cursor = connection.cursor()
            query = " SELECT DISTINCT areas_procesos.proceso, areas_procesos.estado_colaborador, areas_procesos.estado_encargado, "
            query = query + " areas_procesos.observaciones_encargado, areas_procesos.estado_lider, areas_procesos.observaciones_lider, "
            query = query + " areas_procesos.estado_admin "
            query = query + " FROM areas_procesos "
            query = query + " LEFT JOIN areas_area_proceso ON areas_procesos.id = areas_area_proceso.proceso_id "
            query = query + " WHERE areas_procesos.estado_encargado = 4"
            query = query + " AND areas_area_proceso.personal_id =%s "
            params=[request.session['idUsuario']]

            cursor.execute(query, params)

            rows=dictfetchall(cursor)
            list_rows = list(rows)
            
            return JsonResponse(list_rows, safe=False)





def GridDocumentacionDirector(request):

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
        query = query + " WHERE documentos_revision.director_id =%s "
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