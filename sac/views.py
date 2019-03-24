# -*- coding: utf-8 -*-
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import json
from datetime import date, datetime
from django.db import connection


from principal.views import dictfetchall, render_to_pdf
from sac.models import Sac, PlanAccion, Estado, Revision, RevisionPlan
from personal.models import Personal
from areas.models import Areas
from auditoria.models import Auditorias
from django.db.models import Q


def sac(request):
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        cursor = connection.cursor()
        query = "SELECT auditoria_auditorias.numero_auditoria FROM  auditoria_auditorias GROUP BY auditoria_auditorias.numero_auditoria "
        cursor.execute(query)
        rows = dictfetchall(cursor)
        num_auditorias_list= list(rows)
        context = {
            'auditorias':num_auditorias_list,
            'areas':Areas.objects.values('id', 'area').all().filter(estado=1),
            'personal':Personal.objects.filter(estado=1),
            'sacs':Sac.objects.values('id').all().filter(estado_cabecera=5),
        }
        return render(request, 'sac/sacs.html', context)


def HistoricoSac(request):
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        context={
        }
        return render(request, 'sac/historico.html', context)


def GridSacHistorico(request):
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        if request.method == 'GET' and request.is_ajax():

            cursor = connection.cursor()
            query = " SELECT sac_revision.id, personal_personal.nombre AS administrador, director.nombre AS director, "
            query = query + " sac_revision.observacion_rev_director, sac_revision.fec_rev_director, sac_revision.estado_rev_director, "
            query = query + " auditor.nombre AS auditor, sac_revision.observacion_rev_auditor, sac_revision.fec_rev_auditor, "
            query = query + " sac_revision.estado_rev_auditor "
            query = query + " FROM sac_revision "
            query = query + " LEFT JOIN personal_personal ON sac_revision.admin_id = personal_personal.id "
            query = query + " LEFT JOIN personal_personal director ON sac_revision.director_id = director.id "
            query = query + " LEFT JOIN personal_personal auditor ON sac_revision.auditor_id = auditor.id "
            query = query + " WHERE sac_revision.sac_id =%s "
            query = query + " ORDER BY sac_revision.id DESC "
            params=[request.GET['row_id']]

            cursor.execute(query , params)
            rows_historico = dictfetchall(cursor)

            if rows_historico:
                return JsonResponse(rows_historico, safe=False)
            else:
                json = {
                'resultado':'no_ok',
                'mensaje': 'no existe Historico',
                }
                return JsonResponse(json, safe=False)


def gridSacAdmin(request):
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        if request.method == 'GET' and request.is_ajax():
            
            cursor = connection.cursor()
            
            query = "SELECT sac_sac.id, auditoria_auditorias.numero_auditoria, auditoria_auditorias.lugar, auditoria_auditorias.fec_inicio, auditoria_auditorias.hora_inicio, "
            query = query + " areas_areas.area AS proceso, areas_procesos.proceso AS procedimiento, personal_personal.nombre AS encargado, personal_auditor.nombre AS auditor, sac_sac.estado_cabecera, "
            query = query + " sac_sac.observacion_cabecera, sac_sac.criticidad , sac_sac.descripcion_hallazgo, sac_sac.analisis_causa, sac_sac.descripcion_correcion, sac_sac.sac_id "
            query = query + " FROM sac_sac "
            query = query + " LEFT JOIN auditoria_auditorias ON sac_sac.numero_auditoria = auditoria_auditorias.numero_auditoria "
            query = query + " LEFT JOIN areas_areas ON sac_sac.area = areas_areas.id "
            query = query + " LEFT JOIN areas_procesos ON sac_sac.procedimiento_id = areas_procesos.id  "
            query = query + " LEFT JOIN personal_personal ON sac_sac.responsable_id = personal_personal.id "
            query = query + " LEFT JOIN personal_personal personal_auditor ON sac_sac.solicitante_id = personal_auditor.id "
            query = query + " GROUP BY sac_sac.id ORDER BY id DESC "
            print query
            cursor.execute(query)
            rows = dictfetchall(cursor)
            # CONVIERTE  QuerySet  a list object
            sacs_auditor_list= list(rows) 
            
            if sacs_auditor_list:
                return JsonResponse(sacs_auditor_list, safe=False)
            else:
                json = {
                    'resultado':'no_ok',
                    'mensaje': 'no existen  Sac',
                }
                return JsonResponse(json, safe=False)



