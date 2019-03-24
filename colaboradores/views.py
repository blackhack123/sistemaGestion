# -*- coding: utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db import connection, transaction

from sac.models import PlanAccion, RevisionPlan
from principal.views import dictfetchall, notificacion_colaborador
from documentos.forms import DocumentacionForm
from procesos.forms import ReemplazarForm, ProcesoForm
from documentos.models import Documento, Revision
from areas.models import Procesos, Area_Proceso, Areas
from procesos.models import Colaboradores
from seguridad.models import Usuario

#VISTA PRINCIPAL COLABORADOR

@notificacion_colaborador
def colaborador(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        cursor = connection.cursor()
        query = " SELECT DISTINCT areas_areas.area AS proceso "
        query = query + " FROM areas_area_proceso "
        query = query + " LEFT JOIN areas_areas ON areas_area_proceso.area_id = areas_areas.id  "
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


        context = {
            'archivos_list': alldirectorys,
            'documentoForm':DocumentacionForm,
            'reemplazarForm':ReemplazarForm,
        }
        return render(request, 'colaborador/colaborador.html', context)


def selProcCol(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        #validar si recibe los datos por ajax
        if request.method == 'POST' and request.is_ajax():


            #abrimos conexion
            cursor = connection.cursor()

            #query personalizado
            query ="SELECT areas_procesos.docfile "
            query = query + "FROM procesos_colaboradores "
            query = query + " LEFT JOIN areas_procesos ON procesos_colaboradores.id_proceso_id = areas_procesos.id "
            query = query + " WHERE procesos_colaboradores.id_personal_id = '%s' "

            #parametros
            #params =str(request.session['idUsuario'])
            
            cursor.execute(query, [request.session['idUsuario']])
            #convertir query a dict
            rows = dictfetchall(cursor)
            
            # CONVIERTE  QuerySet  a list object
            procesoUrl= list(rows) 

            json = {
            'resultado':'ok_select',
            'procesoUrl': procesoUrl
            }

            return JsonResponse(json, safe=False)

        else:

            return render(request, 'seguridad/login.html', {})


def updateACtProce(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:
        form = DocumentacionForm(request.POST, request.FILES)
        myfile = request.FILES['archivo']

        destino = request.POST.get('destino')
        proceso = Procesos.objects.get(proceso=str(destino))
        nuevo_destino = proceso.url_carpeta

        documento_anterior = Documento.objects.get(pk=request.POST.get('id_documento'))
        path_documento_anterior = str(documento_anterior.path)

        if request.POST.get('accion') == 'insert_revision':
            import os
            os.remove(path_documento_anterior)

        fs = FileSystemStorage(location=nuevo_destino)
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = nuevo_destino+"/"+filename

        id_documento = request.POST.get('id_documento')
        nombre = request.POST.get('nombre')
        descripcion = request.POST.get('descripcion')
        version = request.POST.get('version')

        accion = request.POST.get('accion')

        import datetime
        fecha_actual = datetime.datetime.now().strftime ("%Y-%m-%d")


        if(accion == 'insert_revision'):

            #ids
            director_id = request.POST.get('director_id')
            lider_id = request.POST.get('lider_id')
            admin_id = request.POST.get('admin_id')
            with transaction.atomic():
                revision = Revision(
                    documento_id = id_documento,
                    estado_rev_director=1,
                    estado_rev_lider = 1,
                    estado_rev_admin = 1,
                    director_id = director_id,
                    lider_id = lider_id,
                    admin_id = admin_id
                )
                revision.save()
                Documento.objects.filter(pk=id_documento).update(
                    estado = 1,
                    fec_subido = fecha_actual,
                    path = uploaded_file_url
                )
        else:
            with transaction.atomic():
                Documento.objects.filter(pk=id_documento).update(
                    estado = 1,
                    nombre = nombre,
                    descripcion = descripcion,
                    version = version,
                    fec_subido = fecha_actual,
                    path = uploaded_file_url
                )
                Revision.objects.filter(documento_id=id_documento).update(
                    estado_rev_director=1,
                    estado_rev_lider = 1,
                    estado_rev_admin = 1
                )

        #borrar alerta
        if 'notificacionDocumentosPendientes' in  request.session :

            del request.session['notificacionDocumentosPendientes']

        return redirect('/colaborador')



def UploadNuevoDocumento(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:
        return redirect('login')
    else:

        myfile = request.FILES['documento']
        destino = request.POST.get('destino')
        proceso = Procesos.objects.get(proceso=str(destino))
        nuevo_destino = proceso.url_carpeta

        fs = FileSystemStorage(location=nuevo_destino)
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = nuevo_destino+"/"+filename

        import datetime
        fecha_actual = datetime.datetime.now().strftime ("%Y-%m-%d")
        
        documento = Documento(
            path = uploaded_file_url,
            descripcion = request.POST.get('descripcion'),
            proceso_id = request.POST.get('proceso_id'),
            subido_por_id = request.session['idUsuario'],
            version = request.POST.get('version'),
            estado = 1,
            fec_subido = fecha_actual,
            nombre = request.POST.get('nombre'),
            procedimiento_id = request.POST.get('procedimiento_id')
        )
        documento.save()

        revision = Revision(
            documento_id = documento.id,
            estado_rev_director=1,
            estado_rev_lider = 1,
            estado_rev_admin = 1,
            director_id = request.POST.get('director_id'),
            lider_id = request.POST.get('lider_id'),
            admin_id = request.POST.get('admin_id')
        )
        revision.save()
        from django.contrib import messages
        messages.add_message(request, messages.SUCCESS, 'Documento Subido !!')

        return redirect('/estadoDocColaborador')


def ConsultarVersionAnterior(request):
    documento = Documento.objects.values().all().filter(pk=request.POST.get('documento_id'))
    documento_list = list(documento)
    data ={'resultado':'ok_select', 'documento':documento_list}

    return JsonResponse(data, safe=False)



def NuevaVersionDocumento(request):
    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:
        return redirect('login')
    else:

        myfile = request.FILES['documento']
        destino = request.POST.get('destino')
        proceso = Procesos.objects.get(proceso=str(destino))
        nuevo_destino = proceso.url_carpeta

        fs = FileSystemStorage(location=nuevo_destino)
        filename = fs.save(myfile.name, myfile)
        uploaded_file_url = nuevo_destino + "/" + filename

        import datetime
        fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")
        with transaction.atomic():
            documento = Documento(
                path=uploaded_file_url,
                descripcion=request.POST.get('descripcion'),
                proceso_id=request.POST.get('proceso_id'),
                subido_por_id=request.session['idUsuario'],
                version=request.POST.get('version'),
                estado=1,
                fec_subido=fecha_actual,
                nombre=request.POST.get('nombre'),
                procedimiento_id=request.POST.get('procedimiento_id')
            )
            documento.save()

            revision = Revision(
                documento_id=documento.id,
                estado_rev_director=1,
                estado_rev_lider=1,
                estado_rev_admin=1,
                director_id=request.POST.get('director_id'),
                lider_id=request.POST.get('lider_id'),
                admin_id=request.POST.get('admin_id')
            )
            revision.save()

        from django.contrib import messages
        messages.add_message(request, messages.SUCCESS, 'Documento Subido !!')

        return redirect('/estadoDocColaborador')



@notificacion_colaborador
def colSeguimientos(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:
        cursor = connection.cursor()

        query = " SELECT sac_planaccion.id, sac_planaccion.detalle_plan_accion, sac_planaccion.plazo_plan_accion, sac_planaccion.justificacion_plan, sac_planaccion.responsable_plan_accion_id, sac_planaccion.observacion_plan, sac_planaccion.estado_plan,sac_planaccion.fecha_seguimiento, "
        query = query + " personal_personal.nombre AS personal_seguimiento, sac_planaccion.detalle_seguimiento, sac_planaccion.estado_seguimiento , sac_planaccion.responsable_seguimiento_id, sac_planaccion.observacion_seguimiento "
        query = query + " FROM sac_planaccion "
        query = query + " LEFT JOIN personal_personal ON sac_planaccion.responsable_seguimiento_id = personal_personal.id  "
        query = query + " WHERE (sac_planaccion.responsable_seguimiento_id=%(id_usuario)s) OR (sac_planaccion.responsable_plan_accion_id =%(id_usuario)s) "
        params = {'id_usuario':request.session['idUsuario']}
        print  query
        cursor.execute(query, params)

        rows = dictfetchall(cursor)
        context={
            #'planAccion': PlanAccion.objects.values().all().filter(responsable_plan_accion_id=request.session['idUsuario'])
            'planAccion': rows
        }
        return render(request, 'colaborador/planColaborador.html', context)


def setJustificacionPlan(request):
   
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():
            
            id_plan_accion = request.POST.get('id_plan_accion')
            justificacion = request.POST.get('justificacion')

            plan_accion = PlanAccion.objects.get(pk=id_plan_accion)

            responsable_plan_accion = plan_accion.responsable_plan_accion_id


            #establecer justificacion
            PlanAccion.objects.filter(pk=id_plan_accion).update(
                justificacion_plan = justificacion,
                estado_plan = 0
            )

            #inserta nuevo historico
            revision_plan = RevisionPlan(
                estado_rev_responsable = 0,
                justificacion_responsable = justificacion,
                responsable_id = responsable_plan_accion,
                plan_id = id_plan_accion
            )
            revision_plan.save()

            if 'notificacionPlanAccion' in request.session:
                del request.session['notificacionPlanAccion']
            json = {
                'resultado':'ok_update',
                'mensaje':'Datos grabados exitosamente !!'
            }

            return JsonResponse(json, safe=False)


def setJustiSeguimiento(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():

            id_plan = request.POST.get('id_plan')
            justificacion = request.POST.get('justificacion_seguimiento')
            print id_plan
            #establecer justificacion seguimiento
            PlanAccion.objects.filter(pk=id_plan).update(
                detalle_seguimiento = justificacion,
                estado_seguimiento=2
            )

            try:
                revision_plan = RevisionPlan.objects.get(estado_rev_seguimiento=None, plan_id=id_plan, estado_rev_responsable=1)

                RevisionPlan.objects.filter(plan_id=id_plan, estado_rev_responsable=1).update(
                    seguimiento_id = request.session['idUsuario'],
                    justificacion_seguimiento = justificacion,
                    estado_rev_seguimiento = 0
                )
            except RevisionPlan.DoesNotExist:

                #inserta una nueva revision
                revision_plan = RevisionPlan(
                    seguimiento_id = request.session['idUsuario'],
                    justificacion_seguimiento = justificacion,
                    estado_rev_seguimiento = 0,
                    plan_id=id_plan,
                    estado_rev_responsable = 1,
                )
                revision_plan.save()


            if 'notificacionSeguimiento' in request.session:
                del request.session['notificacionSeguimiento']

            json = {
                'resultado':'ok_update',
                'mensaje':'Datos grabados exitosamente !!'
            }

            return JsonResponse(json, safe=False)



def updateSegCol(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        #return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():

            id_sac = request.POST.get('id_sac')
            seguimiento_realizado = request.POST.get('seguimiento_realizado')

            PlanAccion.objects.filter(id_sac_id=id_sac).update(
                detalle_seguimiento = seguimiento_realizado,
                estado_seguimiento = 3
            )
            #borrar alerta
            if 'notificacionSeguimiento' in request.session:

                del request.session['notificacionSeguimiento']

            json = {
                'resultado':'ok_update',
            }

            return JsonResponse(json, safe=False)



def selSeguimiento(request):

    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():

            id_sac = request.POST.get('id_sac')
            seguimiento = PlanAccion.objects.values().all().filter(id_sac_id=id_sac)
            seguimiento_list = list(seguimiento)

            #json retornante
            json = {
                'resultado':'ok_select',
                'seguimiento': seguimiento_list,
            }

            return JsonResponse(json, safe=False)



def selectProcesoColab(request):
    
    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():
            #id del proceso
            id_proceso = request.POST.get('id_proceso')
            #proceso consultado
            proceso = Procesos.objects.values().all().filter(id=id_proceso)
            #listado
            proceso_list = list(proceso)

            #json retornante
            json = {
                'resultado':'ok_select',
                'proceso_list': proceso_list,
            }
            return JsonResponse(json, safe=False)

@notificacion_colaborador
def estadoDocColaborador(request):
    if 'nombreUsuario' not in request.session:
        return redirect('login')
    else:
        cursor = connection.cursor()
        query = " SELECT areas_procesos.id, areas_procesos.proceso AS procedimiento "
        query = query + " FROM documentos_documento "
        query = query + " LEFT JOIN areas_procesos ON documentos_documento.procedimiento_id = areas_procesos.id "
        query = query + " WHERE documentos_documento.subido_por_id =%s "
        params =[request.session['idUsuario']]
        cursor.execute(query , params)
        rows = dictfetchall(cursor)
        list_estado_documentos = list(rows)

        context={
            'documentoForm':DocumentacionForm,
            'estado_documentos':list_estado_documentos,
            'procedimientos_list': Procesos.objects.all().filter(estado=1)
        }
        return render(request, 'colaborador/estadoDocumentacion.html', context)


def selectNotEncargado(request):
    
    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():

            cursor = connection.cursor()
            query = " SELECT DISTINCT areas_procesos.proceso, areas_procesos.estado_colaborador, areas_procesos.estado_encargado, "
            query = query + " areas_procesos.observaciones_encargado, areas_procesos.estado_lider, areas_procesos.observaciones_lider, "
            query = query + " areas_procesos.estado_admin, areas_procesos.observaciones_admin "
            query = query + " FROM areas_procesos "
            query = query + " LEFT JOIN areas_area_proceso ON areas_procesos.id = areas_area_proceso.proceso_id "
            query = query + " WHERE areas_procesos.estado_colaborador = 2"
            query = query + " AND areas_area_proceso.personal_id =%s "
            params=[request.session['idUsuario']]
           
            cursor.execute(query, params)

            rows=dictfetchall(cursor)
            list_rows = list(rows)
            return JsonResponse(list_rows, safe=False)


def selectNotAdmin(request):
    
    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        if request.method == "POST" and request.is_ajax():

            cursor = connection.cursor()
            query = " SELECT DISTINCT areas_procesos.proceso, areas_procesos.estado_colaborador, areas_procesos.estado_encargado, "
            query = query + " areas_procesos.observaciones_encargado, areas_procesos.estado_lider, areas_procesos.observaciones_lider, "
            query = query + " areas_procesos.estado_admin, areas_procesos.observaciones_admin "
            query = query + " FROM areas_procesos "
            query = query + " LEFT JOIN areas_area_proceso ON areas_procesos.id = areas_area_proceso.proceso_id "
            query = query + " WHERE areas_procesos.estado_colaborador = 6"
            query = query + " AND areas_area_proceso.personal_id =%s "
            params=[request.session['idUsuario']]
            
            cursor.execute(query, params)

            rows=dictfetchall(cursor)
            list_rows = list(rows)
            return JsonResponse(list_rows, safe=False)


def GridDocumentacionColaborador(request):

    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        # return render(request, 'seguridad/login.html', {})
        return redirect('login')

    else:

        cursor = connection.cursor()
        query = " SELECT DISTINCT documentos_documento.id, documentos_documento.path, documentos_documento.descripcion, "
        query = query + " documentos_documento.version, documentos_documento.estado, documentos_documento.fec_subido, "
        query = query + " documentos_documento.nombre, areas_areas.area AS proceso,  areas_procesos.proceso AS procedimiento, "
        query = query + " personal_personal.nombre AS nombre_responsable, documentos_documento.procedimiento_id, documentos_documento.proceso_id, "
        query = query + " documentos_revision.director_id, documentos_revision.lider_id, documentos_revision.admin_id "
        query = query + " FROM documentos_documento "
        query = query + " LEFT JOIN areas_areas ON documentos_documento.proceso_id = areas_areas.id "
        query = query + " LEFT JOIN areas_procesos ON documentos_documento.procedimiento_id = areas_procesos.id "
        query = query + " LEFT JOIN personal_personal ON documentos_documento.subido_por_id = personal_personal.id "
        query = query + " LEFT JOIN documentos_revision ON documentos_documento.id = documentos_revision.documento_id "
        query = query + " WHERE documentos_documento.subido_por_id =%s ORDER BY procedimiento "

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