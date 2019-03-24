from django.conf.urls import url
from django.conf import settings
from indicadores.views import Planificacion, Catalogos, Reportes, IngresarObjetivo, PdfObjetivos, GridObjetivosPadre, SubGridObjetivosHijos
from indicadores.views import EliminarObjetivo, ConsultarObjetivo, ActualizarObjetivo, ExcelObjetivos
from indicadores.views import IngresarDepartamento, GridDepartamentosPadre, SubGridDepartamentosHijo, ConsultarDepartamento, ActualizarDepartamento, ExcelDepartamentos
from indicadores.views import IngresarProducto, GridProductos, ConsultarProducto, ActualizarProducto, ExcelProductos
from indicadores.views import IngresarResponsable, GridResponsables, ConsultarResponsable, ActualizarResponsable, ExcelResponsables
from indicadores.views import IngresarPlan, GridPlanes, ConsultarPlanDeAccion, ActualizarPlan, ExcelPlanesDeAccion
from indicadores.views import IngresarVariables, GridVariables, ConsultarVariable, ActualizarVariable, ExcelVariables
from indicadores.views import IngresarFormula, GridFormulas, ConsultarFormula, ActualizarFormula, ExcelFormulas
from indicadores.views import IngresarEjeEstrategico, GridEjesEstrategicos, ConsultarEjesEstrategicos, ActualizarEjeEstrategico, ExcelEjesEstrategicos
from indicadores.views import IngresarPesoResponsable, GridPesosResponsables, ConsultarPesosResponsables, ActualizarPesoResponsable, ExcelPesosResponsables
urlpatterns = [
    url(r'^planificacion$', Planificacion, name='planificacion'),
    url(r'^catalogos$', Catalogos, name='catalogos'),
    url(r'^reportes$', Reportes, name='reportes'),
    #objetivos
    url(r'^ingresar_objetivo$', IngresarObjetivo, name='ingresar_objetivo'),
    url(r'^eliminar_objetivo$', EliminarObjetivo, name='eliminar_objetivo'),
    url(r'^consultar_objetivo$', ConsultarObjetivo, name='consultar_objetivo'),
    url(r'^actualizar_objetivo$', ActualizarObjetivo, name='actualizar_objetivo'),
    url(r'^excel_objetivo$', ExcelObjetivos, name='excel_objetivo'),
    url(r'^pdf_objetivo$', PdfObjetivos, name='pdf_objetivo'),
    url(r'^grid_objetivosPadre', GridObjetivosPadre, name='grid_objetivosPadre'),
    url(r'^subgrid_objetivosHijos', SubGridObjetivosHijos, name='subgrid_objetivosHijos'),
    #departamentos
    url(r'^ingresar_departamento$', IngresarDepartamento, name='ingresar_departamento'),
    url(r'^grid_deparmantosPadre', GridDepartamentosPadre, name='grid_deparmantosPadre'),
    url(r'^subgrid_deparmantosHijo', SubGridDepartamentosHijo, name='subgrid_deparmantosHijo'),
    url(r'^consultar_departamento', ConsultarDepartamento, name='consultar_departamento'),
    url(r'^actualizar_departamento', ActualizarDepartamento, name='actualizar_departamento'),
    url(r'^excel_departamento', ExcelDepartamentos, name='excel_departamento'),
    #Productos/Servicios
    url(r'^ingresar_producto', IngresarProducto, name='ingresar_producto'),
    url(r'^grid_productos', GridProductos, name='grid_productos'),
    url(r'^consultar_producto', ConsultarProducto, name='consultar_producto'),
    url(r'^actualizar_producto$', ActualizarProducto, name='actualizar_producto'),
    url(r'^excel_producto', ExcelProductos, name='excel_producto'),
    #responsables
    url(r'^ingresar_responsable$', IngresarResponsable, name='ingresar_responsable'),
    url(r'^grid_responsables', GridResponsables, name='grid_responsables'),
    url(r'^consultar_responsable$', ConsultarResponsable, name='consultar_responsable'),
    url(r'^actualizar_responsable$', ActualizarResponsable, name='actualizar_responsable'),
    url(r'^excel_responsable$', ExcelResponsables, name='excel_responsable'),
    #Plan de Accion
    url(r'^ingresar_plan$', IngresarPlan, name='ingresar_plan'),
    url(r'^grid_planesAccion$', GridPlanes, name='grid_planesAccion'),
    url(r'^consultar_planAccion$', ConsultarPlanDeAccion, name='consultar_planAccion'),
    url(r'^actualizar_planAccion$', ActualizarPlan, name='actualizar_planAccion'),
    url(r'^excel_planAccion$', ExcelPlanesDeAccion, name='excel_planAccion'),
    #VARIABLES
    url(r'^ingresar_variable', IngresarVariables, name='ingresar_variable'),
    url(r'^grid_variables', GridVariables, name='grid_variables'),
    url(r'^consultar_variable', ConsultarVariable, name='consultar_variable'),
    url(r'^actualizar_variable', ActualizarVariable, name='actualizar_variable'),
    url(r'^excel_variable', ExcelVariables, name='excel_variable'),
    #FORMULAS
    url(r'^ingresar_formula', IngresarFormula, name='ingresar_formula'),
    url(r'^grid_formulas', GridFormulas, name='grid_formulas'),
    url(r'^consultar_formula', ConsultarFormula, name='consultar_formula'),
    url(r'^actualizar_formula', ActualizarFormula, name='actualizar_formula'),
    url(r'^excel_formulas', ExcelFormulas, name='excel_formulas'),
    #EJES ESTRATEGICOS
    url(r'^ingresar_ejeestrategico', IngresarEjeEstrategico, name='ingresar_ejeestrategico'),
    url(r'^grid_ejesEstrategicos', GridEjesEstrategicos, name='grid_ejesEstrategicos'),
    url(r'^consultar_ejeestrategico', ConsultarEjesEstrategicos, name='consultar_ejeestrategico'),
    url(r'^actualizar_ejeestrategico', ActualizarEjeEstrategico, name='actualizar_ejeestrategico'),
    url(r'^excel_ejeEstrategico', ExcelEjesEstrategicos, name='excel_ejeEstrategico'),
    #PESOS RESPONSABLES
    url(r'^ingresar_pesoresponsable', IngresarPesoResponsable, name='ingresar_pesoresponsable'),
    url(r'^grid_pesosresponsables', GridPesosResponsables, name='grid_pesosresponsables'),
    url(r'^consultar_pesoresponsable', ConsultarPesosResponsables, name='consultar_pesoresponsable'),
    url(r'^actualizar_pesoresponsable', ActualizarPesoResponsable, name='actualizar_pesoresponsable'),
    url(r'^excel_pesosResponsables', ExcelPesosResponsables, name='excel_pesosResponsables'),

]