def gridSacPlanAccion(request):
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        if request.method == 'GET':
            row_id = request.GET['row_id']
            cursor = connection.cursor()

            query = " SELECT sac_planaccion.id, sac_planaccion.detalle_plan_accion, sac_planaccion.plazo_plan_accion, sac_planaccion.responsable_plan_accion_id, "
            query = query + " sac_planaccion.justificacion_plan, personal_personal.nombre AS responsable_accion, sac_planaccion.observacion_plan, sac_planaccion.estado_plan, sac_planaccion.fecha_seguimiento, personal.nombre AS responsable_seguimiento, "
            query = query + " sac_planaccion.detalle_seguimiento, sac_planaccion.estado_seguimiento, sac_planaccion.sac_id, sac_planaccion.observacion_seguimiento, "
            query = query + " sac_estado.estado_aprobacion, sac_estado.observaciones_aprobacion,  sac_estado.estado_cierre_accion, sac_estado.fecha_cierre_accion "
            query = query + " FROM sac_planaccion "
            query = query + " LEFT JOIN personal_personal ON sac_planaccion.responsable_plan_accion_id = personal_personal.id "
            query = query + " LEFT JOIN personal_personal personal ON sac_planaccion.responsable_seguimiento_id = personal.id "
            query = query + " LEFT JOIN sac_estado ON sac_planaccion.sac_id = sac_estado.sac_id "
            query = query + " WHERE sac_planaccion.sac_id =%s "

            params = [row_id]
            cursor.execute(query, params)

            rows = dictfetchall(cursor)

            list_rows = list(rows)

            if list_rows:
                return JsonResponse(list_rows, safe=False)
            else:
                json = {
                'resultado':'no_ok',
                'mensaje': 'no existen  PLAN ACCION',
                }
                return JsonResponse(json, safe=False)


