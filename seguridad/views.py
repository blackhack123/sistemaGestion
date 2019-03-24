# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest, HttpRequest
import json, md5
from seguridad.models import Usuario, TipoUsuario
from areas.models import Procesos
from personal.models import Personal
#IMPORTAMOS LIB DE EMAIL
from django.core.mail import EmailMessage
#importamos el OR
from django.db.models import Q
#IMPORTAMOS LA CONEXION PARA QUERY PERSONALIZADO
from django.db import connection
#importamos el dictfetchall
from principal.views import dictfetchall
from sac.models import Sac, PlanAccion


def login(request):
    context={}  
    return render(request, 'seguridad/login.html', context)


def validar(request):
    if request.method=='POST':
        nombreUsuario = request.POST.get('nombreUsuario')
        claveUsuario = request.POST.get('claveUsuario')
        clave = md5.new(claveUsuario).hexdigest()
        try:
            #buscamos el usuario Admin
            usuarioAdmin = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario=1, estado=1)
            personal = Personal.objects.get(pk=usuarioAdmin.id_personal_id)
            request.session['nombreUsuario'] = personal.nombre
            request.session['idUsuario'] = usuarioAdmin.id
            request.session['nivelUsuario'] = "admin"
            #obtiene permisos
            permisos=Usuario.objects.values(
                'has_area', 
                'has_auditoria', 
                'has_documental', 
                'has_norma', 
                'has_personal', 
                'has_usuario',
                'has_sac',
                'has_indicadores'
            ).all().filter(pk=request.session['idUsuario'])
            #se convierte permisos en list
            permisos_list=list(permisos)
            #listado permisos en session
            request.session['permisos']= permisos_list
            
            
            sac_list=list(Sac.objects.values('estado_cabecera').all().filter(Q(estado_cabecera=0) | Q(estado_cabecera=3)))
            request.session['sacAuditor']=sac_list
           
            
            #notificacion Seguimiento
            sac_seguimiento_list=list(PlanAccion.objects.values('estado_seguimiento', 'sac_id').all().filter(Q(estado_seguimiento=0) | Q(estado_seguimiento=2)))
            request.session['sacSeguimiento'] = sac_seguimiento_list

            #notificacion PENDIENTE SUBIR ARCHIVO
            cursor = connection.cursor()
            query = " SELECT DISTINCT areas_procesos.proceso AS proceso, documentos_documento.nombre "
            query = query + " FROM documentos_documento "
            query = query + " LEFT JOIN areas_procesos ON documentos_documento.procedimiento_id = areas_procesos.id "
            query = query + " LEFT JOIN documentos_revision ON documentos_documento.id = documentos_revision.documento_id "
            query = query + " WHERE documentos_documento.estado = 1 OR  documentos_documento.estado = 3 "

            cursor.execute(query)

            rows=dictfetchall(cursor)
            documentos_pendientes_list = list(rows)
            
            #total records de la consulta
            total_elementos = len(documentos_pendientes_list)
            
            if total_elementos == 0:
                if 'notificacionDocumentosAdmin' in request.session:
                    del request.session['notificacionDocumentosAdmin']
            else:
                request.session['notificacionDocumentosAdmin'] = documentos_pendientes_list
            return redirect('cargo')
        except Usuario.DoesNotExist:
            try:
                #buscamos el usuario Auditor
                usuarioAuditor = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario=2, estado=1)
                personal=Personal.objects.get(pk=usuarioAuditor.id_personal_id)
                request.session['nombreUsuario'] = personal.nombre
                request.session['idUsuario'] = usuarioAuditor.id_personal_id
                request.session['nivelUsuario'] = "auditor"

                return redirect('auditor')
            
            except:

                try:
                   
                    #buscamos el usuario Colaborador
                    
                    usuarioColaborador = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario=3, estado=1)
                    personal=Personal.objects.get(pk=usuarioColaborador.id_personal_id)
                    request.session['nombreUsuario'] = personal.nombre
                    request.session['idUsuario'] = usuarioColaborador.id_personal_id
                    request.session['nivelUsuario'] = "colaborador"

                    return redirect('colaborador')
            
                except:

                    try:
                        
                        #buscamos el usuario Jefe de Area
                        usuarioJefe = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario=4, estado=1)
                        personal=Personal.objects.get(pk=usuarioJefe.id_personal_id)
                        request.session['nombreUsuario'] = personal.nombre
                        request.session['idUsuario'] = usuarioJefe.id_personal_id
                        request.session['nivelUsuario'] = "jefe"
                        
                        return redirect('jefe')
            
                    except:
                        try:
                            #buscamos el usuario Auditor Lider
                            usuarioLider = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario_id=5, estado=1)
                            
                            personal=Personal.objects.get(pk=usuarioLider.id_personal_id)
                            request.session['nombreUsuario'] = personal.nombre
                            request.session['idUsuario'] = usuarioLider.id_personal_id
                            request.session['nivelUsuario'] = "lider"

                            
                            return redirect('lider')
                            
                        except:
                            try:
                                # buscamos el usuario Lider de Norma
                                usuarioLider = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario_id=6, estado=1)

                                personal = Personal.objects.get(pk=usuarioLider.id_personal_id)
                                request.session['nombreUsuario'] = personal.nombre
                                request.session['idUsuario'] = usuarioLider.id_personal_id
                                request.session['nivelUsuario'] = "lider_norma"

                                return redirect('lid_norma')
                            except:
                                #SI EL USUARIO ESTA INACTIVO
                                try:
                                    usuarioAdmin = Usuario.objects.get(usuario=nombreUsuario, clave=clave, estado=0)

                                    mensaje= "Usuario inactivo..Contactese con el Administrador..!!"
                                    context = {
                                        'mensaje': mensaje,
                                    }
                                    return render(request, 'seguridad/login.html', context)

                                except Usuario.DoesNotExist:

                                    mensaje= "Usuario/Clave incorrectos !!"
                                    context = {
                                        'mensaje': mensaje,
                                    }

                                    return render(request, 'seguridad/login.html', context)
    else:   
        return redirect('login')


