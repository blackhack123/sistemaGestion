
from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

#importamos vista login
from seguridad.views import login, validar, logout, ValidacionMultiple

from principal.views import gridUsuarios, selectUsuario, insertUsuarios, updateUsuario, home
from principal.views import excelUsuarios, pdfUsuarios
from principal.views import insertPermisos, selectPermisos, ConvertDocToPDF, GridDocumentosDisponibles
from principal.views import Unificado, InsertarUsuarioMultiple, UpdateUsuarioMultiple
from principal.views import SubirImagenCkeditor

from areas.views import areas, gridAreas, selectArea, insertArea, updateArea, excelAreas, pdfAreas
from areas.views import selectJefe, CrearAreapersonal, selecAreapersonal, ActualizarAreapersonal, EliminarAreapersonal, ExcelAreapersonal, PdfAreapersonal

from procesos.views import procesos, gridProcesos, consultarAreas, selectProceso, insertProceso, updateProceso, excelProcesos, pdfProcesos
from procesos.views import vincularProcesos, gridAreaProcesos, gridVinculados, insertVinculacion, removeVinculacion
from procesos.views import excelVinculados, pdfVinculados
from procesos.views import gridColaboradores,selProcArea, insertColaboradores, gridColabVinculados, removeColaborador, getSubdirectorios, getListaArchivos
from procesos.views import reemplazarArchivo, consultarProcesoPro, InsertarColaboradores


from normas.views import normas, gridNormas, insertNorma, selectNorma, updateNorma, excelNormas, pdfNormas
from normas.views import vincularNormas, gridVincularProcesos, insertVinculoNormas, gridVinculadoNormas
from normas.views import desvincularNormaProceso, desvincularNormasProcesos
from normas.views import excelNormVinculadas, pdfNormVinculadas
from normas.views import clausulas, insertClausula,selectClausula,updateClausula, gridVinClausulas, consultarProcesoNorma, ExcelClausulas
from normas.views import extraerClausula

from auditoria.views import auditoria, gridProDesignados, insertAuditor, gridAuditores, excelAuditores, pdfAuditores, removeAuditor
from auditoria.views import estabAuditoria, gridAudtDesignados, setAuditoria, gridAuditorias, deleteAuditoria, getAuditoria, updateAudit
from auditoria.views import excelAudits , pdfAudits

#sac administrador
from sac.views import sac, HistoricoSac, gridSacAdmin, selectSacAudt, insertSacAudt, insertSacJefe, planAccion, updatePlanAccion, upEstPlanAccion, upCierre, reporteSac
from sac.views import gridSacPlanAccion, selectPlanPorId, setEstadoSeguimiento, setEstPlanAccion, GridSacHistorico, AprobarPlanColaborador
from sac.views import GridSacPlanAccion, GridHistoricoPlanAccion

#auditores
from auditores.views import auditor, audDesignadas, selNorAud, auditDoc, selPlanEjec, setProceso, getProcedimientos
from auditores.views import audiSac, setJefeArea, insertSacAuditor, gridSacAuditor, updateSacAuditor, pdfListVerificacion
from auditores.views import gridSacLider, adminSacLider, getInformeAuditoria, pdfInformeAuditoria, pdfPlanEjecucion, SelectDataListaVerificacion

from jefe.views import jefe, updateSacJefe, adminJefeDoc, estadoDocJefe,updateDocJefe, selectNotLider, insertPlanAccion, selectPlanAccion, selectPlanColab
from jefe.views import updatePlan, deletePlanAccion, GridDocumentacionDirector

from colaboradores.views import colaborador, selProcCol, updateACtProce, colSeguimientos, updateSegCol, selSeguimiento, selectProcesoColab
from colaboradores.views import estadoDocColaborador, selectNotEncargado, selectNotAdmin,setJustificacionPlan, setJustiSeguimiento
from colaboradores.views import GridDocumentacionColaborador, UploadNuevoDocumento, ConsultarVersionAnterior, NuevaVersionDocumento

from personal.views import personal, cargo, insertCargo, selectCargo, updateCargo
from personal.views import excelCargos, pdfCargos, selectPersonal, insertPersonal, updatePersonal, excelPersonal, pdfPersonal, perPorCargo
from personal.views import listadoPersonal

