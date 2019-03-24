
    //autocargar funcion
    window.onload = gridEstadoDocumentacion;


   function mostrarObservacionesEncargado(){
    
    //token
    var csrftoken = getCookie('csrftoken');
    //peticion ajax
    $.ajax({
        type: "POST",
        url: "/selectNotEncargado/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
        },
        dataType: "json",
        success: function(data) {
           result = data[0];
           swal('Observacion: ' ,result.observaciones_encargado, 'info');
        },
        error: function( jqXHR, textStatus, errorThrown ) {

            if (jqXHR.status === 0) {

                swal('Not connect: Verify Network.', "", "error");

            } else if (jqXHR.status == 404) {

                swal('Requested page not found [404]', "", "error");

            } else if (jqXHR.status == 500) {

                swal('Internal Server Error [500]', "", "error");

            } else if (textStatus === 'parsererror') {

                swal('Requested JSON parse failed.', "", "error");
    
            } else if (textStatus === 'timeout') {

                swal('Time out error', "", "error");
    
            } else if (textStatus === 'abort') {
                swal('Ajax request aborted.', "", "error");
    
            } else {
                swal('Uncaught Error: ' + jqXHR.responseText, "", "error");
    
            }//end if 

        }//end error
    }); 

   }//end function mostrarObservacionesEncargado


   function mostrarObservacionesLider(id_proceso){
    
    //token
    var csrftoken = getCookie('csrftoken');
    //peticion ajax
    $.ajax({
        type: "POST",
        url: "/selectNotLider/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            id_proceso:id_proceso
        },
        dataType: "json",
        success: function(data) {
           result = data[0];
           
           swal('Observacion: ' ,result.observaciones_lider, 'info');
        },
        error: function( jqXHR, textStatus, errorThrown ) {

            if (jqXHR.status === 0) {

                swal('Not connect: Verify Network.', "", "error");

            } else if (jqXHR.status == 404) {

                swal('Requested page not found [404]', "", "error");

            } else if (jqXHR.status == 500) {

                swal('Internal Server Error [500]', "", "error");

            } else if (textStatus === 'parsererror') {

                swal('Requested JSON parse failed.', "", "error");
    
            } else if (textStatus === 'timeout') {

                swal('Time out error', "", "error");
    
            } else if (textStatus === 'abort') {
                swal('Ajax request aborted.', "", "error");
    
            } else {
                swal('Uncaught Error: ' + jqXHR.responseText, "", "error");
    
            }//end if 

        }//end error
    }); 

   }//end function mostrarObservacionesLider


   function mostrarObservacionesAdmin(id_proceso){
    
        //token
        var csrftoken = getCookie('csrftoken');

        //peticion ajax
        $.ajax({
            type: "POST",
            url: "/selectNotAdmin/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_proceso:id_proceso
            },
            dataType: "json",
            success: function(data) {
               result = data[0];
               swal('Observacion: ' ,result.observaciones_admin, 'info');
            },
            error: function( jqXHR, textStatus, errorThrown ) {
    
                if (jqXHR.status === 0) {
    
                    swal('Not connect: Verify Network.', "", "error");
    
                } else if (jqXHR.status == 404) {
    
                    swal('Requested page not found [404]', "", "error");
    
                } else if (jqXHR.status == 500) {
    
                    swal('Internal Server Error [500]', "", "error");
    
                } else if (textStatus === 'parsererror') {
    
                    swal('Requested JSON parse failed.', "", "error");
        
                } else if (textStatus === 'timeout') {
    
                    swal('Time out error', "", "error");
        
                } else if (textStatus === 'abort') {
                    swal('Ajax request aborted.', "", "error");
        
                } else {
                    swal('Uncaught Error: ' + jqXHR.responseText, "", "error");
        
                }//end if 
    
            }//end error
        }); 

   }//end function mostrarObservacionesAdmin


   function abrirModalSubirArchivo(id_documento, id_procedimiento, insert_revision, director_id, lider_id, admin_id){

        
        //abrir modal
        $("#subirArchivo").modal('show');

        //reset al formulario al abrir modal
        document.getElementById("formSubirArchivo").reset(); 
        var recipient = $("#nuevoDoc").attr('data-whatever');

        $("#subirArchivo #id_documento").val(id_documento);
        $("#subirArchivo #procedimiento").val(id_procedimiento);
        $("#subirArchivo #nombre").val(recipient);
        destino = $("#procedimiento option:selected").text();
        $("#subirArchivo #destino").val($.trim(destino));
        if(insert_revision ==1){
            $("#subirArchivo #accion").val('insert_revision');
            $("#subirArchivo #director_id").val(director_id);
            $("#subirArchivo #lider_id").val(lider_id);
            $("#subirArchivo #admin_id").val(admin_id);
        }
  
    }//end function abrirModalSubirArchivo


   function abrirModalReemplazarArchivo(id_documento, id_procedimiento, insert_revision, director_id, lider_id, admin_id){

        
        //abrir modal
        $("#reemplazarArchivo").modal('show');

        //reset al formulario al abrir modal
        document.getElementById("formSubirArchivo").reset(); 

        $("#reemplazarArchivo #id_documento").val(id_documento);
        $("#reemplazarArchivo #procedimiento").val(id_procedimiento);
        destino = $("#reemplazarArchivo #procedimiento option:selected").text();
        $("#reemplazarArchivo #destino").val($.trim(destino));
        if(insert_revision ==1){
            $("#reemplazarArchivo #accion").val('insert_revision');
            $("#reemplazarArchivo #director_id").val(director_id);
            $("#reemplazarArchivo #lider_id").val(lider_id);
            $("#reemplazarArchivo #admin_id").val(admin_id);
        }
  
    }//end function abrirModalReemplazarArchivo



    function setDestino(id_proceso){

        //token
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/selectProceso/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_proceso:id_proceso,
            },
            dataType: "json",
            success: function(data) {
                
                proceso = data.proceso_list;
                var ruta = proceso.url_carpeta.split('media/gestionDocumental/');
                $("#subirArchivo #destino").val(proceso.url_carpeta);
            },
            error: function( jqXHR, textStatus, errorThrown ) {
    
                if (jqXHR.status === 0) {
    
                    swal('Not connect: Verify Network.', "", "error");
    
                } else if (jqXHR.status == 404) {
    
                    swal('Requested page not found [404]', "", "error");
    
                } else if (jqXHR.status == 500) {
    
                    swal('Internal Server Error [500]', "", "error");
    
                } else if (textStatus === 'parsererror') {
    
                    swal('Requested JSON parse failed.', "", "error");
        
                } else if (textStatus === 'timeout') {
    
                    swal('Time out error', "", "error");
        
                } else if (textStatus === 'abort') {
                    swal('Ajax request aborted.', "", "error");
        
                } else {
                    swal('Uncaught Error: ' + jqXHR.responseText, "", "error");
        
                }//end if 
    
            }//end error
        }); 
    }//end function setDestino


    function gridEstadoDocumentacion(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridEstadoDocumentacion").jqGrid({
            url:'/grid_documentacionColaborador/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 1100,
            height: 300,
            rowNum:100,
            colNames:['PROCESO', 'PROCEDIMIENTO','ID','NOMBRE','DESCRIPCIÓN', 'VERSION', 'proceso_id', 'procedimiento_id', 'director_id', 'lider_id', 'admin_id', 'FECHA SUBIDO', 'ESTADO', 'ACCIÓN', 'AGREGAR', 'NUEVA VERSIÓN'],
            colModel: [
                { label: 'proceso', name: 'proceso', width: 25, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'procedimiento', name: 'procedimiento', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'id', name: 'id', width: 15, key:true, sorttype:"integer", hidden:true},
                { label: 'nombre', name: 'nombre', width: 30, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterNombre, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'descripcion', name: 'descripcion', width: 30, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterDescripcion, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'version', name: 'version', width: 15, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterVersion},
                { label: 'proceso_id', name: 'proceso_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'procedimiento_id', name: 'procedimiento_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'director_id', name: 'director_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'lider_id', name: 'lider_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'admin_id', name: 'admin_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'fec_subido', name: 'fec_subido', width: 20, sorttype:"string", align:'center'},
                { label: 'estado', name: 'estado', width: 35, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterEstado},
                { label: 'btn_archivo', name: 'btn_archivo', width: 30, sorttype:"string", align:'center', formatter:gridEstadoDocumentacion_FormatterBoton },
                { label: 'btn_nuevo', name: 'btn_nuevo', width: 20, sorttype:"string", align:'center', formatter:gridEstadoDocumentacion_FormatterNuevo },
                { label: 'btn_nuevaVersion', name: 'btn_nuevaVersion', width: 30, sorttype:"string", align:'center', formatter:formatterBtnNuevaVersion }
            ],
            pager: '#pagerGridEstadoDocumentacion',
            rownumbers: true,
            caption: "ESTADO DOCUMENTACIÓN",
            shrinkToFit: true,
            /**SUBGRID */
            subGrid: true,
            //subGridRowExpanded: showChildGrid,
            subGridRowExpanded:function(parentRowID,  row_id){
                //SELECCIONA LA DATA POR ROW_ID
                var dataFromTheRow = jQuery('#gridEstadoDocumentacion').jqGrid ('getRowData', row_id);
                //VARIABLES A CONSULTAR AREA/PROCESO
                var id_documento     = dataFromTheRow.id;
        
                // CREA UNA UNICA TABLA Y PAGINACION
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
                $("#" + childGridID).jqGrid({
                    url: /gridRevisionDocumentacion/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colModel: [
                        { label: 'id', name: 'id', width: 10, sorttype:"integer", align:'center', hidden:true},
                        { label: 'Director', name: 'nombre_director', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_director', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoDirector},
                        { label: 'Observación', name: 'observacion_rev_director', width: 30, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionDirector},
                        { label: 'Fec. Revisión', name: 'fec_rev_director', width: 30, sorttype:"string", align:'center'},
                        { label: 'Líder', name: 'nombre_lider', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_lider', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoLider},
                        { label: 'Observación', name: 'observacion_rev_lider', width: 30, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionLider},
                        { label: 'Fec. Revisión', name: 'fec_rev_lider', width: 30, sorttype:"string", align:'center'},
                        { label: 'Admin.', name: 'nombre_admin', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_admin', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoAdmin},
                        { label: 'Observación', name: 'observacion_rev_admin', width: 30, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionAdmin},
                        { label: 'Fec. Revisión', name: 'fec_rev_admin', width: 30, sorttype:"string", align:'center'},
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                            $("#" + childGridID).html("<span class='badge bg-red'>Sin  Revisiones !!</span>");
                        }
                    },
                    postData: {id_documento: id_documento},
                    loadonce: true, 
                    rownumbers: true,
                    rowNum:30,
                    width: 1200,
                    height:'100%',
                    pager: "#" + childGridPagerID,
                });
                jQuery("#" + childGridID).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false, 
                    groupHeaders:[
                      {startColumnName: 'nombre_director', numberOfColumns: 4, titleText: '<span class="badge bg-green">Director de Área</span>'},
                      {startColumnName: 'nombre_lider', numberOfColumns: 4, titleText: '<span class="badge bg-green">Líder de Norma</span>'},
                      {startColumnName: 'nombre_admin', numberOfColumns: 4, titleText: '<span class="badge bg-green">Administrador</span>'},
                    ]
                  });

                /* FORMATTER SUBGRID*/
                    function subGridDocumentacionFormatterObservacionDirector(cellvalue, options, rowObject){

                        if (rowObject.observacion_rev_director != null){
                            observacion = encode(rowObject.observacion_rev_director);
                            new_formatter_observacionDirector = '<a href="javascript:void(0)" onclick="mi_funcion(\''+observacion+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                        }else{
                            new_formatter_observacionDirector= "";
                        }
                        return new_formatter_observacionDirector

                    }//end function subGridDocumentacionFormatterObservacionDirector

                    function subGridDocumentacionFormatterEstadoDirector(cellvalue, options, rowObject){

                        if(rowObject.estado_rev_director == 0){
                            new_formatter_estadoDirector = "<i class='fa fa-info-circle' style='color:red'></i> Sin Archivo";
                        }
                        if(rowObject.estado_rev_director == 1){
                            new_formatter_estadoDirector = "<i class='fa fa-clock-o' style='color:red;'></i> En revision";
                        }
                        if(rowObject.estado_rev_director == 2){
                            new_formatter_estadoDirector = "<i class='fa fa-commenting-o' style='color:red;'></i> Observaciones";
                        }
                        if(rowObject.estado_rev_director == 3){
                            new_formatter_estadoDirector = "<i class='fa fa-check' style='color:green;'> </i> Aprobado";
                        }
                        return new_formatter_estadoDirector;

                    }//end function subGridDocumentacionFormatterEstadoDirector

                    function subGridDocumentacionFormatterObservacionLider(cellvalue, options, rowObject){

                        if (rowObject.observacion_rev_lider != null){
                            observacion_lider = encode(rowObject.observacion_rev_lider);
                            new_formatter_observacionLider = '<a href="javascript:void(0)" onclick="mi_funcion(\''+observacion_lider+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                        }else{
                            new_formatter_observacionLider= "";
                        }
                        return new_formatter_observacionLider

                    }//end function subGridDocumentacionFormatterObservacionLider

                    function subGridDocumentacionFormatterEstadoLider(cellvalue, options, rowObject){

                        if(rowObject.estado_rev_lider == 0){
                            new_formatter_estadoLider = "<i class='fa fa-info-circle' style='color:red'></i> Sin Archivo";
                        }
                        if(rowObject.estado_rev_lider == 1){
                           new_formatter_estadoLider ="<i class='fa fa-clock-o' style='color:red;'></i> Pendiente"
                        }
                        if(rowObject.estado_rev_lider == 2){
                           new_formatter_estadoLider ="<i class='fa fa-commenting-o' style='color:red;'></i> Observaciones"
                        }
                        if(rowObject.estado_rev_lider == 3){
                            new_formatter_estadoLider = "<i class='fa fa-check' style='color:green;'></i> Aprobado";
                        }
                        return new_formatter_estadoLider;

                    }//end function subGridDocumentacionFormatterEstadoDirector

                    function subGridDocumentacionFormatterObservacionAdmin(cellvalue, options, rowObject){
                        
                        if (rowObject.observacion_rev_admin != null){
                             observacion = encode(rowObject.observacion_rev_admin);
                             new_formatter_observacionAdmin = '<a href="javascript:void(0)" onclick="mi_funcion(\''+observacion+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                        }else{
                            new_formatter_observacionAdmin= "";
                        }
                        return new_formatter_observacionAdmin

                    }//end function subGridDocumentacionFormatterObservacionLider

                    function subGridDocumentacionFormatterEstadoAdmin(cellvalue, options, rowObject){
                        if(rowObject.estado_rev_admin == 0){
                            new_formatter_estadoAdmin = "<i class='fa fa-info-circle' style='color:red'></i> Sin Archivo";
                        }
                        if(rowObject.estado_rev_admin == 1){
                            new_formatter_estadoAdmin = "<i class='fa fa-clock-o' style='color:red;'></i> Pendiente";
                        }
                        if(rowObject.estado_rev_admin == 2){
                            new_formatter_estadoAdmin = "<i class='fa fa-commenting-o' style='color:red;'></i> Observaciones";
                        }
                        if(rowObject.estado_rev_admin == 3){
                            new_formatter_estadoAdmin = "<i class='fa fa-check' style='color:green;'></i> Aprobado";
                        }
                        return new_formatter_estadoAdmin;
                    }//end function subGridDocumentacionFormatterEstadoDirector

            },
            subGridOptions : {
                expandOnLoad: false
            },
            /**ENDSUBGRID */   
                
        });
        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridEstadoDocumentacion").jqGrid('filterInput', self.value);
            },0);
        });
        function gridEstadoDocumentacion_FormatterEstado(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_estado = "<i class='fa fa-info-circle' style='color:red'> Sin Archivo</i>"
            }
            if(rowObject.estado == 1){
                new_formatter_estado="<i class='fa fa-clock-o' style='color:red;'>En revision</i> ";
            }
            if(rowObject.estado == 2){
                new_formatter_estado = "<i class='fa fa-commenting-o' style='color:red;'> Observaciones</i>";
            }
            if(rowObject.estado == 3){
                new_formatter_estado="<i class='fa fa-clock-o' style='color:red;'>En revision</i> ";
            }
            if(rowObject.estado == 4){
                new_formatter_estado="<i class='fa fa-check' style='color:green;'> Aprobado y Vigente</i> ";
            }
            if(rowObject.estado == 5){
                new_formatter_estado="<i class='fa fa-info-circle' style='color:red;'> No Vigente</i> ";
            }
            return new_formatter_estado

        }//end function gridEstadoDocumentacion_FormatterEstado


        function gridEstadoDocumentacion_FormatterBoton(cellvalue, options, rowObject){

            id_documento        = rowObject.id;
            id_procedimiento    = rowObject.procedimiento_id;

            admin_id        = rowObject.admin_id;
            director_id     = rowObject.director_id;
            lider_id        = rowObject.lider_id;
            procedimiento   = rowObject.procedimiento;

            insert_revision = 1;
            
            if(rowObject.estado == 0){
                new_formatter_boton = "<a href='javascript:void(0)' onclick='abrirModalSubirArchivo("+id_documento+","+id_procedimiento+")' class='btn btn-success btn-xs btn-flat' data-whatever='"+procedimiento+"' id='nuevoDoc'><i class='fa fa-cloud-upload'></i> Subir</a>"
            }
            if(rowObject.estado == 1){
                new_formatter_boton = "<i class='fa fa-check' style='color:green'> Subido</i>"
            }
            if(rowObject.estado == 2){
                new_formatter_boton = "<a href='javascript:void(0)' onclick='abrirModalReemplazarArchivo("+id_documento+","+id_procedimiento+","+insert_revision+","+director_id+","+lider_id+","+admin_id+")' class='btn btn-warning btn-xs btn-flat'><i class='fa fa-cloud-upload'></i> Reemplazar</a>"
            }
            if(rowObject.estado == 3 || rowObject.estado == 4 || rowObject.estado == 5){
                new_formatter_boton = "<i class='fa fa-check' style='color:green'>Subido</i>"
            }

            return new_formatter_boton

        }//end function gridEstadoDocumentacion_FormatterBoton


        function gridEstadoDocumentacion_FormatterNuevo(cellvalue, options, rowObject){

            proceso_id          = rowObject.proceso_id;
            procedimiento_id    = rowObject.procedimiento_id;

            admin_id            = rowObject.admin_id;
            director_id         = rowObject.director_id;
            lider_id            = rowObject.lider_id;

            new_formatter_bt_nuevo = "<a href='javascript:void(0)' class='btn btn-xs btn-info btn-flat' onclick='modalSubirArchivo("+proceso_id+","+procedimiento_id+", "+director_id+", "+lider_id+", "+admin_id+")'><i class='fa fa-cloud'>Nuevo</i></a>"
            return new_formatter_bt_nuevo;
        }// end function gridEstadoDocumentacion_FormatterNuevo


        function formatterBtnNuevaVersion(cellvalue, options, rowObject){
             if(rowObject.estado == 5){
                documento_id        = rowObject.id;
                proceso_id          = rowObject.proceso_id;
                procedimiento_id    = rowObject.procedimiento_id;

                admin_id            = rowObject.admin_id;
                director_id         = rowObject.director_id;
                lider_id            = rowObject.lider_id;

                btn_nuevaVersion = "<a href='javascript:void(0);' class='btn btn-xs bg-orange btn-flat' onclick='modalNuevaVersion("+proceso_id+","+procedimiento_id+", "+director_id+", "+lider_id+", "+admin_id+","+documento_id+");' title='Nueva Versión'><i class ='fa fa-cloud-upload'></i> Nueva Versión</a>";
            }else{
                btn_nuevaVersion = '';
            }
            return btn_nuevaVersion;
        }//end function formatterBtnNuevaVersion

        function gridEstadoDocumentacion_FormatterNombre(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_nombre = "<i class='fa fa-info-circle' style='color:red'> Sin Archivo</i>"
            }else{
                new_formatter_nombre = rowObject.nombre
            }
            return new_formatter_nombre

        }//end function gridEstadoDocumentacion_FormatterNombre

        function gridEstadoDocumentacion_FormatterDescripcion(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_descripcion = ""
            }else{

                if(rowObject.descripcion){
                    descripcion = encode(rowObject.descripcion);
                    return '<a href="javascript:void(0)" onclick="mi_funcion(\''+descripcion+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                }else{
                    return "<span class='badge bg-olive'>Sin descripción</span>";
                }
            }
            return new_formatter_descripcion

        }//end function gridEstadoDocumentacion_FormatterDescripcion


        function gridEstadoDocumentacion_FormatterVersion(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_version = ""
            }else{
                new_formatter_version = rowObject.version
            }
            return new_formatter_version

        }//end function gridEstadoDocumentacion_FormatterVersion



    }//end function gridEstadoDocumentacion


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function mi_funcion(data){
       $("#modalHallazgo #descripcion").html(data.replace(/(<([^>]+)>)/ig,""));
       $("#modalHallazgo").modal('show');

    }//end funtion


    function modalSubirArchivo(proceso_id, procedimiento_id, director_id, lider_id, admin_id){
        
        
        $("#modalArchivoNuevo #documento").val(null);
        $("#modalArchivoNuevo #proceso_id").val(proceso_id);
        $("#modalArchivoNuevo #procedimiento_id").val(procedimiento_id);
        $("#modalArchivoNuevo #director_id").val(director_id);
        $("#modalArchivoNuevo #lider_id").val(lider_id);
        $("#modalArchivoNuevo #admin_id").val(admin_id);
        $("#modalArchivoNuevo #procedimiento").val(procedimiento_id);

        var destino = $("#modalArchivoNuevo #procedimiento option:selected").text();
        $("#modalArchivoNuevo #destino").val($.trim(destino))

        //mostrar modal
        $("#modalArchivoNuevo").modal('show');

        swal({title:'Recuerde !!', text:'Desde aqui podrá agregar mas Documentos al Procedimiento seleccionado.', icon:'info'});
        return false;

    }//end function modalSubirArchivo


    function modalNuevaVersion(proceso_id, procedimiento_id, director_id, lider_id, admin_id, documento_id){

        $("#modalNuevaVersion #admin_id").val(admin_id);
        $("#modalNuevaVersion #lider_id").val(lider_id);
        $("#modalNuevaVersion #director_id").val(director_id);
        $("#modalNuevaVersion #procedimiento").val(procedimiento_id);
        $("#modalNuevaVersion #proceso_id").val(proceso_id);
        $("#modalNuevaVersion #procedimiento_id").val(procedimiento_id);
        var destino = $("#modalNuevaVersion #procedimiento option:selected").text();
        $("#modalNuevaVersion #destino").val($.trim(destino))
        $("#modalNuevaVersion #nombre").val($.trim(destino))

        //peticion ajax

        //token
        var csrftoken           = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/consultar_versionanterior",
            data:{
                csrfmiddlewaretoken : csrftoken,
                documento_id:documento_id,
            },
            dataType: "json",
            success: function(data) {
                var codigo =data.resultado;
                if (codigo=="ok_select"){
                    dataDocumento = data.documento[0];
                    versionAnterior =dataDocumento.version;
                    nuevaVersion = (parseInt(versionAnterior) + 1).toFixed(1);
                    $("#modalNuevaVersion #version").val(nuevaVersion);
                    $("#modalNuevaVersion #descripcion").val(dataDocumento.descripcion);
                }
            },//end success
            error: function( jqXHR, textStatus, errorThrown ) {

                if (jqXHR.status === 0) {

                    swal('Not connect: Verify Network.', "", "error");

                } else if (jqXHR.status == 404) {

                    swal('Requested page not found [404]', "", "error");

                } else if (jqXHR.status == 500) {

                    swal('Internal Server Error [500]', "", "error");

                } else if (textStatus === 'parsererror') {

                    swal('Requested JSON parse failed.', "", "error");

                } else if (textStatus === 'timeout') {

                    swal('Time out error', "", "error");

                } else if (textStatus === 'abort') {
                    swal('Ajax request aborted.', "", "error");

                } else {
                    swal('Uncaught Error: ' + jqXHR.responseText, "", "error");

                }//end if

            }//end error
        });

        $("#modalNuevaVersion").modal('show');

        //consultar_versionanterior

    }//end function modalNuevaVersion