def logout(request):
    if 'nombreUsuario' in request.session:
        for key in request.session.keys():
            del request.session[key]
        return redirect('login')
    else:
        return redirect('login')


def ValidacionMultiple(request):

    # validar Login
    if request.method == 'POST':

        #datos form login
        nombreUsuario = request.POST.get('nombreUsuario')
        claveUsuario = request.POST.get('claveUsuario')
        clave = md5.new(claveUsuario).hexdigest()

        try:
            # buscamos el usuario Admin
            usuarioAdmin = Usuario.objects.get(usuario=nombreUsuario, clave=clave, id_tipo_usuario=1, estado=1)
            personal = Personal.objects.get(pk=usuarioAdmin.id_personal_id)
            request.session['nombreUsuario'] = personal.nombre
            request.session['idUsuario'] = usuarioAdmin.id
            request.session['nivelUsuario'] = "admin"
            # obtiene permisos
            permisos = Usuario.objects.values(
                'has_area',
                'has_auditoria',
                'has_documental',
                'has_norma',
                'has_personal',
                'has_usuario',
                'has_sac',
                'has_indicadores'
            ).all().filter(pk=request.session['idUsuario'])
            # se convierte permisos en list
            permisos_list = list(permisos)
            # listado permisos en session
            request.session['permisos'] = permisos_list

            sac_list = list(
                Sac.objects.values('estado_cabecera').all().filter(Q(estado_cabecera=0) | Q(estado_cabecera=3)))
            request.session['sacAuditor'] = sac_list

            # notificacion Seguimiento
            sac_seguimiento_list = list(PlanAccion.objects.values('estado_seguimiento', 'sac_id').all().filter(
                Q(estado_seguimiento=0) | Q(estado_seguimiento=2)))
            request.session['sacSeguimiento'] = sac_seguimiento_list

            # notificacion PENDIENTE SUBIR ARCHIVO
            cursor = connection.cursor()
            query = " SELECT DISTINCT areas_procesos.proceso AS proceso "
            query = query + " FROM documentos_documento "
            query = query + " LEFT JOIN areas_procesos ON documentos_documento.procedimiento_id = areas_procesos.id "
            query = query + " LEFT JOIN documentos_revision ON documentos_documento.id = documentos_revision.documento_id "
            query = query + " WHERE documentos_documento.estado = 1 OR  documentos_documento.estado = 3 "
            # query = query + " AND documentos_revision.admin_id =%s "

            cursor.execute(query)

            rows = dictfetchall(cursor)
            documentos_pendientes_list = list(rows)

            # total records de la consulta
            total_elementos = len(documentos_pendientes_list)

            if total_elementos == 0:
                if 'notificacionDocumentosAdmin' in request.session:
                    del request.session['notificacionDocumentosAdmin']
            else:
                request.session['notificacionDocumentosAdmin'] = documentos_pendientes_list

            return redirect('cargo')
        except:
            try:
                #buscamos el usuario unificado
                usuario = Usuario.objects.get(usuario=nombreUsuario, clave=clave, estado=1)
                personal = Personal.objects.get(pk=usuario.id_personal_id)
                request.session['nombreUsuario'] = personal.nombre
                request.session['idUsuario'] = usuario.id_personal_id

                #modulo director
                if usuario.director == 1:
                    request.session['modulo_director'] = "on"

                #modulo colaborador
                if usuario.colaborador == 1:
                    request.session['modulo_colaborador'] = "on"

                # modulo Lider de norma
                if usuario.lider_norma == 1:
                    request.session['modulo_lider_norma'] = "on"

                # modulo Auditor
                if usuario.auditor == 1:
                    request.session['modulo_auditor'] = "on"

                # modulo Auditor Lider
                if usuario.auditor_lider == 1:
                    request.session['modulo_auditor_lider'] = "on"

                # permiso lectura
                if usuario.permiso_lectura :

                    request.session['permiso_lectura'] = "on"

                # permiso escritura
                if usuario.permiso_escritura :
                    request.session['permiso_escritura'] = "on"


                return redirect('vista_unificada')

            except Usuario.DoesNotExist:
                # SI EL USUARIO ESTA INACTIVO
                try:
                    usuarioAdmin = Usuario.objects.get(usuario=nombreUsuario, clave=clave, estado=0)

                    mensaje = "Usuario inactivo..Contactese con el Administrador..!!"
                    context = {
                        'mensaje': mensaje,
                    }
                    # return redirect('login')
                    return render(request, 'seguridad/login.html', context)

                except Usuario.DoesNotExist:

                    mensaje = "Usuario/Clave incorrecta !!"
                    context = {
                        'mensaje': mensaje,
                    }
                    return render(request, 'seguridad/login.html', context)