#gestion documental
from documentos.views import documentos, directorios, createDirectorio, deleteDirectorio, editDirectorio
from documentos.views import uploadArchivo, selectArchivo, designarDirectorio, deleteArchivo, estadoDocAdmin, updateDocAdmin
from documentos.views import gridEstadoDocumentacion, gridRevisionDocumentacion, GridDocumentosAdministrador, EstablecerNoVigente, EstablecerVigente
from documentos.views import dirlist, FirmarDocumento, SeleccionarDocProcedimiento, ActualizarDocProcedimiento, EliminarDocProcedimiento, ReporteHistorico

#AUDITOR LIDER
from auditores.views import lider, adminLiderDoc, estadoDocLider, updateDocLider, GridDocumentacionLider, GridDocumentacionLiderNorma

#Lider de Norma
from auditores.views import LiderNorma, DocumentosLiderNorma

urlpatterns = [
  
    #url(r'^admin/', admin.site.urls),
    #url(r'^admin/', login ,name='login'),
    
    url(r'^ingresar_areapersonal', CrearAreapersonal, name='ingresar_areapersonal'),
    #Select CARGO
    url(r'^selec_areapersonal', selecAreapersonal, name='selec_areapersonal'),
    #Update CARGO
    url(r'^actualizar_areapersonal', ActualizarAreapersonal, name='actualizar_areapersonal'),
    #Eliminar AREA
    url(r'^eliminar_areapersonal', EliminarAreapersonal, name='eliminar_areapersonal'),
    #Excel CARGO
    url(r'^excel_areapersonal', ExcelAreapersonal, name='excel_areapersonal'),
    #PDf CARGO
    url(r'^pdf_areapersonal', PdfAreapersonal, name='pdf_areapersonal'),
    
    #redirigue a la vista principal
    url(r'^$', login , name='login'),

    #validar Login
    #url(r'^validar$', validar, name='validar'),
    url(r'^validar$', ValidacionMultiple, name='validar'),

    #Redirigue al Login y Cerrar Sesion
    url(r'^logout', logout, name='logout'),

    #Vista Usuarios
    url(r'^home/', home, name='home'),

    #SUBIR IMAGEN CKEDITOR
    url(r'^uploadImagesCkeditor', SubirImagenCkeditor, name='uploadImagesCkeditor'),

    #Grid Usuarios
    url(r'^gridUsuarios/', gridUsuarios, name='gridUsuarios'),

    #Select Usuario por ID
    url(r'^selectUsuario/', selectUsuario, name='selectUsuario'),

    #Insert Usuario por ID
    url(r'^insertUsuarios/', insertUsuarios, name='insertUsuarios'),
    
    #Update Usuario por ID
    url(r'^updateUsuario/', updateUsuario, name='updateUsuario'),

    #Excel Usuarios
    url(r'^excelUsuarios/', excelUsuarios, name='excelUsuarios'),

    #Pdf Usuarios
    url(r'^pdfUsuarios/', pdfUsuarios, name='pdfUsuarios'),
    #Insert Permisos
    url(r'^insertPermisos/', insertPermisos, name='insertPermisos'),
    #Select Permisos
    url(r'^selectPermisos/', selectPermisos, name='selectPermisos'),
    # Select Permisos
    url(r'^convertdoc_topdf/', ConvertDocToPDF, name='convertdoc_topdf'),


    #Vista Areas
    url(r'^areas', areas, name='areas'),
    url(r'^selectJefe', selectJefe, name='selectJefe'),

    #Grid Areas
    url(r'^gridAreas', gridAreas, name='gridAreas'),

    #Select Area
    url(r'^selectArea', selectArea, name='selectArea'),

    #Select Area
    url(r'^insertArea', insertArea, name='insertArea'),

    #Update Area
    url(r'^updateArea', updateArea, name='updateArea'),

    #Excel Areas
    url(r'^excelAreas', excelAreas, name='excelAreas'),

    #Pdf Areas
    url(r'^pdfAreas', pdfAreas, name='pdfAreas'),
    
    #Vista Procesos
    url(r'^procesos', procesos, name='procesos'),

    # Grid Procesos
    url(r'^gridProcesos', gridProcesos, name='gridProcesos'),

    #Select Areas Vinculadas
    url(r'^consultarAreas', consultarAreas, name='consultarAreas'),

    #Select Proceso
    url(r'^selectProceso', selectProceso, name='selectProceso'),

    #Insert Proceso
    url(r'^insertProceso', insertProceso, name='insertProceso'),

    #Update Proceso
    url(r'^updateProceso', updateProceso, name='updateProceso'),

    #Excel Procesos
    url(r'^excelProcesos', excelProcesos, name='excelProcesos'),

    #Pdf Procesos
    url(r'^pdfProcesos', pdfProcesos, name='pdfProcesos'),
    #grid personal
    url(r'^gridColaboradores', gridColaboradores, name='gridColaboradores'),
    #Selectprocesos por area
    url(r'^selProcArea', selProcArea, name='selProcArea'),
    #InsertColaboradores
    #url(r'^insertColaboradores', insertColaboradores, name='insertColaboradores'),
    url(r'^vincular_colaboradores', InsertarColaboradores, name='vincular_colaboradores'),
    #Grid Colaboradores vinculados
    url(r'^gridColabVinculados', gridColabVinculados, name='gridColabVinculadovincular_colaboradoress'),
    #remover colaborador
    url(r'^removeColaborador', removeColaborador, name='removeColaborador'),
    #LISTAR ARCHIVOS POR CARPETA
    url(r'^getListaArchivos', getListaArchivos, name='getListaArchivos'),
    #mover archivos a la carpeta VERSION proceso
    url(r'^reemplazarArchivo', reemplazarArchivo, name='reemplazarArchivo'),
    # mostrar procedimientos vinculados
    url(r'^consultarprocedimientos_vinculados', consultarProcesoPro, name='consultarprocedimientos_vinculados'),
    #mover archivos a la carpeta VERSION proceso
    url(r'^grid_documentacionColaborador', GridDocumentacionColaborador, name='grid_documentacionColaborador'),
    #SUBIR ARCHIVO NUEVO
    url(r'^upload_nuevoDocumento', UploadNuevoDocumento, name='upload_nuevoDocumento'),
    url(r'^consultar_versionanterior', ConsultarVersionAnterior, name='consultar_versionanterior'),
    url(r'^subir_nuevaversion', NuevaVersionDocumento, name='subir_nuevaversion'),


    #Vista Vincular Procesos
    url(r'^vincularProcesos', vincularProcesos, name='vincularProcesos'),
    #Grid gridAreaProcesos 
    url(r'^gridAreaProcesos', gridAreaProcesos, name='gridAreaProcesos'),

    #Grid grid Procesos Vinculados
    url(r'^gridVinculados', gridVinculados, name='gridVinculados'),

    #Insert Procesos Vinculados
    url(r'^insertVinculacion', insertVinculacion, name='insertVinculacion'),

    #Remove Proceso Vinculado
    url(r'^removeVinculacion', removeVinculacion, name='removeVinculacion'),

    #Excel Procesos Vinculados
    url(r'^excelVinculados', excelVinculados, name='excelVinculados'),

    #Pdf Procesos Vinculados
    url(r'^pdfVinculados', pdfVinculados, name='pdfVinculados'),
    #listar directorios
    url(r'^getSubdirectorios', getSubdirectorios, name='getSubdirectorios'),






    #Vista Normas
    url(r'^normas', normas, name='normas'),

    #Grid Normas
    url(r'^gridNormas', gridNormas, name='gridNormas'),

    #Insert Normas
    url(r'^insertNorma', insertNorma, name='insertNorma'),

    #Select Normas
    url(r'^selectNorma', selectNorma, name='selectNorma'),

    #Update Normas
    url(r'^updateNorma', updateNorma, name='updateNorma'),

    #Excel Normas
    url(r'^excelNormas', excelNormas, name='excelNormas'),

    #pdfNormas Normas
    url(r'^pdfNormas', pdfNormas, name='pdfNormas'),

    #vincularNormas
    url(r'^vincularNormas', vincularNormas, name='vincularNormas'),

    #gridVincularProcesos
    url(r'^gridVincularProcesos', gridVincularProcesos, name='gridVincularProcesos'),

    #insertVinculacion
    url(r'^insertVinculoNormas', insertVinculoNormas, name='insertVinculoNormas'),
   
    #Grid normasVinculadas
    url(r'^gridVinculadoNormas', gridVinculadoNormas, name='gridVinculadoNormas'),

    #desvincular Norma por Proceso(id)
    url(r'^desvincularNormaProceso', desvincularNormaProceso, name='desvincularNormaProceso'),

    #desvincular normas de Procesos por area(id_area)
    url(r'^desvincularNormasProcesos', desvincularNormasProcesos, name='desvincularNormasProcesos'),

    #Excel Normas Vinculadas
    url(r'^excelNormVinculadas', excelNormVinculadas, name='excelNormVinculadas'),
    
    #Pdf Normas Vinculadas
    url(r'^pdfNormVinculadas', pdfNormVinculadas, name='pdfNormVinculadas'),
    #Vista Clausulas
    url(r'^clausulas', clausulas, name='clausulas'),
    #Extraer Clausula
    url(r'^extraerClausula', extraerClausula, name='extraerClausula'),
    #insert Clausula
    url(r'^insertClausula', insertClausula, name='insertClausula'),
    #Select Clausula
    url(r'^selectClausula', selectClausula, name='selectClausula'),
    #Update Clausula
    url(r'^updateClausula', updateClausula, name='updateClausula'),
    #Consultar Procesos vinculados por Clausual
    url(r'^consultarProcesoNorma', consultarProcesoNorma, name='consultarProcesoNorma'),
    #Grid ClausulasNorma(id)
    url(r'^gridVinClausulas', gridVinClausulas, name='gridVinClausulas'),
    # excel clausulas
    url(r'^excel_clausulas', ExcelClausulas, name='excel_clausulas'),



    #Vista Auditoria
    url(r'^auditoria', auditoria, name='auditoria'),
    #Grid Procesos Designados
    url(r'^gridProDesignados', gridProDesignados, name='gridProDesignados'),
    #Insert Auditor
    url(r'^insertAuditor', insertAuditor, name='insertAuditor'),
    #Select Auditor
    url(r'^gridAuditores', gridAuditores, name='gridAuditores'),
    #Eliminar Auditor
    url(r'^removeAuditor', removeAuditor, name='removeAuditor'),
    #Excel Auditores
    url(r'^excelAuditores', excelAuditores, name='excelAuditores'),
    #Pdf Auditores
    url(r'^pdfAuditores', pdfAuditores, name='pdfAuditores'),



    #Vista Auditorias
    url(r'^estabAuditoria', estabAuditoria, name='estabAuditoria'),
    #grid auditores designados
    url(r'^gridAudtDesignados', gridAudtDesignados, name='gridAudtDesignados'),
    #Insert Auditoria
    url(r'^setAuditoria', setAuditoria, name='setAuditoria'),
    #Grid Auditorias
    url(r'^gridAuditorias', gridAuditorias, name='gridAuditorias'),
    #Delete Auditoria
    url(r'^deleteAuditoria', deleteAuditoria, name='deleteAuditoria'),
    #Select Auditoria
    url(r'^getAuditoria', getAuditoria, name='getAuditoria'),
    #Update Auditoria
    url(r'^updateAudit', updateAudit, name='updateAudit'),
    #EXcel Auditorias
    url(r'^excelAudits', excelAudits, name='excelAudits'),
    #Pdf Auditorias
    url(r'^pdfAudits', pdfAudits, name='pdfAudits'),

    #vista SACS
    url(r'^sac', sac, name='sac'),
    #HISTORICO SAC
    url(r'^historico_sac', HistoricoSac, name='historico_sac'),
    # GRID SAC HISTORICO
    url(r'^grid_historicoSac', GridSacHistorico, name='grid_historicoSac'),
    #GridSac Admin
    url(r'^gridSacAdmin', gridSacAdmin, name='gridSacAdmin'),
    #Select SacAuditor
    url(r'^selectSacAudt', selectSacAudt, name='selectSacAudt'),
    #InsertSac Auditor
    url(r'^insertSacAudt', insertSacAudt, name='insertSacAudt'),
     #InsertSac Jefe de Area
    url(r'^insertSacJefe', insertSacJefe, name='insertSacJefe'),
    #select planAccion
    url(r'^planAccion', planAccion, name='planAccion'),
    #update planAccion
    url(r'^updatePlanAccion', updatePlanAccion, name='updatePlanAccion'),
    #Estado Plan Accion
    url(r'^upEstPlanAccion', upEstPlanAccion, name='upEstPlanAccion'),
    #ESTABLECER CIERRE 
    url(r'^upCierre', upCierre, name='upCierre'),
    #GENERAR REPORTE PDF
    url(r'^reporteSac', reporteSac, name='reporteSac'),
    #GRID PLAN ACCION BY ID SAC
    url(r'^gridSacPlanAccion', gridSacPlanAccion, name='gridSacPlanAccion'),
    #select PLAN ACCION POR ID
    url(r'^selectPlanPorId', selectPlanPorId, name='selectPlanPorId'),
    #select ESTADO SEGUIMIENTO
    url(r'^setEstadoSeguimiento', setEstadoSeguimiento, name='setEstadoSeguimiento'),
    #select ESTADO PLAN ACCION
    url(r'^setEstPlanAccion', setEstPlanAccion, name='setEstPlanAccion'),
    # APROBAR PLAN COLABORADOR
    url(r'^aprobar_plan_colaborador', AprobarPlanColaborador, name='aprobar_plan_colaborador'),
    # GRID SAC HISTORICO PLAN ACCION
    url(r'^grid_plan_colaborador', GridSacPlanAccion, name='grid_plan_colaborador'),
    # GRID HISTORICO PLAN ACCION
    url(r'^grid_historico_plan', GridHistoricoPlanAccion, name='grid_historico_plan'),


    #VISTA AUDITOR
    url(r'^auditor', auditor, name='auditor'),
    #GRID AUDITORIAS DESIGNADAS
    url(r'^audDesignadas', audDesignadas, name='audDesignadas'),
    #SELECT NORMA POR AUDITOR
    url(r'^selNorAud', selNorAud, name='selNorAud'),
    #documentos para auditoria
    url(r'^auditDoc', auditDoc, name='auditDoc'),
    #PDF plan de ejecucion
    url(r'^selPlanEjec', selPlanEjec, name='selPlanEjec'),
    #select procedimeintos de sac
    url(r'^getProcedimientos', getProcedimientos, name='getProcedimientos'),
    #GRID SAC AUDITOR LIDER
    url(r'^gridSacLider', gridSacLider, name='gridSacLider'),
    #ADMINISTRAR SAC LIDER
    url(r'^adminSacLider', adminSacLider, name='adminSacLider'),
    #DATA INFORME AUDITORIA
    url(r'^getInformeAuditoria', getInformeAuditoria, name='getInformeAuditoria'),
    #PDF INFORME AUDITORIA
    url(r'^pdfInformeAuditoria', pdfInformeAuditoria, name='pdfInformeAuditoria'),
    #PDF PLAN EJECUCION
    url(r'^pdfPlanEjecucion', pdfPlanEjecucion, name='pdfPlanEjecucion'),
    # DATA LISTA VERIFICACION
    url(r'^select_data_lista', SelectDataListaVerificacion, name='select_data_lista'),

    #VISTA COLABORADOR
    url(r'^colaborador', colaborador, name='colaborador'),

    #Selecion instructivo proceso
    url(r'^selProcCol', selProcCol, name='selProcCol'),

    #Selecion instructivo proceso
    url(r'^updateACtProce', updateACtProce, name='updateACtProce'),
    # Seguimientos Designados Colaborador
    url(r'^colSeguimientos', colSeguimientos, name='colSeguimientos'),
    # update Seguimiento designado
    url(r'^updateSegCol', updateSegCol, name='updateSegCol'),
    #Select Seguimiento
    url(r'^selSeguimiento', selSeguimiento, name='selSeguimiento'),
    #Estado Documentacion Colaborador
    url(r'^estadoDocColaborador', estadoDocColaborador, name='estadoDocColaborador'),
    #MOSTRAR OBSERVACIONES A COLABORADOR
    url(r'^selectNotEncargado', selectNotEncargado, name='selectNotEncargado'),
    #MOSTRAR OBSERVACIONES de admin A COLABORADOR
    url(r'^selectNotAdmin', selectNotAdmin, name='selectNotAdmin'),
    #GUARDAR JUSTIFICACION PLAN ACCION
    url(r'^setJustificacionPlan', setJustificacionPlan, name='setJustificacionPlan'),
    #GUARDAR JUSTIFICACION SEGUMIENTO   
    url(r'^setJustiSeguimiento', setJustiSeguimiento, name='setJustiSeguimiento'),

    #vista SAC AUDITOR
    url(r'^audiSac', audiSac, name='audiSac'),
    #select Proceso
    url(r'^setProceso', setProceso, name='setProceso'),
    #select jefe area
    url(r'^setJefeArea', setJefeArea, name='setJefeArea'),
    #Insert SacAuditor
    url(r'^insertSacAuditor', insertSacAuditor, name='insertSacAuditor'),
    #Update SacAuditor
    url(r'^updateSacAuditor', updateSacAuditor, name='updateSacAuditor'),
    #Grid Sac Auditor 
    url(r'^gridSacAuditor', gridSacAuditor, name='gridSacAuditor'),
     #PDF LISTA VERIFICACION 
    url(r'^pdfListVerificacion', pdfListVerificacion, name='pdfListVerificacion'),


    #VISTA PERSONAL
    url(r'^personal', personal, name='personal'),


    #VISTA CARGO
    url(r'^cargo', cargo, name='cargo'),
    #insert CARGO
    url(r'^insertCargo', insertCargo, name='insertCargo'),
    #Select CARGO
    url(r'^selectCargo', selectCargo, name='selectCargo'),
    #Update CARGO
    url(r'^updateCargo', updateCargo, name='updateCargo'),
    #Excel CARGO
    url(r'^excelCargos', excelCargos, name='excelCargos'),
    #PDf CARGO
    url(r'^pdfCargos', pdfCargos, name='pdfCargos'),
    #Select Personal
    url(r'^selectPersonal', selectPersonal, name='selectPersonal'),
    #Insert Personal
    url(r'^insertPersonal', insertPersonal, name='insertPersonal'),
    #Update Personal
    url(r'^updatePersonal', updatePersonal, name='updatePersonal'),
    #LISTADO DEL PERSONAL POR CARGO
    url(r'^perPorCargo', perPorCargo, name='perPorCargo'),
    #Excel Personal
    url(r'^excelPersonal', excelPersonal, name='excelPersonal'),
    #Pdf Personal
    url(r'^pdfPersonal', pdfPersonal, name='pdfPersonal'),
    #llenar comboBoxPersonal
    url(r'^listadoPersonal', listadoPersonal, name='listadoPersonal'),


    #VISTA DOCUMENTOS
    url(r'^documentos', documentos, name='documentos'),
    url(r'^directorios', directorios, name='directorios'),
    url(r'^createDirectorio', createDirectorio, name='createDirectorio'),
    url(r'^deleteDirectorio', deleteDirectorio, name='deleteDirectorio'),
    url(r'^editDirectorio', editDirectorio, name='editDirectorio'),
    url(r'^uploadArchivo', uploadArchivo, name='uploadArchivo'),
    url(r'^deleteArchivo', deleteArchivo, name='deleteArchivo'),
    url(r'^selectArchivo', selectArchivo, name='selectArchivo'),
    url(r'^designarDirectorio', designarDirectorio, name='designarDirectorio'),
    #estado documentacion admin
    url(r'^estadoDocAdmin', estadoDocAdmin, name='estadoDocAdmin'),
    #estado documentacion admin
    url(r'^updateDocAdmin', updateDocAdmin, name='updateDocAdmin'),
    #GRID ESTADO DOCUMENTACION
    url(r'^gridEstadoDocumentacion', gridEstadoDocumentacion, name='gridEstadoDocumentacion'),
    #SUBRID ESTADO REVISION DOCUMENTACION
    url(r'^gridRevisionDocumentacion', gridRevisionDocumentacion, name='gridRevisionDocumentacion'),
    #grid Documentos
    url(r'^grid_documentosAdmin', GridDocumentosAdministrador, name='grid_documentosAdmin'),
    #ESTABLECER NO VIGENTE
    url(r'^establecer_vigente', EstablecerVigente, name='establecer_vigente'),
    #ESTABLECER NO VIGENTE
    url(r'^establecer_noVigente', EstablecerNoVigente, name='establecer_noVigente'),
    # FIRMAR DOCUMENTO
    url(r'^firmar_documento', FirmarDocumento, name='firmar_documento'),
    # EDITAR DOCUMENTO
    url(r'^select_documento', SeleccionarDocProcedimiento, name='select_documento'),
    # ACTUALIZAR DOCUMENTO
    url(r'^actualizar_documento', ActualizarDocProcedimiento, name='actualizar_documento'),
    # ELIMINAR DOCUMENTO
    url(r'^eliminar_documento', EliminarDocProcedimiento, name='eliminar_documento'),
    # CONECTOR FILE TREE
    url(r'^dir_list', dirlist, name='dir_list'),
    # DOCUMENTO DISPONIBLES
    url(r'^griddocumentos_disponibles', GridDocumentosDisponibles, name='griddocumentos_disponibles'),
    # UNIFICADO
    url(r'^vista_unificada', Unificado, name='vista_unificada'),
    # UNIFICADO
    url(r'^insertarusuario_multinivel', InsertarUsuarioMultiple, name='insertarusuario_multinivel'),
    # UPDATE UNIFICADO
    url(r'^updateusuario_multinivel', UpdateUsuarioMultiple, name='updateusuario_multinivel'),
    #REPORTE HISTORICO DOCUMENTO
    url(r'^historico_documento', ReporteHistorico, name='historico_documento'),

    #INDICADORES
    url(r'', include('indicadores.urls')),



    #VISTA JEFE DE AREA
    url(r'^jefe', jefe, name='jefe'),
    #update JEFE DE AREA
    url(r'^updateSacJefe', updateSacJefe, name='updateSacJefe'),
    #INSERT PLAN ACCION
    url(r'^insertPlanAccion', insertPlanAccion, name='insertPlanAccion'),
    #UPDATE PLAN ACCION
    url(r'^updatePlan', updatePlan, name='updatePlan'),
    #DELETE PLAN ACCION
    url(r'^deletePlanAccion', deletePlanAccion, name='deletePlanAccion'),
    #SELECT PLAN ACCION por ID SAC
    url(r'^selectPlanAccion', selectPlanAccion, name='selectPlanAccion'),
    #SELECT PLAN ACCION POR ID
    url(r'^selectPlanColab', selectPlanColab, name='selectPlanColab'),
    #LISTADO DE DIRECTORIOS JEFE DE AREA
    url(r'^adminJefeDoc', adminJefeDoc, name='adminJefeDoc'),
    #ESTADO DE LA DOCUMENTACION JEFE DE AREA
    url(r'^updateDocJefe', updateDocJefe, name='updateDocJefe'),
    #ESTADO DOCUMENTACION JEFE
    url(r'^estadoDocJefe', estadoDocJefe, name='estadoDocJefe'),
    #select observacion lider de norma
    url(r'^selectNotLider', selectNotLider, name='selectNotLider'),

    #VISTA AUDITOR LIDER
    url(r'^lider', lider, name='lider'),
    #DIRECTORIOS AUDITOR LIDER
    url(r'^adminLiderDoc', adminLiderDoc, name='adminLiderDoc'),
    #estado documentacion  AUDITOR LIDER
    url(r'^estadoDocLider', estadoDocLider, name='estadoDocLider'),
    #Actualizar estado documentacion  AUDITOR LIDER
    url(r'^updateDocLider', updateDocLider, name='updateDocLider'),
     #GRID ESTADO DOCUMENTACION DIRECTOR DE AREA
    url(r'^grid_documentacionDirector', GridDocumentacionDirector, name='grid_documentacionDirector'),
    #GRID AUDITOR LIDER
    url(r'^grid_documentacionLider', GridDocumentacionLider, name='grid_documentacionLider'),
    # GRID LIDER DE NORMA
    url(r'^griddocumentacion_lidernorma', GridDocumentacionLiderNorma, name='griddocumentacion_lidernorma'),

    #VISTA LIDER DE NORMA
    url(r'^lid_norma', LiderNorma, name='lid_norma'),
    #estado documentacion lider norma
    url(r'^estadodoc_lidernorma', DocumentosLiderNorma, name='estadodoc_lidernorma'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)