def insertSacAudt(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():
            
            id_sac = request.POST.get('id_sac')
            estado_cabecera = request.POST.get('estado_cabecera')
            observacion_cabecera= request.POST.get('observacion')
 

            if estado_cabecera == "1":

                observacion_cabecera = None
                sac_pendiente_jefe = 0

                # grabar historico revision sac_auditor
                sac_revisada = Sac.objects.get(pk=id_sac)
                import datetime
                fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")
                revision = Revision(

                    sac_id = id_sac,
                    estado_rev_auditor = 1,
                    observacion_rev_auditor = observacion_cabecera,
                    fec_rev_auditor = fecha_actual,
                    admin_id = request.session['idUsuario'],
                    director_id = sac_revisada.responsable_id,
                    auditor_id = sac_revisada.solicitante_id

                )
                revision.save()
            else:
                sac_pendiente_jefe = None

                #grabar historico revision sac_auditor
                sac_revisada = Sac.objects.get(pk=id_sac)
                import datetime
                fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")

                revision = Revision(

                    sac_id = id_sac,
                    estado_rev_auditor = 0,
                    observacion_rev_auditor = observacion_cabecera,
                    fec_rev_auditor = fecha_actual,
                    admin_id = request.session['idUsuario'],
                    director_id = sac_revisada.responsable_id,
                    auditor_id = sac_revisada.solicitante_id

                )
                revision.save()

            Sac.objects.filter(pk=id_sac).update(
                estado_cabecera=estado_cabecera,
                observacion_cabecera=observacion_cabecera,
                sac_jefe  = sac_pendiente_jefe
                
            )

            #elimina alerta
            if  'sacAuditor' in request.session:
                del request.session['sacAuditor']

            data = {
                'resultado':'ok_update',
                'mensaje': 'Datos Grabados Correctamente !!',
            }
            return HttpResponse(json.dumps(data), content_type="application/json")



def selectSacAudt(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_sac=request.POST.get('id_sac')
            
            sac_auditor=Sac.objects.values().all().filter(pk=id_sac)
            sac_list=list(sac_auditor)
            
            if sac_list:

                data={
                    'sac_list':sac_list,
                }
            else:
                data={
                    'codigo': 'no_ok',
                    'mensaje': 'Sin sac Existente !!'
                }
                
            return JsonResponse(data, safe=False)


def insertSacJefe(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_sac=request.POST.get('id_sac')
            estado_sac_jefe= request.POST.get('estado_sac_jefe')
            observacion_detalle = request.POST.get('observacion_detalle')

            import datetime
            fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")
            sac_revisada = Sac.objects.get(pk=id_sac)

            if estado_sac_jefe == "5":
                observacion_detalle = None

                revision = Revision(
                    sac_id = id_sac,
                    admin_id = request.session['idUsuario'],
                    auditor_id = sac_revisada.solicitante_id,
                    director_id = sac_revisada.responsable_id,
                    fec_rev_director = fecha_actual,
                    observacion_rev_director = observacion_detalle,
                    estado_rev_director = 1
                )
                revision.save()
            else:
                revision = Revision(
                    sac_id=id_sac,
                    admin_id=request.session['idUsuario'],
                    auditor_id=sac_revisada.solicitante_id,
                    director_id=sac_revisada.responsable_id,
                    fec_rev_director=fecha_actual,
                    observacion_rev_director=observacion_detalle,
                    estado_rev_director=0
                )
                revision.save()
            Sac.objects.filter(pk = id_sac).update(
                estado_cabecera = estado_sac_jefe,
                observacion_cabecera = observacion_detalle
            )

            if 'sacJefe' in request.session:
                del request.session['sacJefe']

            data = {
                'resultado':'ok_update',
                'mensaje': 'Datos Grabados Correctamente !!',
            }
            return HttpResponse(json.dumps(data), content_type="application/json")



def json_serial(obj):
    """JSON serializer para objectos no serializables por defecto json code"""

    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError ("Tipo %s no serializable" % type(obj))


def planAccion(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():
            
            id_sac = request.POST.get('id_sac')

            plan_accion = PlanAccion.objects.values().all().filter(id_sac_id=id_sac)
            plan_accion_list=list(plan_accion)

            data = {
                'resultado':'ok_select',
                'plan_accion':plan_accion_list,
            }

            return HttpResponse(json.dumps(data, default=json_serial) , content_type="application/json")


def selectPlanPorId(request):
    
    #validar si existe usuario logeado

    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_plan_accion = request.POST.get('id_plan')
            

            plan_accion = PlanAccion.objects.values().all().filter(pk=id_plan_accion)
            plan_accion_list=list(plan_accion)

            data = {
                'resultado':'ok_select',
                'plan_accion':plan_accion_list,
            }

            return HttpResponse(json.dumps(data, default=json_serial) , content_type="application/json")


def updatePlanAccion(request):    
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_sac = request.POST.get('id_sac')
            id_plan = request.POST.get('id_plan')
            fecha_seguimiento = request.POST.get('fecha_seguimiento')
            responsable_seguimiento = request.POST.get('responsable_seguimiento')
            estado_seguimiento = request.POST.get('estado_seguimiento')

            if estado_seguimiento:
                estado = estado_seguimiento
                estado_aprobacion = 0

            #estado_seguimiento->0 pendiente ->1 designado ->2 realizado
            PlanAccion.objects.filter(pk=id_plan).update(
                fecha_seguimiento = fecha_seguimiento,
                responsable_seguimiento_id = responsable_seguimiento,
                estado_seguimiento = 1, 
            )

            #DEFINIMOS EL ESTADO DE LA SAC
            try:
                Estado.objects.filter(sac_id=id_sac).update(
                    estado_aprobacion = 0   #pendiente de aprobar todo el plan
                )
            except Estado.DoesNotExist :
                estado = Estado(
                    estado_aprobacion = 0,  #pendiente de aprobar todo el plan
                    sac_id = id_sac
                )
                estado.save()

            #eliminar notificacion
            if 'sacSeguimiento' in request.session:
                del request.session['sacSeguimiento']
            
            #mensaje update ok
            data = {
                'resultado':'ok_update',
                'mensaje':'Datos Grabados Correctamente !!',
            }
            
            return HttpResponse(json.dumps(data), content_type="application/json")


def setEstadoSeguimiento(request):

    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        if request.method == 'POST' and request.is_ajax():
            id_plan = request.POST.get('id_plan')
            estado = request.POST.get('estado')

            if estado =='2':
                observacion = request.POST.get('observaciones')
                PlanAccion.objects.filter(pk=id_plan).update(
                    observacion_seguimiento=observacion,
                    estado_seguimiento=4
                )
            else:
                observacion = None
                PlanAccion.objects.filter(pk=id_plan).update(
                    observacion_seguimiento = observacion,
                    estado_seguimiento = 3
                )
            import datetime
            fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")
            try:
                revision_existente = RevisionPlan.objects.get(estado_rev_seguimiento=0, plan_id=id_plan)
                RevisionPlan.objects.filter(estado_rev_seguimiento=0, plan_id=id_plan).update(
                    observacion_rev_seguimiento = observacion,
                    estado_rev_seguimiento = estado,
                    fec_rev_seguimiento = fecha_actual
                )
            except RevisionPlan.DoesNotExist:
                revision_seguimiento = RevisionPlan(
                    observacion_rev_seguimiento=observacion_seguimiento,
                    estado_rev_seguimiento=estado,
                    fec_rev_seguimiento=fecha_actual,
                    estado_rev_responsable = 1
                )
                revision_seguimiento.save()

            data = {
                'resultado':'ok_update',
                'mensaje':'Datos Grabados Correctamente !!',
            }
            return HttpResponse(json.dumps(data), content_type="application/json")


def upEstPlanAccion(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():

            id_sac = request.POST.get('id_sac')
            estado_aprobacion = request.POST.get('estado_aprobacion')
            if estado_aprobacion == "2":
                observacion_aprobacion = request.POST.get('observacion_aprobacion')
            else:
                observacion_aprobacion = None

            PlanAccion.objects.filter(id_sac_id=id_sac).update(
                estado_aprobacion = estado_aprobacion,
                observaciones_aprobacion = observacion_aprobacion,
                fecha_aprobacion = date.today(),
                estado_cierre_accion=0
            )
            
            #mensaje update ok
            data = {
                'resultado':'ok_update',
                'mensaje':'Datos Grabados Correctamente !!',
            }
            
            return HttpResponse(json.dumps(data), content_type="application/json")


def setEstPlanAccion(request):
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():
            
            numero_sac = request.POST.get('numero_sac')
            estado_plan_accion = request.POST.get('estado_plan_accion')

            if estado_plan_accion =='0':
                observaciones = request.POST.get('observaciones')
            else:
                observaciones=None
            
            #obtengo la fecha actual
            import datetime 
            fecha = datetime.date.today()

            #verifica si existe lo actualiza sino lo crea
            estado_plan, created = Estado.objects.get_or_create(sac_id=numero_sac)

            try: 
                
                obj = Estado.objects.get(sac_id=numero_sac)
                #actualizar
                Estado.objects.filter(sac_id=numero_sac).update(
                    estado_aprobacion=estado_plan_accion,
                    observaciones_aprobacion=observaciones,
                    fecha_aprobacion=fecha
                )
            except Estado.DoesNotExist:
                #crear
                estado = Estado(
                    estado_aprobacion=estado_plan_accion,
                    observaciones_aprobacion=observaciones,
                    fecha_aprobacion=fecha,
                    sac_id = numero_sac
                )
                estado.save()
      
            #mensaje update ok
            data = {
                'resultado':'ok_update',
                'mensaje':'Datos Grabados Correctamente !!',
            }
            return HttpResponse(json.dumps(data), content_type="application/json")


def upCierre(request): 
    
    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        if request.method == 'POST' and request.is_ajax():
        
            id_sac = request.POST.get('id_sac')
            estado_cierre = request.POST.get('estado_cierre')


            Estado.objects.filter(sac_id=id_sac).update(
                estado_cierre_accion = estado_cierre,
                fecha_cierre_accion = date.today(),
            )

            #mensaje update ok
            data = {
                'resultado':'ok_update',
                'mensaje':'Datos Grabados Correctamente !!',
            }
            
            return HttpResponse(json.dumps(data), content_type="application/json")



def reporteSac(request):
    if 'nombreUsuario' not in request.session:
        return render(request, 'seguridad/login.html', {})
    else:
        if request.method == 'POST' :
            
            numero_sac = request.POST["numero_sac"]
            sac_singular = Sac.objects.get(pk=numero_sac)
            sac_anterior = sac_singular.sac_id

            cursor = connection.cursor()
            query = " SELECT sac_sac.id, sac_sac.tipo_solicitud,  sac_sac.criticidad,  areas_areas.area AS proceso, personal_personal.nombre AS responsable, "
            query = query + " persona_solicitante.nombre AS solicitante,  sac_sac.fecha_solicitud , sac_sac.descripcion_hallazgo, "
            query = query + " sac_sac.descripcion_correcion,  sac_sac.analisis_causa "
            query = query + " FROM sac_sac "
            query = query + " LEFT JOIN areas_areas ON sac_sac.area = areas_areas.id  "
            query = query + " LEFT JOIN personal_personal ON sac_sac.responsable_id = personal_personal.id  "
            query = query + " LEFT JOIN personal_personal persona_solicitante ON sac_sac.solicitante_id = persona_solicitante.id "
            query = query + " WHERE sac_sac.id =%s"
            params=[numero_sac]

            cursor.execute(query, params)
            row_encabezado_sac = dictfetchall(cursor)


            query = " SELECT sac_planaccion.detalle_plan_accion,  sac_planaccion.plazo_plan_accion, personal_personal.nombre AS responsable_plan, "
            query = query + " sac_planaccion.fecha_seguimiento,  personal_seg.nombre AS personal_seguimiento "
            query = query + " FROM sac_planaccion "
            query = query + " LEFT JOIN personal_personal ON sac_planaccion.responsable_plan_accion_id = personal_personal.id "
            query = query + " LEFT JOIN personal_personal personal_seg ON sac_planaccion.responsable_seguimiento_id = personal_seg.id "
            query = query + " WHERE sac_planaccion.sac_id =%s"
            params=[numero_sac]

            cursor.execute(query, params)
            rows_plan_accion = dictfetchall(cursor)
            

            query = " SELECT sac_estado.estado_aprobacion, sac_estado.fecha_aprobacion, sac_estado.observaciones_aprobacion, "
            query = query + " sac_estado.estado_cierre_accion, sac_estado.fecha_cierre_accion "
            query = query + " FROM sac_estado "
            query = query + " WHERE sac_estado.sac_id =%s"
            params=[numero_sac]

            cursor.execute(query, params)
            row_estado_sac = dictfetchall(cursor)

            cursor = connection.cursor()
            query = " SELECT personal_personal.firma "
            query = query + " FROM sac_sac "
            query = query + " LEFT JOIN personal_personal ON sac_sac.solicitante_id = personal_personal.id "
            query = query + " WHERE sac_sac.id =%s "
            query = query + " AND firma IS NOT NULL "
            params = [numero_sac]
            cursor.execute(query, params)
            row_firma_auditor = dictfetchall(cursor)

            cursor = connection.cursor()
            query = " SELECT personal_personal.firma "
            query = query + " FROM sac_sac "
            query = query + " LEFT JOIN personal_personal ON sac_sac.responsable_id = personal_personal.id "
            query = query + " WHERE sac_sac.id =%s "
            query = query + " AND firma IS NOT NULL "
            params = [numero_sac]
            cursor.execute(query, params)
            row_firma_director = dictfetchall(cursor)


            if row_firma_auditor and row_firma_auditor:
                context = {
                    'sac_anterior':sac_anterior,
                    'numero_sac':numero_sac,
                    'encabezado_sac': row_encabezado_sac,
                    'plan_accion_sac': rows_plan_accion,
                    'estado_sac': row_estado_sac,
                    'firma_auditor': str(row_firma_auditor[0]['firma']),
                    'firma_director': str(row_firma_director[0]['firma'])
                }
            else:
                context = {
                    'sac_anterior': sac_anterior,
                    'numero_sac': numero_sac,
                    'encabezado_sac': row_encabezado_sac,
                    'plan_accion_sac': rows_plan_accion,
                    'estado_sac': row_estado_sac,
                    'firma_auditor': '',
                    'firma_director':''
                }

            pdf = render_to_pdf('reportes/pdf/pdfSAC.html', context)
            if pdf:
                response = HttpResponse(pdf, content_type='application/pdf')
                filename = "SAC_%s.pdf" %(str(numero_sac).zfill(3))
                content = "inline; filename='%s'" %(filename)

                content = "attachment; filename='%s'" %(filename)
                response['Content-Disposition'] = content
                return response


def AprobarPlanColaborador(request):


    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:
        if request.method == 'POST' and request.is_ajax():
            id_plan = request.POST.get('id_plan')
            estado = request.POST.get('estado')
            if estado == '2':
                observaciones = request.POST.get('observaciones')
            else:
                observaciones = None

            plan_accion_colaborador = PlanAccion.objects.get(pk=id_plan)

            #data para insertar
            responsable = plan_accion_colaborador.responsable_plan_accion_id
            plan = id_plan
            import datetime
            fecha_actual = datetime.datetime.now().strftime("%Y-%m-%d")

            #actualiza planAccion para ultima observacion
            PlanAccion.objects.filter(pk=id_plan).update(
                estado_plan = estado,
                observacion_plan = observaciones
            )

            try:
                plan_existente = RevisionPlan.objects.get((Q(estado_rev_responsable=None)|Q(estado_rev_responsable=0)), plan_id=id_plan)
                RevisionPlan.objects.filter(plan_id=id_plan, estado_rev_responsable=0).update(
                    observacion_rev_responsable=observaciones,
                    fec_rev_responsable=fecha_actual,
                    estado_rev_responsable=estado,
                    responsable_id=responsable,
                    plan_id=plan
                )
            except RevisionPlan.DoesNotExist:
                #inserta revision
                revision_plan = RevisionPlan(
                    observacion_rev_responsable = observaciones,
                    fec_rev_responsable = fecha_actual,
                    estado_rev_responsable = estado,
                    responsable_id = responsable,
                    plan_id = plan
                )
                revision_plan.save()

            # mensaje ok
            data = {
                'resultado': 'ok_insert',
                'mensaje': 'Datos Grabados Correctamente !!',
            }

            return HttpResponse(json.dumps(data), content_type="application/json")



def GridSacPlanAccion(request):


    #validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        cursor = connection.cursor()

        query = " SELECT sac_planaccion.id, sac_planaccion.detalle_plan_accion,  sac_planaccion.plazo_plan_accion, sac_planaccion.justificacion_plan, "
        query = query + " personal_personal.nombre AS responsable_accion,  sac_planaccion.observacion_plan,  sac_planaccion.estado_plan, "
        query = query + " sac_planaccion.fecha_seguimiento,  personal.nombre AS responsable_seguimiento,  sac_planaccion.detalle_seguimiento, "
        query = query + " sac_planaccion.estado_seguimiento,  sac_planaccion.sac_id,  sac_planaccion.observacion_seguimiento,  sac_estado.estado_aprobacion, "
        query = query + " sac_estado.observaciones_aprobacion, sac_estado.estado_cierre_accion,  sac_estado.fecha_cierre_accion, sac_sac.numero_auditoria, sac_sac.sac_id "
        query = query + " FROM sac_planaccion "
        query = query + " LEFT JOIN personal_personal ON sac_planaccion.responsable_plan_accion_id = personal_personal.id "
        query = query + " LEFT JOIN personal_personal personal ON sac_planaccion.responsable_seguimiento_id = personal.id "
        query = query + " LEFT JOIN sac_estado ON sac_planaccion.sac_id = sac_estado.sac_id "
        query = query + " LEFT JOIN sac_sac ON sac_planaccion.sac_id = sac_sac.id "

        cursor.execute(query)

        rows = dictfetchall(cursor)

        if rows:

            # RETORNA
            return JsonResponse(rows, safe=False)

        else:

            # RETORNA MENSAJE DE NO EXISTEN
            json = {
                'resultado': 'no_ok',
                'mensaje': 'no existen  PLAN ACCION',
            }
            return JsonResponse(json, safe=False)



def GridHistoricoPlanAccion(request):

    # validar si existe usuario logeado
    if 'nombreUsuario' not in request.session:

        return render(request, 'seguridad/login.html', {})

    else:

        cursor = connection.cursor()

        query = " SELECT sac_revisionplan.id, sac_revisionplan.observacion_rev_responsable, sac_revisionplan.fec_rev_responsable, sac_revisionplan.estado_rev_responsable, "
        query = query + " sac_revisionplan.observacion_rev_seguimiento, sac_revisionplan.fec_rev_seguimiento,  sac_revisionplan.estado_rev_seguimiento, "
        query = query + " sac_revisionplan.justificacion_responsable, sac_revisionplan.justificacion_seguimiento "
        query = query + " FROM sac_revisionplan "
        query = query + " WHERE sac_revisionplan.plan_id =%s "
        params = [request.GET['row_id']]

        cursor.execute(query, params)

        rows = dictfetchall(cursor)

        if rows:

            # RETORNA
            return JsonResponse(rows, safe=False)

        else:

            # RETORNA MENSAJE DE NO EXISTEN
            json = {
                'resultado': 'no_ok',
                'mensaje': 'no existen  Historico !!',
            }
            return JsonResponse(json, safe=False)