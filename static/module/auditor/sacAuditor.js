    
    //INSTANCIAMOS EL CKEDITOR DE CLAUSUAL
    CKEDITOR.replace('sacAuditor');
    //ESTABLECE FOCUS POPUP CKEDITOR
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        modal_this = this
        $(document).on('focusin.modal', function (e) {
            if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
            // add whatever conditions you need here:
            &&
            !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                modal_this.$element.focus()
            }
        })
    };


    //autocargar funcion
    window.onload = gridSacAuditor;


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

    function gridSacAuditor(){
        
        //token
        var csrftoken = getCookie('csrftoken');

        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridSacAuditor").jqGrid({
            url:'/gridSacAuditor/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            //data: mydata,
            loadonce: true, 
            viewrecords: true,
            width: 1100,
            height: 300,
            rowNum:10,
            colNames:['SAC N°', 'SAC VIN.', 'AUDIT.', 'LUGAR','PROCESO',  'PROCEDIMIENTO', 'CRITICIDAD', 'HALLAZG0', 'ANÁLISIS', 'CORREC.', 'ESTADO', 'OBSERVACION', 'ACCIÓN'],
            colModel: [
                { label: 'id', name: 'id', width: 21, key:true, sorttype:"integer", align:'center'},
                { label: 'sac_id', name: 'sac_id', width: 21, sorttype:"integer", align:'center'},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 25, sorttype:"integer", align:'center'},
                { label: 'lugar', name: 'lugar', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'proceso', name: 'proceso', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'procedimiento', name: 'procedimiento', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'criticidad', name: 'criticidad', width: 28, sorttype:"string", align:'center'},
                { label: 'descripcion_hallazgo', name: 'descripcion_hallazgo', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterHallazgo},
                { label: 'analisis_causa', name: 'analisis_causa', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterAnalisis},
                { label: 'descripcion_correcion', name: 'descripcion_correcion', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterCorrecion},
                { label: 'estado_cabecera', name: 'estado_cabecera', width: 40, sorttype:"integer", align:'center', formatter:gridSac_FormatterEstadoCabecera},
                { label: 'observacion_cabecera', name: 'observacion_cabecera', width:40, sorttype:"integer", align:'center', formatter:gridSac_FormatterObservacionCabecera},
                { name: 'btn_editar', width: 45, sorttype:"integer", align:'center', formatter:gridSac_FormatterEditar},
            ],
            pager: '#pagerSacAuditor',
            rownumbers: true,
            caption: "SACS",
            shrinkToFit: true,
            gridview: true,
            rowattr: function (rd) {
              if (rd.numero_auditoria === null) { // verify that the testing is correct in your case
                  return {"class": "myAltRowClass"};
              }
            },
            //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
            ondblClickRow: function (rowid,iRow,iCol,e) {
            
            },
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    emptyMsgDiv.show();
                    //desabilitarReportes();
                }else{
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
                    colNames:['ID', 'PLAN ACCIÓN', 'PLAZO', 'RESPONSABLE', 'DET. ACCIÓN','FEC. SEG.', 'RESP. SEGUIMIENTO', 'DET. SEG', 'EST. SEG.', 'EST. APROB', 'OBS. APROB', 'EST. CIERRE','sac_id'],
                    colModel: [
                        { name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true, key:true},
                        { name: 'detalle_plan_accion', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterPlan},
                        { name: 'plazo_plan_accion', width: 15, sorttype:"string", align:'center'},
                        { name: 'responsable_accion', width: 20, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                        { name: 'justificacion_plan', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterDetalleAccion},
                        { name: 'fecha_seguimiento', width: 15, sorttype:"string", align:'center'},
                        { name: 'responsable_seguimiento', width: 25, sorttype:"string", align:'center'},
                        { name: 'detalle_seguimiento', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterDetalleSeguimiento},
                        { name: 'estado_seguimiento', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoSeguimiento},
                        { name: 'estado_aprobacion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoPlan},
                        { name: 'observaciones_aprobacion', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObservacionPlan},
                        { name: 'estado_cierre_accion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoCierre},
                        { name: 'sac_id', width: 25, sorttype:"string", align:'center', hidden:true},
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
                $("#" + childGridID).setGroupHeaders({
                useColSpanStyle: true,
                groupHeaders: [
                    { "numberOfColumns": 5, "titleText": "<span class='badge bg-green'>RESPONSABLE PLAN ACCIÓN</span>", "startColumnName": "id" },
                    { "numberOfColumns": 4, "titleText": "<span class='badge bg-green'>RESPONSABLE SEGUIMIENTO</span>", "startColumnName": "fecha_seguimiento" },
                    { "numberOfColumns": 5, "titleText": "<span class='badge bg-green'>ESTADO</span>", "startColumnName": "estado_seguimiento" },
                   ] //
                });

                /** INICIO FORMATTER SUBGRID */

                function gridPlanAccion_FormatterPlan(cellvalue, options, rowObject){
                    detalle_plan_accion = rowObject.detalle_plan_accion;
                    if(detalle_plan_accion){
                        new_formatter_value ='<a href="javascript:void(0)" onclick="mi_funcion(\''+detalle_plan_accion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value =""
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterPlan


                function gridPlanAccion_FormatterDetalleAccion(cellvalue, options, rowObject){
                    justificacion_plan=  encode(rowObject.justificacion_plan);
                    if(justificacion_plan){
                        new_format_DetalleAccion ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+justificacion_plan+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_format_DetalleAccion = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    return new_format_DetalleAccion;
                }//end function gridPlanAccion_FormatterDetalleAccion


                function gridPlanAccion_FormatterDetalleSeguimiento(cellvalue, options, rowObject){
                    detalle_seguimiento = encode(rowObject.detalle_seguimiento);
                    if(detalle_seguimiento){
                        //new_formatter_value='<a href="javascript:void(0)" onclick="mi_funcion(\''+detalle_seguimiento+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                        new_formatter_value ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+detalle_seguimiento+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value ='<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>'
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterDetalleSeguimiento


                function gridPlanAccion_FormatterEstadoSeguimiento(cellvalue, options, rowObject){

                    if(rowObject.estado_seguimiento == '0'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    if(rowObject.estado_seguimiento == '1'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-check" style="color:green"> Designado</i>';
                    }
                    if(rowObject.estado_seguimiento == '2'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-clock-o" style="color:orange"> Por Aprobar</i>';
                    }
                    if(rowObject.estado_seguimiento == '3'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-check" style="color:green">Aprobado</i>';
                    }
                    if(rowObject.estado_seguimiento == '4'){
                        new_format_value_estadoSeguimiento ='<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
                    }
                    return new_format_value_estadoSeguimiento;
                }//end function gridPlanAccion_FormatterEstadoSeguimiento

                function grabarPlanAccion_FormatterBtnEditar(cellvalue, options, rowObject){
                    new_formatter_btnEditar='<a href="javascript:void(0)" onclick="consultarPlanAccion(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange"></i></a>';
                    return new_formatter_btnEditar;
                }
                function grabarPlanAccion_FormatterBtnEliminar(cellvalue, options, rowObject){
                    new_formatter_btnEliminar='<a href="javascript:void(0)" onclick="eliminarPlanAccion(\''+rowObject.id+'\');"><i class="fa fa-close" style="color:red"></i></a>';
                    return new_formatter_btnEliminar;
                }


                function gridPlanAccion_FormatterEstadoPlan(cellvalue, options, rowObject){
                    if(rowObject.estado_aprobacion ==1){
                        new_formatter_estadoAprobacion='<i class="fa fa-check" style="color:green"> Aprobado</i>';
                    }else if(rowObject.estado_aprobacion ==0){
                        new_formatter_estadoAprobacion='<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
                    }else{
                        new_formatter_estadoAprobacion='<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    return new_formatter_estadoAprobacion;
                }//end function gridPlanAccion_FormatterEstadoPlan


                function gridPlanAccion_FormatterObservacionPlan(cellvalue, options, rowObject){
                    if(rowObject.observaciones_aprobacion){
                        new_formatter_observacionAprobacion='<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observaciones_aprobacion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_observacionAprobacion = '';
                    }
                    return new_formatter_observacionAprobacion;
                }//end function gridPlanAccion_FormatterObservacionPlan


                function gridPlanAccion_FormatterEstadoCierre(cellvalue, options, rowObject){
                    if(rowObject.estado_cierre_accion=='1'){
                        new_formatter_estadoCierre='<i class="fa fa-check" style="color:green">Imp. y Efectiva</i>';
                    }else if(rowObject.estado_cierre_accion=='2'){
                        new_formatter_estadoCierre='<i class="fa fa-info-circle" style="color:orange">Imp. y No Efect.</i>';
                    }else if(rowObject.estado_cierre_accion=='3'){
                        new_formatter_estadoCierre='<i class="fa fa-info-circle" style="color:red">No Implement.</i>';
                    }else{
                        new_formatter_estadoCierre='<i class="fa fa-clock-o" style="color:orange">Pendiente</i>';
                    }
                    return new_formatter_estadoCierre;
                }//end function gridPlanAccion_FormatterEstadoCierre
                /** FIN FORMATTER SUBGRID */
            }
            /** FIN SUBGRID */  
                
        });

        $('#gridSacAuditor').setGroupHeaders({
        useColSpanStyle: true,
        groupHeaders: [
            { "numberOfColumns": 8, "titleText": "<span class='badge bg-green'>AUDITOR</span>", "startColumnName": "id" },
            { "numberOfColumns": 2, "titleText": "<span class='badge bg-green'>DIRECTOR</span>", "startColumnName": "analisis_causa" },
            { "numberOfColumns": 3, "titleText": "<span class='badge bg-green'>ACCIONES</span>", "startColumnName": "estado_cabecera" }]
            //
        });
        function gridSac_FormatterHallazgo(cellvalue, options, rowObject)
        {	
            var hallazgo = rowObject.descripcion_hallazgo;

            if(hallazgo){
                var tag         = document.createElement('div');
                tag.innerHTML   = hallazgo;
                nuevo_valor     = tag.innerText;
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
                var tag         = document.createElement('div');
                tag.innerHTML   = analisis_causa;
                nuevo_valor     = tag.innerText;
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
                var tag         = document.createElement('div');
                tag.innerHTML   = descripcion_correcion;
                nuevo_valor     = tag.innerText;
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }
            
            return new_formatter_value;

        }//end function gridSac_FormatterHallazgo


        function gridSac_FormatterEstadoCabecera(cellvalue, options, rowObject){

            estado_cabecera = rowObject.estado_cabecera;
            if(estado_cabecera == 0 ){

                new_formatter_observacionCabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</i>';

            }//end if
            if(estado_cabecera == 1){
                new_formatter_observacionCabecera = '<i class="fa fa-check" style="color:green"> Aprobado</i>';
            }
            if(estado_cabecera == 2){

                new_formatter_observacionCabecera = '<i class="fa fa-commenting-o" style="color:red">Observaciones </i>';

            }//end if
            if(estado_cabecera == 3){

                new_formatter_observacionCabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</i>';

            }//end if
            if(estado_cabecera == 4){

                new_formatter_observacionCabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</i>';

            }//end if
            if(estado_cabecera == 5){

                new_formatter_observacionCabecera = '<i class="fa fa-check" style="color:green">Aprobado</i>';

            }//end if

            return new_formatter_observacionCabecera;

        }//end function gridSac_FormatterEstadoCabecera


        function gridSac_FormatterObservacionCabecera(cellvalue, options, rowObject){

            if(rowObject.estado_cabecera ==2  ){
                new_formatter_value='<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_cabecera+'\')"><i class="fa fa-envelope"></i> Abrir</a>';

            }else{
                new_formatter_value='';
            }
            return new_formatter_value;

        }//end function gridSac_FormatterObservacionCabecera

        function gridSac_FormatterEditar(cellvalue, options, rowObject){

            if(rowObject.estado_cabecera==1 || rowObject.estado_cabecera==0){
                new_formatter_editar='<i class="fa fa-clock-o" style="color:orange"> En Revision</i> ';
            }
            if(rowObject.estado_cabecera==2 ){
            new_formatter_editar='<a href="javascript:void(0)" onclick="consultar_sac_auditor(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange"> Editar</i></a>';
            }
            if(rowObject.estado_cabecera==3){
                new_formatter_editar='<i class="fa fa-clock-o" style="color:orange"> En Revision</i> ';
            }
            if(rowObject.estado_cabecera==4 ||rowObject.estado_cabecera==5 ){
                new_formatter_editar='<i class="fa fa-check" style="color:green"> Apobado</i> ';
            }
             //
            return new_formatter_editar

        }//endfunction gridSac_FormatterEditar

        
    }//end function gridSacs


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


    function consultar_sac_auditor(id_sac){


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
                mostrarSacAuditor(data);
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


    function mostrarSacAuditor(data){

        var sac_auditor = data.sac_list;
        var sac_jefe    = data.detalle_jefe_list;

        //data retornante
        var sac_anterior            = sac_auditor[0]['sac_id'];
        var id_sac                  = sac_auditor[0]['id'];
        var numero_auditoria        = sac_auditor[0]['numero_auditoria'];
        var area                    = sac_auditor[0]['area'];
        var procedimiento           = sac_auditor[0]['procedimiento_id'];
        var jefe_area               = sac_auditor[0]['responsable_id'];
        var tipo_solicitud          = sac_auditor[0]['tipo_solicitud'];
        var fecha_solicitud         = sac_auditor[0]['fecha_solicitud'];
        var criticidad              = sac_auditor[0]['criticidad'];
        var responsable             = sac_auditor[0]['responsable_id'];
        var solicitante             = sac_auditor[0]['solicitante_id'];
        var descripcion_hallazgo    = sac_auditor[0]['descripcion_hallazgo'];
        

        //establecer data modal
        $('#modalSac #accion').val("update");
        $('#modalSac #idSac').val(id_sac);
        setProceso(numero_auditoria);
        $('#modalSac #area').val(area);
        $('#modalSac #sacAnterior').val(sac_anterior);
        $('#modalSac #numero_auditoria').val(numero_auditoria);
        $('#modalSac #numero_auditoria').attr('disabled', '');
        
        $('#modalSac #jefe_area').val(jefe_area);
        /* INICIO COMBOBOX PROCEDIMIENTOS */
            //token
            var csrftoken = getCookie('csrftoken');

            $.ajax({
                type: "POST",
                url: "/getProcedimientos/",
                data:{
                    csrfmiddlewaretoken : csrftoken, 
                    numero_auditoria:numero_auditoria,
                    area:area,
                },
                dataType: "json",
                success: function(data) {

                    procedimientos = data.procedimientos;
                    
                    //armado el combobox procedimientos
                    for(i=0; i<procedimientos.length; i++){
                        $('#modalSac #procedimiento').append($('<option>', {
                            value: procedimientos[i]['id'],
                            text: procedimientos[i]['procedimiento']
                        }));
                    }//end for
                    $('#modalSac #procedimiento').val(procedimiento);
                    
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
        /* FIN COMBOBOX PROCEDIMIENTOS */
        $('#modalSac #tipo_solicitud').val(tipo_solicitud);
        $('#modalSac #fecha_solicitud').val(fecha_solicitud);
        $('#modalSac #criticidad').val(criticidad);
        $('#modalSac #responsable').val(responsable);
        $('#modalSac #solicitante').val(solicitante);

        CKEDITOR.instances['sacAuditor'].setData(descripcion_hallazgo);
        //mostrar modal
        $('#modalSac').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end function  mostrarSacAuditor




    /*********************************************/
    /**FUNCION cargar modal clausula **************/
    /*********************************************/

    function cargarModalSac(){
   

        //mostrar modal
        $('#modalSac').modal({'show':true, backdrop: 'static', keyboard: false});

        //ocultar observaciones 
        $("#div_observacion").hide();
        $('#modalSac #accion').val("insert");
        document.getElementById("numero_auditoria").removeAttribute("disabled");
        //limpiar formulario
        document.getElementById('formSac').reset();
        $('#area').find('option').not(':first').remove();
        $('#procedimiento').find('option').not(':first').remove();
        CKEDITOR.instances['sacAuditor'].setData("");
        //establecer solicitante
       
 
    }//end funcion cargarModalNorma


    function setProceso(numero_auditoria){

        
        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/setProceso/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                numero_auditoria:numero_auditoria,
            },
            dataType: "json",
            success: function(data) {
                //$('#area').find('option').remove();
                $('#area').find('option').not(':first').remove();
                for(i=0; i<data.length; i++){
                    $('#area').append($('<option>', {
                        value: data[i]['id'],
                        text: data[i]['proceso']
                    }));
                }//end for
                //$("#area").trigger("change");
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
    }//end function setProceso


    function setJefeArea(id_area){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/setJefeArea/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_area:id_area,
                numero_auditoria:$("#modalSac #numero_auditoria").val(),
            },
            dataType: "json",
            success: function(data) {
                jefe = data.jefe;
                procedimientos = data.procedimientos;
                id_jefe_area = jefe[0]['id_personal_id'];
                $('#modalSac #jefe_area').val(id_jefe_area);
                //cargar procedimientos
                for(i=0; i<procedimientos.length; i++){
                    $('#modalSac #procedimiento').append($('<option>', {
                        value: procedimientos[i]['id'],
                        text: procedimientos[i]['procedimiento']
                    }));
                }//endfor

                //set responsable
                $("#modalSac #responsable").val(id_jefe_area);
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
    }//end function setJefeArea





    function confirmarGrabar(){

        var accion = $('#modalSac #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertSac();
                }
            });
        }else{
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
        }//end if

        
    }//end function confirmarGrabar




    function insertSac(){

        //token
        var csrftoken           = getCookie('csrftoken');

        //data
        var sac_anterior        = $("#modalSac #sacAnterior").val();
        var numero_auditoria    = $("#modalSac #numero_auditoria").val();
        if (numero_auditoria =="" || numero_auditoria== null ){
            swal("Seleccione la Auditoria !!", "", "info");
            return false;
        }//end if

        var area    = $("#modalSac #area").val();
        if (area =="" || area== null ){
            swal("Seleccione un Area !!", "", "info");
            return false;
        }//end if

        var jefe_area       = $("#modalSac #jefe_area").val();
        if (jefe_area =="" || jefe_area== null ){
            swal("Seleccione Jefe de Area!!", "", "info");
            return false;
        }//end if

        var procedimiento = $("#modalSac #procedimiento").val();
        if (procedimiento =="" || procedimiento== null ){
            swal("Seleccione un Procedimiento !!", "", "info");
            return false;
        }//end if

        var tipo_solicitud  = $("#modalSac #tipo_solicitud").val();
        if (tipo_solicitud =="" || tipo_solicitud== null ){
            swal("Seleccione Tipo de Solicitud !!", "", "info");
            return false;
        }//end if

        var fecha_solicitud  = $("#modalSac #fecha_solicitud").val();
        if (fecha_solicitud =="" || fecha_solicitud== null ){
            swal("Seleccione Fecha de Solicitud !!", "", "info");
            return false;
        }//end if

        var criticidad  = $("#modalSac #criticidad").val();
        if (criticidad =="" || criticidad== null ){
            swal("Ingrese la Criticidad !!", "", "info");
            return false;
        }//end if

        var responsable  = $("#modalSac #responsable").val();
        if (responsable =="" || responsable== null ){
            swal("Seleccione un Responsable !!", "", "info");
            return false;
        }//end if

        var solicitante  = $("#modalSac #solicitante").val();
        if (solicitante =="" || solicitante== null ){
            swal("Seleccione el Solicitante !!", "", "info");
            return false;
        }//end if

        var descripcion_hallazgo      = CKEDITOR.instances.sacAuditor.getData();
        if (descripcion_hallazgo =="" || descripcion_hallazgo == null ){
            swal("Describa el hallazgo !", "", "info");
            return false;
        }//end if

        //ELIMINAR ESPACIOS ENTRE TAGS 
        descripcion_hallazgo = descripcion_hallazgo.replace(/\s+/g, ' ');
        

        $.ajax({
            type: "POST",
            url: "/insertSacAuditor/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                sac_anterior:sac_anterior,
                numero_auditoria:numero_auditoria,
                area:area,
                jefe_area:jefe_area,
                procedimiento:procedimiento,
                tipo_solicitud:tipo_solicitud,
                fecha_solicitud:fecha_solicitud,
                criticidad:criticidad,
                responsable:responsable,
                solicitante:solicitante,
                descripcion_hallazgo:descripcion_hallazgo,
            },
            dataType: "json",
            success: function(data) {
                
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalSac').modal('hide');
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

    }//end function insertSac




    function updateSac(){

        var id_sac              = $("#modalSac #idSac").val();
        var sac_anterior        = $("#modalSac #sacAnterior").val();
        var numero_auditoria    = $("#modalSac #numero_auditoria").val();
        if (numero_auditoria =="" || numero_auditoria== null ){
            swal("Seleccione la Auditoria !!", "", "info");
            return false;
        }//end if

        var area           = $("#modalSac #area").val();
        if (area =="" || area== null ){
            swal("Seleccione el Area !! ", "", "info");
            return false;
        }//end if

        var jefe_area           = $("#modalSac #jefe_area").val();
        if (jefe_area =="" || jefe_area== null ){
            swal("Seleccione el Jefe de Area !! ", "", "info");
            return false;
        }//end if

        var procedimiento = $("#modalSac #procedimiento").val();
        if (procedimiento =="" || procedimiento== null ){
            swal("Seleccione un Procedimiento !!", "", "info");
            return false;
        }//end if

        var tipo_solicitud           = $("#modalSac #tipo_solicitud").val();
        if (tipo_solicitud =="" || tipo_solicitud== null ){
            swal("Seleccione el Tipo !! ", "", "info");
            return false;
        }//end if

        var fecha_solicitud           = $("#modalSac #fecha_solicitud").val();
        if (fecha_solicitud =="" || fecha_solicitud== null ){
            swal("Seleccione Fecha !! ", "", "info");
            return false;
        }//end if

        var criticidad           = $("#modalSac #criticidad").val();
        if (criticidad =="" || criticidad== null ){
            swal("Ingrese la Criticidad !! ", "", "info");
            return false;
        }//end if


        var responsable           = $("#modalSac #responsable").val();
        if (responsable =="" || responsable== null ){
            swal("Seleccione un responsable !! ", "", "info");
            return false;
        }//end if

        var solicitante           = $("#modalSac #solicitante").val();
        if (solicitante =="" || solicitante== null ){
            swal("Seleccione Solicitante !! ", "", "info");
            return false;
        }//end if


        var encabezado          = CKEDITOR.instances.sacAuditor.getData();
        if (encabezado =="" || encabezado== null ){
            swal("Describa su Auditoria !", "", "info");
            return false;
        }//end if

        //ELIMINAR ESPACIOS ENTRE TAGS 
        encabezado = encabezado.replace(/\s+/g, ' ');



        //token
        var csrftoken           = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/updateSacAuditor/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
                sac_anterior:sac_anterior,
                numero_auditoria:numero_auditoria,
                area:area,
                jefe_area:jefe_area,
                procedimiento:procedimiento,
                tipo_solicitud:tipo_solicitud,
                fecha_solicitud:fecha_solicitud,
                criticidad:criticidad,
                responsable:responsable,
                solicitante:solicitante,
                encabezado:encabezado,
            },
            dataType: "json",
            success: function(data) {
                
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalSac').modal('hide');
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



    function cargarModalPDFSac(){
        
        //limpiar formulario
        document.getElementById('form_sac').reset();

        //mostrar modal
        $('#modalSacPDF').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end funcion cargarModalNorma


    //validar  fecha del calendario
    function validar_fecha() {

        //input validado
        var input = document.getElementById("fecha_solicitud");

        var today = new Date();
        // Set month and day to string to add leading 0
        var day = new String(today.getDate());
        var mon = new String(today.getMonth()+1); //January is 0!
        var yr = today.getFullYear();

          if(day.length < 2) { day = "0" + day; }
          if(mon.length < 2) { mon = "0" + mon; }

          var date = new String( yr + '-' + mon + '-' + day );

        input.disabled = false;
        input.setAttribute('min', date);

    }//end function validar_fecha