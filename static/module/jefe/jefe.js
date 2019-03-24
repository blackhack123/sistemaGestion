    

    /** 
    * PARAMETRIZAR DATATABLES
    */
   var table = $('#table_plan_accion').DataTable( {
        // "pageLength": 5,
        //"scrollY":        "150px",
        //"scrollCollapse": true,
        //"aLengthMenu": [[5, 10, 50, 100,-1], [5, 10, 50, 100,"All"]],
        //"iDisplayLength": 5,
        "language": {
        url: "/static/DataTables/es_ES.json"
        }
    });
    
    //editable inline datatables

    
    //INSTANCIAMOS EL CKEDITOR DE CLAUSUAL
    CKEDITOR.replace( 'descripcion_correcion' );
    CKEDITOR.replace( 'analisis_causa' );
    //CKEDITOR.replace( 'descripcion_auditor' );
    


    //autocargar funcion
    window.onload = gridSacJefe;


    /*********************************************/
    /**FUNCION PARA OBTENER EL TOKEN DJANGO*******/
    /*********************************************/

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        //RETORNANDO EL TOKEN
        return cookieValue;

    }//end function getCookie



    function gridSacJefe(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridSacJefe").jqGrid({
            url:'/gridSacAuditor/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 1300,
            height: 320,
            rowNum:100,
            colNames:['SAC N°', 'SAC Vin.','sac_jefe' ,'AUDIT.', 'LUGAR','PROCESO', 'PROCEDIMIENTO','CRITICIDAD', 'HALLAZG0', 'ANÁLISIS', 'CORRECCIÓN', 'ESTADO', 'OBSERVACIÓN', '<span class="badge bg-purple">ANÁLISIS</span>', '<span class="badge bg-purple">PLAN</span>'],
            colModel: [
                { label: 'id', name: 'id', width: 18, key:true, sorttype:"integer", align:'center'},
                { label: 'sac_id', name: 'sac_id', width: 18, sorttype:"integer", align:'center'},
                { label: 'sac_jefe', name: 'sac_jefe', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 17, sorttype:"integer", align:'center'},
                { label: 'lugar', name: 'lugar', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'procedimiento', name: 'procedimiento', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'criticidad', name: 'criticidad', width: 20, sorttype:"string", align:'center'},
                { label: 'descripcion_hallazgo', name: 'descripcion_hallazgo', width: 25, sorttype:"string", align:'center', formatter:gridSac_FormatterHallazgo},
                { label: 'analisis_causa', name: 'analisis_causa', width: 25, sorttype:"string", align:'center', formatter:gridSac_FormatterAnalisis},
                { label: 'descripcion_correcion', name: 'descripcion_correcion', width: 25, sorttype:"string", align:'center', formatter:gridSac_FormatterCorrecion},
                { label: 'estado_cabecera', name: 'estado_cabecera', width: 30, sorttype:"string", align:'center', formatter: gridSac_FormatterEstado},
                { label: 'observacion_cabecera', name: 'observacion_cabecera', width: 28, sorttype:"string", align:'center', formatter: gridSac_FormatterObservacion},
                { name: 'btn_analisis', width: 35, sorttype:"integer", align:'center', formatter:gridSac_FormatterAnalisisEditar},
                { name: 'btn_plan', width: 30, sorttype:"integer", align:'center', formatter:gridSac_FormatterPlanEditar},
            ],
            pager: '#pagerSacJefe',
            rownumbers: true,
            caption: "SACS",
            shrinkToFit: true,

            //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
            ondblClickRow: function (rowid,iRow,iCol,e) {
            
            },
            gridview: true,
            rowattr: function (rd) {
               if (rd.numero_auditoria === null) {
                   return {"class": "myAltRowClass"};
               }
            },
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    emptyMsgDiv.show();
                    //desabilitarReportes();
                } else {
                    $(this).show();
                    emptyMsgDiv.hide();
                }
            },

            /** INICIO SUBGRID */
            subGrid: true,
            subGridRowExpanded:function(parentRowID,  row_id){
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
                $("#" + childGridID).jqGrid({
                    url: /gridSacPlanAccion/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colNames:['ID', 'PLAN ACCIÓN', 'PLAZO', 'RESPONSABLE', 'DETALLE ACCIÓN','estado_plan','FEC. SEG.', 'RESP. SEGUIMIENTO', 'DET. SEGUIMIENTO', 'EST. SEG.', 'EST. APROB', 'OBS. APROB', 'EST. CIERRE','sac_id', '', ''],
                    colModel: [
                        { name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true, key:true},
                        { name: 'detalle_plan_accion', width: 13, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterPlan},
                        { name: 'plazo_plan_accion', width: 10, sorttype:"string", align:'center'},
                        { name: 'responsable_accion', width: 20, sorttype:"string", align:'center'},
                        { name: 'justificacion_plan', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterDetalleAccion},
                        { name: 'estado_plan', width: 25, sorttype:"string", align:'center', hidden:true},
                        { name: 'fecha_seguimiento', width: 15, sorttype:"string", align:'center'},
                        { name: 'responsable_seguimiento', width: 25, sorttype:"string", align:'center'},
                        { name: 'detalle_seguimiento', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterDetalleSeguimiento},
                        { name: 'estado_seguimiento', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoSeguimiento},
                        { name: 'estado_aprobacion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoPlan},
                        { name: 'observaciones_aprobacion', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObservacionPlan},
                        { name: 'estado_cierre_accion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoCierre},
                        { name: 'sac_id', width: 25, sorttype:"string", align:'center', hidden:true},
                        { name: 'btn_editar_plan', width:8, sorttype:'string', align:'center', formatter:grabarPlanAccion_FormatterBtnEditar},
                        { name: 'btn_eliminar_plan', width:8, sorttype:'string', align:'center', formatter:grabarPlanAccion_FormatterBtnEliminar}
                        //grabarPlanAccion_FormatterBtnEliminar
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                           
                           $("#" + childGridID).html("<span class='badge bg-red'>Sin  Plan de Accion !!</span>");
                        }
                    },
                    postData: {row_id: row_id},
                    loadonce: true, 
                    rownumbers: true,
                    rowNum:5,
                    width: 1600,
                    height:'100%',
                    pager: "#" + childGridPagerID
                    
                });
                //GROUP HEADER SUB GRILLA
                jQuery("#" + childGridID).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false,
                    groupHeaders:[
                        {startColumnName: 'id', numberOfColumns: 5, titleText: '<span class="badge bg-green">RESPONSABLE PLAN DE ACCIÓN</em>'},
                        {startColumnName: 'fecha_seguimiento', numberOfColumns: 4, titleText: '<span class="badge bg-green">RESPONSABLE SEGUIMIENTO</em>'},
                        {startColumnName: 'btn_editar_plan', numberOfColumns: 2, titleText: '<span class="badge bg-green">ACCIONES</em>'},
                    ]
                  });
                /** INICIO FORMATTER SUBGRID */

                function gridPlanAccion_FormatterPlan(cellvalue, options, rowObject){

                    if(rowObject.detalle_plan_accion){
                         new_formatter_value ='<a href="javascript:void(0)" onclick="consultarDetallePlanAccion('+rowObject.id+');"><i class="fa fa-envelope"></i> Abrir</a>';
                        //detalle_plan_accion = encode(rowObject.detalle_plan_accion);
                        //new_formatter_value ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+detalle_plan_accion+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value ="<span class='badge bg-red'>Sin Plan</span>"
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterPlan


                function gridPlanAccion_FormatterDetalleAccion(cellvalue, options, rowObject){

                    if(rowObject.justificacion_plan){
                        justificacion_plan= encode(rowObject.justificacion_plan);
                        new_format_DetalleAccion ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+justificacion_plan+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_format_DetalleAccion = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    return new_format_DetalleAccion;
                }//end function gridPlanAccion_FormatterDetalleAccion


                function gridPlanAccion_FormatterDetalleSeguimiento(cellvalue, options, rowObject){

                    if(rowObject.detalle_seguimiento){
                        detalle_seguimiento = encode(rowObject.detalle_seguimiento);
                        new_formatter_value ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+detalle_seguimiento+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value =""
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterDetalleSeguimiento


                function gridPlanAccion_FormatterEstadoSeguimiento(cellvalue, options, rowObject){

                    if(rowObject.estado_seguimiento == '0'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    if(rowObject.estado_seguimiento == '1'){
                        new_format_value_estadoSeguimiento ='<span class="badge bg-blue">Designado</span>';
                    }
                    if(rowObject.estado_seguimiento == '2'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-clock-o"> En Revision</i>';
                    }
                    if(rowObject.estado_seguimiento == '3'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-check" style="color:green"> Aprobado</i>';
                    }
                    if(rowObject.estado_seguimiento == '4'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-commenting-o" style="color:orange"> Observaciones</i>';
                    }
                    return new_format_value_estadoSeguimiento;
                }//end function gridPlanAccion_FormatterEstadoSeguimiento

                function grabarPlanAccion_FormatterBtnEditar(cellvalue, options, rowObject){
                    if(rowObject.estado_plan =='1'){
                    new_formatter_btnEditar = '';
                    }else{
                        new_formatter_btnEditar='<a href="javascript:void(0)" onclick="consultarPlanAccion(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange"></i></a>';
                    }
                    return new_formatter_btnEditar;
                }
                function grabarPlanAccion_FormatterBtnEliminar(cellvalue, options, rowObject){
                    if(rowObject.estado_plan =='1'){
                    new_formatter_btnEliminar = '';
                    }else{
                    new_formatter_btnEliminar='<a href="javascript:void(0)" onclick="eliminarPlanAccion(\''+rowObject.id+'\');"><i class="fa fa-close" style="color:red"></i></a>';
                    }
                    return new_formatter_btnEliminar;
                }


                function gridPlanAccion_FormatterEstadoPlan(cellvalue, options, rowObject){
                    if(rowObject.estado_aprobacion ==1){
                        new_formatter_estadoAprobacion='<span class="badge bg-green">Aprobado</span>';
                    }else if(rowObject.estado_aprobacion ==0){
                        new_formatter_estadoAprobacion='<span class="badge bg-yellow">Observaciones</span>';
                    }else{
                        new_formatter_estadoAprobacion='<span class="badge bg-yellow">Ninguna</span>';
                    }
                    return new_formatter_estadoAprobacion;
                }//end function gridPlanAccion_FormatterEstadoPlan


                function gridPlanAccion_FormatterObservacionPlan(cellvalue, options, rowObject){
                    if(rowObject.observaciones_aprobacion){
                        new_formatter_observacionAprobacion = '<a href="javascript:void(0)" onclick="mi_funcion(\''+detalle_seguimiento+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_observacionAprobacion = '';
                    }
                    return new_formatter_observacionAprobacion;
                }//end function gridPlanAccion_FormatterObservacionPlan


                function gridPlanAccion_FormatterEstadoCierre(cellvalue, options, rowObject){
                    if(rowObject.estado_cierre_accion=='1'){
                        new_formatter_estadoCierre='<span class="badge bg-green">Imp. y Efectiva</span>';
                    }else if(rowObject.estado_cierre_accion=='2'){
                        new_formatter_estadoCierre='<span class="badge bg-yellow">Imp. y No Efect.</span>';
                    }else if(rowObject.estado_cierre_accion=='3'){
                        new_formatter_estadoCierre='<span class="badge bg-red">No Implement.</span>';
                    }else{
                        new_formatter_estadoCierre='<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    return new_formatter_estadoCierre;
                }//end function gridPlanAccion_FormatterEstadoCierre
                /** FIN FORMATTER SUBGRID */
            }
            /** FIN SUBGRID */  
        });
        //GROUP HEADER GRILLA PRINCIPAL
        jQuery("#gridSacJefe").jqGrid('setGroupHeaders', {
            useColSpanStyle: false, 
            groupHeaders:[
                {startColumnName: 'id', numberOfColumns: 8, titleText: '<span class="badge bg-green">AUDITOR</em>'},
                {startColumnName: 'analisis_causa', numberOfColumns: 4, titleText: '<span class="badge bg-green">DIRECTOR DE ÁREA</em>'},
                {startColumnName: 'btn_analisis', numberOfColumns: 2, titleText: '<span class="badge bg-green">ACCIONES</em>'},
            ]
          });


        //muestra el mensaje luego de cargar la grilla 
        emptyMsgDiv.insertAfter($("#gridSacJefe").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridSacAuditor").jqGrid('filterInput', self.value);
            },0);
        });


        function gridSac_FormatterHallazgo(cellvalue, options, rowObject)
        {	
            var hallazgo = rowObject.descripcion_hallazgo;

            var tag = document.createElement('div');
            tag.innerHTML = hallazgo;
            nuevo_valor = tag.innerText;

            if(hallazgo){
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '<span class="badge bg-blue">Sin Hallazgo</span>';
            }//end if
            
            return new_formatter_value;

        }//end function gridSac_FormatterHallazgo


        function gridSac_FormatterAnalisis(cellvalue, options, rowObject)
        {	
            var analisis_causa = rowObject.analisis_causa;
            if(analisis_causa){
                var tag = document.createElement('div');
                tag.innerHTML = analisis_causa;
                nuevo_valor = tag.innerText;
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }//end if 
            
            return new_formatter_value;

        }//end function gridSac_FormatterHallazgo


        function gridSac_FormatterCorrecion(cellvalue, options, rowObject)
        {	
            var descripcion_correcion = rowObject.descripcion_correcion;
            if (descripcion_correcion){
                var tag = document.createElement('div');
                tag.innerHTML = descripcion_correcion;
                nuevo_valor = tag.innerText;
                var new_formatter_correcion = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_correcion = '';
            }
            
            return new_formatter_correcion;

        }//end function gridSac_FormatterHallazgo

        function gridSac_FormatterEstado(cellvalue, options, rowObject){

            if(rowObject.estado_cabecera == 0){
                new_formatter_estado_cabecera = '<i class="fa fa-clock-o" style="color:red"> Pendiente</i>';
            }

            if(rowObject.estado_cabecera == 1 || rowObject.estado_cabecera == 2 || rowObject.estado_cabecera == 3){
                new_formatter_estado_cabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</i>';
            }
            if(rowObject.estado_cabecera == 4){
                new_formatter_estado_cabecera = '<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
            }
            if(rowObject.estado_cabecera == 5){
                new_formatter_estado_cabecera = '<i class="fa fa-check" style="color:green"> Aprobada</i>';
            }
            return new_formatter_estado_cabecera

        }//end function gridSac_FormatterEstado


        function gridSac_FormatterObservacion(cellvalue, options, rowObject){

            if(rowObject.estado_cabecera == 4){

                new_formatter_observacion_cabecera = '<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_cabecera+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_observacion_cabecera = '';
            }
            return new_formatter_observacion_cabecera

        }//end function gridSac_FormatterObservacion


        function gridSac_FormatterAnalisisEditar(cellvalue, options, rowObject){

            if(rowObject.estado_cabecera==0){
               new_formatter_analisisEditar ='<i class="fa fa-clock-o" style="color:orange;"> Pendiente</i>';
            }
            if(rowObject.estado_cabecera==1){
                new_formatter_analisisEditar='<a href="javascript:void(0)" onclick="consultar_sac_jefe(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange"> Editar</i></a>';
            }
            if(rowObject.estado_cabecera==2 || rowObject.estado_cabecera==3){
                new_formatter_analisisEditar='<i class="fa fa-clock-o" style="color:orange;"> En Revision</i>';
            }
            if(rowObject.estado_cabecera==4){
                new_formatter_analisisEditar='<a href="javascript:void(0)" onclick="consultar_sac_jefe(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange"> Editar</i></a>'
            }
            if(rowObject.estado_cabecera==5){
                new_formatter_analisisEditar='<i class="fa fa-check" style="color:green;"> Aprobada</i>'
            }
            
            return new_formatter_analisisEditar

        }//endfunction gridSac_FormatterEditar


        function gridSac_FormatterPlanEditar(cellvalue, options, rowObject){

            if(rowObject.estado_cabecera==5){
                new_formatter_planEditar='<a href="javascript:void(0)" onclick="consultar_plan_accion(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange"> Editar</i></a>';
            }else{
                new_formatter_planEditar='<i class="fa fa-clock-o" style="color:orange;"> Pendiente</i>'
            }
            
            return new_formatter_planEditar

        }//endfunction gridSac_FormatterEditar

    }//end function gridSacAuditor


    //MOSTRAR EL DETALLE
    function mi_funcion(data){

       $("#descripcion").html(data.replace(/(<([^>]+)>)/ig,""));
       $("#modalHallazgo").modal('show');

    }//end funtion

    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    CKEDITOR.replace('descripcion');
    $('#modalHallazgo').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      var modal = $(this)
      CKEDITOR.instances.descripcion.setData(recipient);
    });

    function consultarPlanAccion(id_plan){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectPlanColab/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_plan:id_plan,
            },
            dataType: "json",
            success: function(data) {
                mostrar_planAccionEditar(data);
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


    }//end function consultarPlanAccion



    //function mostrar_planAccionEditar(data, sac_id){
    function mostrar_planAccionEditar(data){
   

        plan_accion = data[0];

        var plan            = plan_accion.detalle_plan_accion;
        var plazo           = plan_accion.plazo_plan_accion;
        var responsable_id  = plan_accion.responsable_plan_accion_id;
        var sac_id          = plan_accion.sac_id;
        var id_plan         = plan_accion.id;

        $("#modalEditarPlanAccion #span_editarPlanAccion").html("Editar Plan Accion - SAC N°: "+sac_id);
        $('#modalEditarPlanAccion #id_plan').val(id_plan);

        //data plan de accion
        $("#modalEditarPlanAccion #plan_accion").val(plan);
        $("#modalEditarPlanAccion #plazo").val(plazo);
        $("#modalEditarPlanAccion #responsable").val(responsable_id);
        //$('#selectField').val(valueFromDatabase).change();

        //mostrar modal
        $("#modalEditarPlanAccion").modal('show');
        
        
    }//end function mostrar_planAccionEditar



    function confirmarActualizarplanAccion(){
        
        //get data de modal
        var id_plan          = $('#modalEditarPlanAccion #id_plan').val();

        var plan            = $("#modalEditarPlanAccion #plan_accion").val();
        if(plan=="" || plan == null){
            swal("Ingrese el Plan de Accion", "", "warning");
            return false;
        }

        var plazo           = $("#modalEditarPlanAccion #plazo").val();
        if(plazo =="" || plazo==null){
            swal("Ingrese el Plazo del Plan de Accion !!", "", "warning");
            return false;
        }

        var responsable_id  = $("#modalEditarPlanAccion #responsable").val();
        if(responsable_id =="" || responsable_id==null){
            swal("Seleccione un responsable !!", "", "warning");
            return false;
        }

        swal({
            title: "Desea actualizar los Datos ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                
                //token
                var csrftoken = getCookie('csrftoken');

                $.ajax({
                    type: "POST",
                    url: "/updatePlan/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_plan:id_plan,
                        plan:plan,
                        plazo:plazo,
                        responsable_id:responsable_id,
                    },
                    dataType: "json",
                    success: function(data) {
                        codigo = data.resultado;
                        mensaje = data.mensaje;
                        if(codigo=="ok_update"){
                            //mensaje exitoso
                            swal(mensaje, "", "success");
                            //ocultar modal
                            $('#modalEditarPlanAccion').modal('hide');
                            //recargar pagina
                            location.reload();
                        }
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
            }else{
                return false;
            }
        });

    }//end function confirmarActualizarplanAccion


    function eliminarPlanAccion(id_plan){

        swal({
            title: "Desea eliminar el Plan de Accion ?",
            text: "Una vez eliminado el mismo no podra ser recuperado ..",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                          
                //token
                var csrftoken = getCookie('csrftoken');

                $.ajax({
                    type: "POST",
                    url: "/deletePlanAccion/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_plan:id_plan,
                    },
                    dataType: "json",
                    success: function(data) {
                        codigo = data.resultado;
                        mensaje = data.mensaje;
                        if(codigo=="ok_delete"){
                            //mensaje exitoso
                            swal(mensaje, "", "success");
                            //recargar pagina
                            location.reload();
                        }
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
            }
        });

    }//end function eliminarPlanAccion



    /**
     * 
     * FUNCION CONSULTAR SAC JEFE
     */
    function consultar_sac_jefe(id_sac){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectSacAudt/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
            },
            dataType: "json",
            success: function(data) {
                mostrarSacJefe(data);
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
        
    }//end function consultar_sac_auditor

    




    /**
     * 
     * mostrar data de sac jefe 
     */
    function mostrarSacJefe(data){

        //data retornante
        var sac_auditor     = data.sac_list;

        //asignar data al modal
        var id_sac                  = sac_auditor[0]['id'];
        var descripcion_correcion   = sac_auditor[0]['descripcion_correcion'];
        var analisis_causa          = sac_auditor[0]['analisis_causa'];

       //establecer accion
        $('#modalAnalisisCorreccion #accion').val("update");
        $('#modalAnalisisCorreccion #span_sac').html('ANALISIS DE CAUSA - SAC N°: '+id_sac);
        $('#modalAnalisisCorreccion #idSac').val(id_sac);
        CKEDITOR.instances.descripcion_correcion.setData(descripcion_correcion);
        CKEDITOR.instances.analisis_causa.setData(analisis_causa);

        //mostrar modal
        $('#modalAnalisisCorreccion').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrarSacJefe




    function confirmarGrabar(){

        swal({
            title: "Desea actualizar los Datos ?",
            //text: "Desea Editar los Datos !",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                updateSac();
            }
        });
    
    }//end function confirmarGrabar


    function updateSac(){

        var id_sac                    = $('#modalAnalisisCorreccion #idSac').val();
        var descripcion_correcion     = CKEDITOR.instances.descripcion_correcion.getData();
        var analisis_causa            = CKEDITOR.instances.analisis_causa.getData();

        //ELIMINAR ESPACIOS ENTRE TAGS -> .replace(/\s+/g, ' ')
        descripcion_correcion   = descripcion_correcion.replace(/\s+/g, ' ');

        analisis_causa          = analisis_causa.replace(/\s+/g, ' ');
        if((analisis_causa == "" || analisis_causa== null)){
            swal("Ingrese su Analisis de Causa", "", "info");
            return false;
        }

        //token
        var csrftoken           = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/updateSacJefe/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
                descripcion_correcion:descripcion_correcion,
                analisis_causa:analisis_causa,
            },
            dataType: "json",
            success: function(data) {
                
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){
                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalAnalisisCorreccion').modal('hide');
                    //recargar pagina
                    location.reload();
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
      
    }//end function updateSac


    function consultar_plan_accion(id_sac){

        $("#modalPlanAccion #idSac").val(id_sac);
        $("#modalPlanAccion #span_plan_accion").html("PLAN DE ACCION - SAC N°: "+id_sac);
        $('#modalPlanAccion').modal({'show':true, backdrop: 'static', keyboard: false});
        cargarGridLocalPlan();
    }//end function consultar_plan_accion


    function confirmarGrabarplanAccion(){

        swal({
            title: "Desea grabar los Datos ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                grabarPlanAccion();
            }
        });

    }//end function confirmarGrabarplan


    function grabarPlanAccion(){
        
        var data_grid_planAccion        = $('#grid_plan_accion').getGridParam('data');
        total_data_grid_plan_accion     = data_grid_planAccion.length;
        
        if(total_data_grid_plan_accion == 0){
            swal("Debe ingresar al menos un Plan de Accion", "", "warning");
            return false;
        }else{
            for(i=0; i<total_data_grid_plan_accion; i++){
            
                if (data_grid_planAccion[i]['detalle'] == null || data_grid_planAccion[i]['detalle'] == ""){
                    
                    swal("Ingrese un detalle para su Plan de Accion !!", "", "warning");
                    return false;
                }
                
                if(data_grid_planAccion[i]['plazo'] == null || data_grid_planAccion[i]['plazo'] == "" || data_grid_planAccion[i]['plazo'] =='&#160;'){
                   
                    swal("Ingrese un plazo para su Plan de Accion !!", "", "warning");
                    return false;
                }
                if(data_grid_planAccion[i]['responsable'] == null || data_grid_planAccion[i]['responsable'] == ""){
                    swal("Seleccione un responsable para su Plan de Accion !!", "", "warning");
                    return false;
                }
            }//end for
        }

        
        var arr_data = new Array();
        var id_sac = $("#modalPlanAccion #idSac").val();
        for(i=0; i<total_data_grid_plan_accion; i++){

            var element = {}

            element.detalle                     = data_grid_planAccion[i]['detalle'];
            element.plazo                       = data_grid_planAccion[i]['plazo'];
            element.responsable                 = data_grid_planAccion[i]['responsable'];
            element.id_sac                      = id_sac;
            //recursos
            element.recursoHumano               = data_grid_planAccion[i]['recursoHumano'];
            element.recursoTecnico              = data_grid_planAccion[i]['recursoTecnico'];
            element.recursoFinanciero           = data_grid_planAccion[i]['recursoFinanciero'];
            element.detalleRecursoHumano        = data_grid_planAccion[i]['detalleRecursoHumano'];
            element.detalleRecursoTecnico       = data_grid_planAccion[i]['detalleRecursoTecnico'];
            element.detalleRecursoFinanciero    = data_grid_planAccion[i]['detalleRecursoFinanciero'];

            arr_data.push(element);

        }//end for
        var data = {
            gridData: arr_data,
        }
        data = JSON.stringify(data); 


        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/insertPlanAccion/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                data:data,
                id_sac : id_sac
            },
            dataType: "json",
            success: function(data) {
                codigo = data.resultado;
                mensaje = data.mensaje;
                if(codigo == "ok_insert"){

                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalPlanAccion').modal('hide');
                    //recargar pagina
                    location.reload();
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


    }//end function grabarPlanAccion


    function cargarGridLocalPlan(){

       var mydata=[];
       var csrftoken = getCookie('csrftoken');
        $("#grid_plan_accion").jqGrid({
            datatype: 'local',
            colNames: ['Detalle', 'Plazo', 'responsableId','Responsable', 'recursoHumano', 'recursoTecnico', 'recursoFinanciero','Humano', 'Tecnico', 'Financiero','Eliminar'],
            colModel: [
                    { label: 'detalle', name: 'detalle', width: 20, sorttype: "string", align:'center', formatter:function(cellValue, opts, rowObject){
                        detalle = "'"+encode(rowObject.detalle)+"'";
                        return '<a href="javascript:void(0)" onclick="swal('+detalle+')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }},
                    { label: 'plazo', name: 'plazo', width: 20, sorttype: "string", align:'center'},
                    {name:'responsable', width:30, sorttype: "integer", hidden:true},
                    {name:'nombreResponsable', width:30, sorttype: "string", align:'center'},
                    {name:'recursoHumano', width:10, sorttype: "integer", hidden:true},
                    {name:'recursoTecnico', width:10, sorttype: "integer", hidden:true},
                    {name:'recursoFinanciero', width:40, sorttype: "integer", hidden:true},
                    {name:'detalleRecursoHumano', width:15, sorttype: "string", align:'center', formatter:function(cellValue, opts, rowObject){
                        if (rowObject.detalleRecursoHumano){
                            detalleRecursoHumano = "'"+encode(rowObject.detalleRecursoHumano)+"'";
                            return '<a href="javascript:void(0)" onclick="swal('+detalleRecursoHumano+')"><i class="fa fa-envelope"></i> Abrir</a>';
                        }else{
                            return "";
                        }

                    }},
                    {name:'detalleRecursoTecnico', width:15, sorttype: "string", align:'center', formatter:function(cellValue, opts, rowObject){
                        if(rowObject.detalleRecursoTecnico){
                            detalleRecursoTecnico = "'"+encode(rowObject.detalleRecursoTecnico)+"'";
                            return '<a href="javascript:void(0)" onclick="swal('+detalleRecursoTecnico+')"><i class="fa fa-envelope"></i> Abrir</a>';
                        }else{
                            return "";
                        }
                    }},
                    {name:'detalleRecursoFinanciero', width:15, sorttype: "string", align:'center', formatter:function(cellValue, opts, rowObject){
                        if(rowObject.detalleRecursoFinanciero){
                            detalleRecursoFinanciero = "'"+encode(rowObject.detalleRecursoFinanciero)+"'";
                            return '<a href="javascript:void(0)" onclick="swal('+detalleRecursoFinanciero+')"><i class="fa fa-envelope"></i> Abrir</a>';
                        }else{
                            return "";
                        }
                    }},
                    { name: "Acciones", formatter: buttonEliminarFormatter, width: 20, align:'center', search: false,
                        sortable: false, hidedlg: true, resizable: false, editable: false, viewable: false
                    }
            ],
            rowNum: 10,
            width:800,
            height: '100%',
            data:mydata,
            caption:'PLAN DE ACCIÓN',
            shrinkToFit: true,
            pager: '#pager_plan_accion',
            cellEdit: false,
            cellsubmit: 'clientArray',
            editurl: "clientArray",
        });

        jQuery("#grid_plan_accion").jqGrid('setGroupHeaders', {
          useColSpanStyle: true,
          groupHeaders:[
            {startColumnName: 'detalleRecursoHumano', numberOfColumns: 3, titleText: '<span class="badge bg-green">Recursos</span>'},
            ]
        });


    }//end function cargarGridLocalPlan

    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

 /*
    function cargarGridLocalPlan(){

       var fecha_actual = datenow(); //fecha actual client-side
       var mydata=[];
       var csrftoken = getCookie('csrftoken');
        $("#grid_plan_accion").jqGrid({
            datatype: 'local',
            colNames: ['DETALLE', 'PLAZO', 'RESPONSABLE', '<span class="badge bg-green">ACCIONES</span>'],
            colModel: [
                    { label: 'detalle', name: 'detalle', width: 170, sorttype: "string", editable: true, edittype:"text"},
                    { label: 'plazo', name: 'plazo', width: 40, sorttype: "string", editable: true, edittype: 'text',
                        editoptions: {
                            defaultValue:fecha_actual
                        },
                        formatter: 'date', formatoptions: { 
                            srcformat: 'Y-m-d', 
                            newformat: 'Y-m-d'
                        },
                    },
                    //{name:'responsable_plan_accion_id',index:'responsable_plan_accion_id', width:100, editable:true, edittype: "select", formatter:'select',editoptions: { value: combobox_personal} }, 
                    { label: 'responsable', name: 'responsable', width: 60, sorttype: "string", editable: true, 
                        edittype: "select",
                        formatter: "select",
                        editoptions:{
                            dataUrl : "/listadoPersonal",
                            cacheUrlData: true, //usa la cache para almacenar la data retornada
                            buildSelect : function( data) {
                                
                                //convertir cadena de texto a JSON
                                var newData = JSON.parse(data);
                                //armando el select
                                var select = '<select>';
                                for(i=0; i<newData.length; i++){
                                    select = select + '<option value="'+newData[i]['id']+'">'+newData[i]['nombre']+'</option>';
                                }
                                select = select+'</select>';

                                return select;
                            }//end builtSelect
                        }//end editOptions
                    },
                    { name: "Acciones", formatter: buttonEliminarFormatter, width: 90, align:'center', search: false, 
                        sortable: false, hidedlg: true, resizable: false, editable: false, viewable: false
                    }
            ],
            rowNum: 10,
            width:800,
            height: 200,
            data:mydata,
            caption:'PLAN DE ACCION',
            shrinkToFit: true,
            pager: '#pager_plan_accion',
            cellEdit: false,
            cellsubmit: 'clientArray',
            editurl: "clientArray",
        });

    }//end function cargarGridLocalPlan
  */


    /**
     * PERMITE CREAR UNA NUEVA FILA
     * 
     */
    function agregarFila(){
        //$("#grid_plan_accion").jqGrid('addRow',"new");
        planAccion = $("#modalPlanAccion #planAccion").val();
        if(planAccion == '' || planAccion == null){
            swal('Ingrese el Plan de Accion.');
            return false;
        }
        plazo = $("#modalPlanAccion #plazo").val();
        if(plazo == '' || plazo == null){
            swal('Ingrese el Plazo.');
            return false;
        }
        responsable = $("#modalPlanAccion #responsable").val();
        nombreResponsable = $("#modalPlanAccion #responsable option:selected").text();

        if(responsable == '' || responsable == null){
            swal('Seleccione el Responsable.');
            return false;
        }
        if ($("#modalPlanAccion #recursoHumano").prop("checked")) {
            recursoHumano = 1;
            detalleRecursoHumano = $("#modalPlanAccion #detalleRecursoHumano").val();
            if(detalleRecursoHumano == '' || detalleRecursoHumano == null){
                swal('Ingrese el Recurso Humano.');
                return false;
            }
        }else{
            recursoHumano = 0;
            detalleRecursoHumano = null;
        }

        if ($("#modalPlanAccion #recursoTecnico").prop("checked")) {
            recursoTecnico = 1;
            detalleRecursoTecnico = $("#modalPlanAccion #detalleRecursoTecnico").val();
            if(detalleRecursoTecnico == '' || detalleRecursoTecnico == null){
                swal('Ingrese el Recurso Tecnico.');
                return false;
            }
        }else{
            recursoTecnico = 0;
            detalleRecursoTecnico = null;
        }

        if ($("#modalPlanAccion #recursoFinanciero").prop("checked")) {
            recursoFinanciero = 1;
            detalleRecursoFinanciero = $("#modalPlanAccion #detalleRecursoFinanciero").val();
            if(detalleRecursoFinanciero == '' || detalleRecursoFinanciero == null){
                swal('Ingrese el Recurso Financiero.');
                return false;
            }
        }else{
            recursoFinanciero = 0;
            detalleRecursoFinanciero = null;
        }

        parameters = {
            rowid: 'new_row',
            initdata:{
                detalle:planAccion,
                plazo:plazo,
                responsable:responsable,
                nombreResponsable:nombreResponsable,
                recursoHumano:recursoHumano,
                recursoTecnico:recursoTecnico,
                recursoFinanciero:recursoFinanciero,
                detalleRecursoHumano:detalleRecursoHumano,
                detalleRecursoTecnico:detalleRecursoTecnico,
                detalleRecursoFinanciero:detalleRecursoFinanciero,
                Acciones:''
            },
            position: "last",
            edit: false
        }
        $("#grid_plan_accion").jqGrid('addRow', parameters);

        resetParameterLocales();
    }//end function agregarFila


    function resetParameterLocales(){
        $("#modalPlanAccion #planAccion").val(null);
        $("#modalPlanAccion #plazo").val(null);
        $("#modalPlanAccion #responsable").val($("#modalPlanAccion #responsable option:first").val());
        $("#modalPlanAccion #recursoHumano").prop("checked", false);
        $("#div_humano").hide();
        $("#modalPlanAccion #detalleRecursoHumano").val(null)
        $("#modalPlanAccion #recursoTecnico").prop("checked", false);
        $("#div_tecnico").hide();
        $("#modalPlanAccion #detalleRecursoTecnico").val(null)
        $("#modalPlanAccion #recursoFinanciero").prop("checked", false);
        $("#div_financiero").hide();
        $("#modalPlanAccion #detalleRecursoFinanciero").val(null)
    }//end function resetParameterLocales


    /**
     * PERMITE RETORNAR LOS BOTONES
     * 
     */
    function buttonEliminarFormatter() {

        //new_format_value='<button type="button" class="btn btn-primary btn-xs" onClick="editRow.call(this)"><i class="fa fa-pencil"></i> Editar</button>';
        //new_format_value = new_format_value+ '&nbsp;<button type="button" class="btn btn-success btn-xs" onClick="saveRow.call(this)"><i class="fa fa-check-square-o"></i> Guardar</button>';
        new_format_value = '<button type="button" class="btn btn-danger btn-xs" onClick="deleteRow.call(this)"><i class="fa fa-close"></i> Eliminar</button>';

        return new_format_value

    }//end function buttonFormatter
    


    /**
     * EDITAR LA FILA 
     * 
     */
    function editRow(){

        //id de la fila
        rowid = $(this).closest("tr.jqgrow").attr("id")
        //editar row
        jQuery("#grid_plan_accion").jqGrid('editRow',rowid);

    }//end function editRow



    /**
     * ELIMINAR LA FILA
     * 
     */
    function deleteRow() {

        //id de la fila
        rowid = $(this).closest("tr.jqgrow").attr("id");
        //eliminar row
        $('#grid_plan_accion').jqGrid('delRowData',rowid);

    }//end function deleteRow


    /**
     *  PERMITE GRABAR/GUARDAR LOS DATOS
     */
    function saveRow(){

        //id de la fila
        rowid = $(this).closest("tr.jqgrow").attr("id");

        //grabar row
        $('#grid_plan_accion').jqGrid('saveRow',rowid);
        
    }//end function saveRow


    function cargarModalSac(){
        
        //limpiar formulario
        document.getElementById('form_sac').reset();

        //mostrar modal
        $('#modalSac').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end funcion cargarModalNorma


    //validaciones recursos
    $("#modalPlanAccion #recursoHumano").click(function(){
        if ($('#modalPlanAccion #recursoHumano').is(':checked')) {
            $("#div_humano").show();
        }else{
            $("#detalleRecursoHumano").val(null);
            $("#div_humano").hide();
        }

    });

    $("#modalPlanAccion #recursoTecnico").click(function(){
        if ($('#modalPlanAccion #recursoTecnico').is(':checked')) {
            $("#div_tecnico").show();
        }else{
            $("#detalleRecursoTecnico").val(null);
            $("#div_tecnico").hide();
        }
    });

    $("#modalPlanAccion #recursoFinanciero").click(function(){
        if ($('#modalPlanAccion #recursoFinanciero').is(':checked')) {
            $("#div_financiero").show();
        }else{
            $("#detalleRecursoFinanciero").val(null);
            $("#div_financiero").hide();
        }
    });


    function consultarDetallePlanAccion(id_plan){

       

    }//end function consultarDetallePlanAccion