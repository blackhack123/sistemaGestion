    


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
    window.onload = gridSacs;



    /**
     * EVITAR GENERAR REPORTES EN CASO 
     * NO EXISTIRDATA 
     */
    function desabilitarReportes(){

        $("#excel").attr("href", "javascript:void(0)");
        $("#excel").attr("disabled", "disabled");
        $("#excel").click( function() {
            
            swal("No se puede Generar Reporte", "No existen datos !", "info");
            return false;
        });
       

        $("#pdf").attr("href", "javascript:void(0)");
        $("#pdf").attr("disabled", "disabled");
        $("#pdf").click( function() {
            $("#modalNumeroAuditoria").modal('hide');
            swal("No se puede Generar Reporte", "No existen datos !", "info");
            return false;
        });

    }//end function desabilitarReportes

    function gridSacs(){

        //token
        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen SACS !!</span></div>");
        $("#gridSacs").jqGrid({
            url:'/gridSacAdmin/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 1100,
            height: 300,
            rowNum:100,
            colNames:['SAC N°', 'SAC VINC.','AUDIT.', 'LUGAR','PROCESO', 'PROCEDIMIENTO', 'CRIT.', 'HALLAZG0', 'ANÁLISIS', 'CORRECCIÓN', 'ESTADO', 'OBSERVACIÓN'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", align:'center'},
                { label: 'sac_id', name: 'sac_id', width: 25, sorttype:"integer", align:'center'},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 20, sorttype:"integer", align:'center'},
                { label: 'lugar', name: 'lugar', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'procedimiento', name: 'procedimiento', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'criticidad', name: 'criticidad', width: 30, sorttype:"string", align:'center'},
                { label: 'descripcion_hallazgo', name: 'descripcion_hallazgo', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterHallazgo},
                { label: 'analisis_causa', name: 'analisis_causa', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterAnalisis},
                { label: 'descripcion_correcion', name: 'descripcion_correcion', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterCorrecion},
                { label: 'estado_cabecera', name: 'estado_cabecera', width: 40, sorttype:"string", align:'center', formatter:gridSac_FormatterEstCab},
                { label: 'observacion_cabecera', name: 'observacion_cabecera', width: 60, sorttype:"string", align:'center', formatter:gridSac_FormatterObserCabecera},
            ],
            pager: '#pagerSacs',
            rownumbers: true,
            caption: "SACS",
            shrinkToFit: true,
            gridview: true,
            rowattr: function (rd) {
               if (rd.numero_auditoria === null) { // verify that the testing is correct in your case
                   return {"class": "myAltRowClass"};
               }
            },
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    emptyMsgDiv.show();
                    desabilitarReportes();
                } else {
                    $(this).show();
                    emptyMsgDiv.hide();
                }
            },
            /**SUBGRID */
            subGrid: true,
            subGridRowExpanded:function(parentRowID,  row_id){

                // CREA UNA UNICA TABLA Y PAGINACION
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
                $("#" + childGridID).jqGrid({
                    url: /gridSacPlanAccion/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colNames:['ID', 'PLAN ACCIÓN', 'PLAZO', 'RESPONSABLE', 'JUSTIFICACIÓN', 'OBSERVACIÓN', 'ESTADO','FECHA', 'RESPONSABLE', 'JUSTIFICACIÓN', 'OBSERVACIÓN','ESTADO', 'EST. PLAN', 'OBS. PLAN', 'EST. CIERRE','sac_id'],
                    colModel: [
                        { name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true},
                        { name: 'detalle_plan_accion', width: 17, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterPlan},
                        { name: 'plazo_plan_accion', width: 13, sorttype:"string", align:'center'},
                        { name: 'responsable_accion', width: 20, sorttype:"string", align:'center'},
                        { name: 'justificacion_plan', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterJustificacion},
                        { name: 'observacion_plan', width: 18, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObervaPla },
                        { name: 'estado_plan', width: 22, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstPlan},
                        { name: 'fecha_seguimiento', width: 13, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterFecSeguimiento},
                        { name: 'responsable_seguimiento', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterRespSeguimiento},
                        { name: 'detalle_seguimiento', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterDetalleSeguimiento},
                        { name: 'observacion_seguimiento', width: 25, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObservacionSeguimiento},
                        { name: 'estado_seguimiento', width: 15, sorttype:"string", align:'center', formatter: gridPlanAccion_FormatterEstSeguimiento},
                        { name: 'estado_aprobacion', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoPlan},
                        { name: 'observaciones_aprobacion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObservacionPlan},
                        { name: 'estado_cierre_accion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoCierre},
                        { name: 'sac_id', width: 25, sorttype:"string", align:'center', hidden:true},
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                           $("#" + childGridID).html("<span class='badge bg-yellow'>Sin  Plan de Accion !!</span>");
                        }
                    },
                    postData: {row_id: row_id},
                    loadonce: true, 
                    rownumbers: true,
                    rowNum:5,
                    width: 1220,
                    height:'100%',
                    pager: "#" + childGridPagerID
                    
                });
                jQuery("#" + childGridID).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false,
                    groupHeaders:[
                        {startColumnName: 'id', numberOfColumns: 7, titleText: '<span class="badge bg-green">RESPONSABLE PLAN DE ACCIÓN</em>'},
                        {startColumnName: 'fecha_seguimiento', numberOfColumns: 5, titleText: '<span class="badge bg-green">RESPONSABLE SEGUIMIENTO</em>'},
                    ]
                });
                function gridPlanAccion_FormatterPlan(cellvalue, options, rowObject){

                    if(rowObject.detalle_plan_accion){
                        detalle_plan_accion = encode(rowObject.detalle_plan_accion);
                        var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+detalle_plan_accion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value =""
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterPlan


                function gridPlanAccion_FormatterFecSeguimiento(cellvalue, options, rowObject){
                    if (rowObject.fecha_seguimiento){
                        new_formatter_fechaSeguimiento = rowObject.fecha_seguimiento;
                    }else{
                        new_formatter_fechaSeguimiento = '';
                    }
                    return new_formatter_fechaSeguimiento
                }//end functionn gridPlanAccion_FormatterFecSeguimiento


                function gridPlanAccion_FormatterRespSeguimiento(cellvalue, options, rowObject){
                    if(rowObject.responsable_seguimiento){
                        new_formatter_responsableSeguimiento = rowObject.responsable_seguimiento;
                    }else{
                        new_formatter_responsableSeguimiento = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    return new_formatter_responsableSeguimiento
                }//end function gridPlanAccion_FormatterRespSeguimiento


                function gridPlanAccion_FormatterDetalleSeguimiento(cellvalue, options, rowObject){
                    if(rowObject.detalle_seguimiento){
                        var detalle_seguimiento = encode(rowObject.detalle_seguimiento);
                        var new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+detalle_seguimiento+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value ="<i class='fa fa-clock-o' style='color:orange'> Pendiente</i>"
                    }
                    return new_formatter_value;

                }//end function gridPlanAccion_FormatterDetalleSeguimiento

                function gridPlanAccion_FormatterObservacionSeguimiento(cellvalue, options, rowObject){

                    if(rowObject.observacion_seguimiento){
                        var observacion_seguimiento = encode(rowObject.observacion_seguimiento);
                        var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+observacion_seguimiento+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value = '';
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterObservacionSeguimiento

                function gridPlanAccion_FormatterEstSeguimiento(cellvalue, options, rowObject){
                    
                    if(rowObject.estado_seguimiento ==0){
                        new_formatter_estadoSeguimiento = '<a href="javascript:void(0)" onclick="javascript:modalEstadoSeguimiento(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange;"> Editar</i></a>';
                    }else if(rowObject.estado_seguimiento ==1){
                        new_formatter_estadoSeguimiento = '<i class="fa fa-check" style="color:green"> Designado</i>';
                    }else if(rowObject.estado_seguimiento ==2){
                        new_formatter_estadoSeguimiento = '<a href="javascript:void(0)" onclick="javascript:modalAprobarSeguimiento(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange;"> Aprobar</i></a>';
                    }else if(rowObject.estado_seguimiento ==3){
                        new_formatter_estadoSeguimiento ='<i class="fa fa-check" style="color:green">Aprobado</i>';
                    }else if(rowObject.estado_seguimiento ==4){
                       // new_formatter_estadoSeguimiento ='<span class="badge bg-yellow">Observaciones</span>';
                       new_formatter_estadoSeguimiento = '<a href="javascript:void(0)" onclick="javascript:modalAprobarSeguimiento(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:orange;"> Observaciones</i></a>';
                    }
                    return new_formatter_estadoSeguimiento;

                }//end function gridPlanAccion_FormatterEstSeguimiento

                function gridPlanAccion_FormatterJustificacion(cellvalue, options, rowObject){

                    if(rowObject.justificacion_plan){
                        justificacion_plan = encode(rowObject.justificacion_plan);
                        new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+justificacion_plan+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value='<span class="badge bg-yellow">Pendiente</span>';
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterJustificacion

                function gridPlanAccion_FormatterObervaPla(cellvalue, options, rowObject){

                    if(rowObject.observacion_plan){
                        var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_plan+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value='';
                    }
                    return new_formatter_value;

                }//end function gridPlanAccion_FormatterObervaPla

                function gridPlanAccion_FormatterEstPlan(cellvalue, options, rowObject){

                    if(rowObject.estado_plan == 0){
                        var new_formatter_value = '<a href="javascript:void(0)" onclick="aprobar_plan_colaborador(\''+rowObject.id+'\')"><i class="fa fa-pencil" style="color:orange"> Pendiente<i></a>';
                    }
                    if(rowObject.estado_plan == 1){
                        new_formatter_value='<i class="fa fa-check" style="color:green"> Aprobado</i>';
                    }
                    if(rowObject.estado_plan == 2){
                        new_formatter_value='<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
                    }
                    return new_formatter_value;

                }//end function gridPlanAccion_FormatterEstPlan


                function gridPlanAccion_FormatterEstadoPlan(cellvalue, options, rowObject){
                    if(rowObject.estado_aprobacion ==1){
                        new_formatter_estadoAprobacion='<i class="fa fa-check" style="color:green">Aprobado</i>';
                    }else if(rowObject.estado_aprobacion ==0){
                        new_formatter_estadoAprobacion='<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
                    }else{
                        new_formatter_estadoAprobacion='<span class="badge bg-yellow">Ninguna</span>';
                    }
                    return new_formatter_estadoAprobacion;
                }//end function gridPlanAccion_FormatterEstadoPlan

                function gridPlanAccion_FormatterObservacionPlan(cellvalue, options, rowObject){

                    if(rowObject.observaciones_aprobacion){
                        var observaciones_aprobacion = encode(rowObject.observaciones_aprobacion);
                        var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+observaciones_aprobacion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value = '';
                    }
                    return new_formatter_value;
                }//end function gridPlanAccion_FormatterObservacionPlan

                function gridPlanAccion_FormatterEstadoCierre(cellvalue, options, rowObject){
                    if(rowObject.estado_cierre_accion=='1'){
                        new_formatter_estadoCierre='<span class="badge bg-green">Imp. y Efectiva</span>';
                    }else if(rowObject.estado_cierre_accion=='2'){
                        new_formatter_estadoCierre='<span class="badge bg-yellow">Imp. y No Efect.</span>';
                    }else if(rowObject.estado_cierre_accion=='3'){
                        new_formatter_estadoCierre='<span class="badge bg-red">No Implement.</span>';
                    }else{
                        new_formatter_estadoCierre='<span class="badge bg-yellow">Pendiente</span>';
                    }
                    return new_formatter_estadoCierre;
                }//end function gridPlanAccion_FormatterEstadoCierre
            },
            subGridOptions : {
                // expande todas las filas al cargar
                  expandOnLoad: false
            },
            /** END SUBGRID */ 
        });
        jQuery("#gridSacs").jqGrid('setGroupHeaders', {
            useColSpanStyle: false,
            groupHeaders:[
                {startColumnName: 'id', numberOfColumns: 7, titleText: '<span class="badge bg-green">AUDITOR</em>'},
                {startColumnName: 'analisis_causa', numberOfColumns: 2, titleText: '<span class="badge bg-green">DIRECTOR DE ÁREA</em>'},
                {startColumnName: 'estado_cabecera', numberOfColumns: 2, titleText: '<span class="badge bg-green">ACCIONES</em>'},
            ]
        });
        //muestra el mensaje luego de cargar la grilla 
        emptyMsgDiv.insertAfter($("#gridSacAuditor").parent());

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

            if(hallazgo){
                var tag = document.createElement('div');
                tag.innerHTML = hallazgo;
                nuevo_hallazgo = tag.innerText;
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_hallazgo+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }//end if
            
            return new_formatter_value;

        }//end function gridSac_FormatterHallazgo


        function gridSac_FormatterAnalisis(cellvalue, options, rowObject)
        {	
            var analisis_causa = rowObject.analisis_causa;
            if(analisis_causa){
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+analisis_causa+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }//end if 
            
            return new_formatter_value;

        }//end function gridSac_FormatterAnalisis


        function gridSac_FormatterCorrecion(cellvalue, options, rowObject)
        {	
            var descripcion_correcion = rowObject.descripcion_correcion;
            if (descripcion_correcion){
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+descripcion_correcion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }
            
            return new_formatter_value;

        }//end function gridSac_FormatterCorrecion


        function gridSac_FormatterEstCab(cellvalue, options, rowObject){

            
            if(rowObject.estado_cabecera==0){
                new_formatter_cabecera='<a href="javascript:void(0)" onclick="aprobarCabecera(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:red"> Pendiente</i></a>';
            }
            if(rowObject.estado_cabecera == 1){

                new_formatter_cabecera = '<i class="fa fa-clock-o" style="color:orange"> En Proceso</i>';

            }//end if

            if(rowObject.estado_cabecera == 2){

                new_formatter_cabecera = '<a href="javascript:void(0)" onclick="aprobarCabecera(\''+rowObject.id+'\');"><i class="fa fa-commenting-o" style="color:red"> Observaciones</i> </a>';

            }//end if

            if(rowObject.estado_cabecera == 3){

                new_formatter_cabecera = '<a href="javascript:void(0)" onclick="aprobarSacJefe(\''+rowObject.id+'\');"><i class="fa fa-pencil" style="color:red"> Pendiente</i></a>';

            }//end if
            if(rowObject.estado_cabecera == 4 ){
                new_formatter_cabecera='<a href="javascript:void(0)" onclick="aprobarSacJefe(\''+rowObject.id+'\');"><i class="fa fa-commenting-o" style="color:red"> Observaciones</i></a>';
            }
            if(rowObject.estado_cabecera == 5 ){
                new_formatter_cabecera='<i class="fa fa-check" style="color:green"> Aprobada</i>';
            }

            return new_formatter_cabecera;

        }//end function gridSac_FormatterEstadoCabecera

        function gridSac_FormatterObserCabecera(cellvalue, options, rowObject){

            var observacion_cabecera =rowObject.observacion_cabecera;
            if(rowObject.observacion_cabecera){
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+observacion_cabecera+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value='<span class="badge bg-green"> Ninguna</span>';
            }
            return new_formatter_value
        }//end function gridSac_FormatterObserCabecera


    }//end function gridSacs

    CKEDITOR.replace('descripcion');
    $('#modalHallazgo').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      var modal = $(this)
      CKEDITOR.instances.descripcion.setData(recipient);
    });


    //MOSTRAR EL DETALLE
    function mi_funcion(data){

       $("#descripcion").html(data.replace(/(<([^>]+)>)/ig,""));
       $("#modalHallazgo").modal('show');

    }//end funtion

    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function aprobarCabecera(id_sac){

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

               if(data.codigo){
                    document.getElementById('form_cabeceraSac').reset();
                    $("#id_sac").val(id_sac);
                    $("#div_observacion").hide();
               }else{
                    sac = data.sac_list;

                    id_sac              = sac[0]['id'];
                    estado_cabecera     = sac[0]['estado_cabecera'];
                    $("#modalCabeceraSac #id_sac").val(id_sac);
                    $('#modalCabeceraSac #estado_cabecera').val(estado_cabecera);
                    if (estado_cabecera==2){
                        observacion     = sac[0]['observacion_cabecera'];
                        $("#div_observacion").show();
                        $("#modalCabeceraSac #observacion").val(observacion);
                    }else{

                        document.getElementById('form_cabeceraSac').reset();
                        $("#modalCabeceraSac #id_sac").val(id_sac);
                        $("#div_observacion").hide();
                    }
               }
                //mostrar modal
                $("#modalCabeceraSac").modal('show');
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

        }); // end ajax


    }//end function aprobarCabecera


    function aprobarSacJefe(id_sac){

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
               sac = data.sac_list;
               //data retornada
               var id_sac = sac[0]['id'];

               //asignar data  a modal
                $("#modalSacJefe #sac_id").val(id_sac);
                $("#estado_director").val(5);
               //mostrar modal
               $("#modalSacJefe").modal('show');
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

        }); // end ajax

    }//end function aprobarSacJefe


    function mostrarObservaciones(estado_cabecera){

        if(estado_cabecera==2 || estado_cabecera==4){
            $("#div_observacion").show();
        }else{
            $("#div_observacion").hide();
        }

    }//end function mostrarObservaciones

    function mostrarObservacionesJefe(estado_cabecera){

        if(estado_cabecera==4){
            $("#div_observacion_jefe").show();
        }else{
            $("#div_observacion_jefe").hide();
        }

    }//end function mostrarObservaciones


    function modalEstadoSeguimiento(id_plan){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectPlanPorId/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_plan:id_plan,
            },
            dataType: "json",
            success: function(data) {
                plan_accion = data.plan_accion;
                
                //asignar data a modal
                $("#planAccion #span_estado_seguimiento").html("RESPONSABLE DE SEGUIMIENTO -    SAC N°: "+plan_accion[0]['sac_id']);
                $("#planAccion #idSac").val(plan_accion[0]['sac_id']);
                $("#planAccion #id_plan").val(plan_accion[0]['id']);
                $("#planAccion #detalle_plan_accion").val(plan_accion[0]['detalle_plan_accion']);
                $("#planAccion #fecha_plan_accion").val(plan_accion[0]['plazo_plan_accion']);
                $("#planAccion #responsable").val(plan_accion[0]['responsable_plan_accion_id']);
                //mostrar modal
                $("#planAccion").modal('show')

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

        }); // end ajax

    }//end function modalEstadoSeguimiento


    function modalAprobarSeguimiento(id_plan){
        document.getElementById('form_estadoSeguimiento').reset();
        $("#modalAprobarSeguimiento #id_plan").val(id_plan);
        $("#div_observaciones_seguimiento").hide();
        //mostrar modal
        $("#modalAprobarSeguimiento").modal('show');
        
    }//end function modalAprobarSeguimiento



    

    /**
     * 
     * FUNCION MOSTRAR SAC JEFE DE AREA
     */
    function mostrarSacJefe(data){
        

        var sac_jefe    = data.detalle_jefe_list;
        var sac_auditor = data.sac_list;

        //data retornada
        var numero_auditoria        = sac_auditor[0]['numero_auditoria'];
        var jefe_area               = sac_jefe[0]['jefe_area'];
        var estado_detalle          = sac_jefe[0]['estado_detalle'];
        var observacion_auditor     = sac_jefe[0]['observacion_detalle'];
        var descripcion_correcion   = sac_jefe[0]['descripcion_correcion'];
        var analisis_causa          = sac_jefe[0]['analisis_causa'];
        var detalle_plan_accion     = sac_jefe[0]['detalle_plan_accion'];
        var plazo_plan_accion       = sac_jefe[0]['plazo_plan_accion'];
        var responsable_plan_accion = sac_jefe[0]['responsable_plan_accion'];
        var id_sac                  = sac_auditor[0]['id'];
        

        //ASIGNAR DATOS  A MODAL
        $("#modalSacJefe #accion").val("insert");
        $("#modalSacJefe #id_sac").val(id_sac);
        $("#modalSacJefe #numero_auditoria").val(numero_auditoria);
        $("#modalSacJefe #jefe_area").val(jefe_area);
        $("#modalSacJefe #observacion_auditor").val(observacion_auditor);
        $("#modalSacJefe #estado_sac_jefe").val(estado_detalle);
        CKEDITOR.instances.descripcion_correcion.setData(descripcion_correcion);
        CKEDITOR.instances.analisis_causa.setData(analisis_causa);
        $("#detalle_1").val(detalle_plan_accion);
        $("#plazo_1").val(plazo_plan_accion);
        $("#responsable_1").val(responsable_plan_accion);

        //mostrar modal
        $('#modalSacJefe').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrarSacJefe



    function confirmarGrabarSacJefe(){


        swal({
            title: "Desea grabar los Datos ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                insertSacJefe();
            }
        });

    }//end function confirmarGrabarSacJefe




    function insertSacJefe(){
        
        var id_sac              = $("#modalSacJefe #sac_id").val();
        var estado_sac_jefe     = $("#modalSacJefe #estado_director").val();
        if (estado_sac_jefe =="" || estado_sac_jefe== null ){
            swal("Seleccione un Estado !!", "", "info");
            return false;
        }//end if
        var observacion_detalle = $("#modalSacJefe #observacion_director").val();
        if(estado_sac_jefe == "4" && (observacion_detalle == null || observacion_detalle ==""  ) ){
            swal("Ingrese una Observacion  !!", "", "info");
            return false;
        }//end if

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/insertSacJefe/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
                estado_sac_jefe:estado_sac_jefe,
                observacion_detalle:observacion_detalle,
            },
            dataType: "json",
            success: function(data) {
                var codigo  = data.resultado;
                var mensaje = data.mensaje;
                if (codigo == "ok_update"){
                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalSacJefe').modal('hide');
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

    }//end function insertSacJefe



    /**
     * 
     * MOSTRAR SAC AUDITOR
     */
    function mostrarSacAuditor(data){

        var sac_auditor = data.sac_list;
        var sac_jefe    = data.detalle_jefe_list;
        //data retornada
        var id_sac                  = sac_auditor[0]['id'];
        var numero_auditoria        = sac_auditor[0]['numero_auditoria'];
        var area                    = sac_auditor[0]['area'];
        var jefe_area               = sac_jefe[0]['jefe_area'];
        var tipo_solicitud          = sac_auditor[0]['tipo_solicitud'];
        var fecha_solicitud         = sac_auditor[0]['fecha_solicitud'];
        var criticidad              = sac_auditor[0]['criticidad'];
        var responsable             = sac_auditor[0]['responsable'];
        var solicitante             = sac_auditor[0]['solicitante'];
        var observacion_cabecera    = sac_auditor[0]['observacion_cabecera'];
        var estado_cabecera         = sac_auditor[0]['estado_cabecera'];
        var descripcion_hallazgo    = sac_auditor[0]['descripcion_hallazgo'];

        //establecer data a modal
        $("#modalSacAuditor #accion").val("update");
        $("#modalSacAuditor #idSac").val(id_sac);
        $("#modalSacAuditor #numero_auditoria").val(numero_auditoria);
        $("#modalSacAuditor #area").val(area);
        $("#modalSacAuditor #jefe_area").val(jefe_area);
        $("#modalSacAuditor #tipo_solicitud").val(tipo_solicitud);
        $("#modalSacAuditor #fecha_solicitud").val(fecha_solicitud);
        $("#modalSacAuditor #criticidad").val(criticidad);
        $("#modalSacAuditor #responsable").val(responsable);
        $("#modalSacAuditor #solicitante").val(solicitante);
        $("#modalSacAuditor #div_observacion").show();
        $("#modalSacAuditor #estado_cabecera").val(estado_cabecera);
        $("#modalSacAuditor #observacion").val(observacion_cabecera);
        CKEDITOR.instances.sacAuditor.setData(descripcion_hallazgo);
        
        //mostrar modal
        $('#modalSacAuditor').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end function 

    

    function confirmarGrabarSacAuditor(){

        var accion =  $("#modalCabeceraSac #accion").val();
     
        swal({
            title: "Desea grabar los Datos ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                insertSacAuditor();
            }
        });

    }//end function


    function insertSacAuditor(){

        var id_sac              = $("#modalCabeceraSac #id_sac").val();
        var estado_cabecera     = $("#modalCabeceraSac #estado_cabecera").val();
        if (estado_cabecera =="" || estado_cabecera== null ){
            swal("Seleccione un Estado !!", "", "info");
            return false;
        }//end if

        var observacion = $("#modalCabeceraSac #observacion").val();
        if(estado_cabecera == "2" && (observacion == null || observacion ==""  ) ){
            swal("Ingrese una Observacion  !!", "", "info");
            return false;
        }//end if
        if(estado_cabecera == "2"){

        }

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/insertSacAudt/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
                estado_cabecera:estado_cabecera,
                observacion:observacion,
            },
            dataType: "json",
            success: function(data) {
                var codigo  = data.resultado;
                var mensaje = data.mensaje;
                if (codigo == "ok_update"){
                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalCabeceraSac').modal('hide');
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


    }//end function insertSacAuditor



    function cargarModalSac(){
        
        //limpiar formulario
        document.getElementById('form_sac').reset();

        //mostrar modal
        $('#modalSac').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end funcion cargarModalNorma



    function consultar_plan_accion(id_sac){
       
        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/planAccion/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
            },
            dataType: "json",
            success: function(data) {
                var codigo  = data.resultado;
                if (codigo == "ok_select"){
                    var plan_accion = data.plan_accion;
                    mostrar_plan_accion(plan_accion);
                }//end if
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

        }); //end ajax

    }//end function consultar_plan_accion



    function mostrar_plan_accion(plan_accion){

        //data retornante
        var id_sac              = plan_accion[0]['sac_id'];
        var detalle_plan_accion = plan_accion[0]['detalle_plan_accion'];
        var fecha_plan_accion   = plan_accion[0]['fecha_seguimiento'];
        var responsable         = plan_accion[0]['responsable_seguimiento'];
        var estado_seguimiento  = plan_accion[0]['estado_seguimiento'];
        if(estado_seguimiento == "3"){
            $("#div_estado_seguimiento").show();
        }else{
            $("#div_estado_seguimiento").hide();
        }
        //asignar data a modal
        $("#planAccion #detalle_plan_accion").val(detalle_plan_accion);
        $("#planAccion #fecha_plan_accion").val(fecha_plan_accion);
        $("#planAccion #responsable_plan_accion").val(responsable);
        $("#planAccion #idSac").val(id_sac);

        //mostrar modal
        $('#planAccion').modal({'show':true, backdrop: 'static', keyboard: false});
        
    }//end function mostrar_plan_accion



    function confirmarGrabarPlanAccion(){


        swal({
            title: "Desea grabar los Datos ?",
            //text: "Desea Editar los Datos !",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                insertPlanAccion();
            }
        });

    }//end function confirmarGrabarPlanAccion


    function insertPlanAccion(){
        
        //data de modal
        var id_sac                  = $("#planAccion #idSac").val();
        var id_plan                 = $("#planAccion #id_plan").val();
        var fecha_seguimiento       = $("#planAccion #fecha_seguimiento").val();
        if(fecha_seguimiento == "" || fecha_seguimiento == null ){
            swal("Seleccione una fecha !!" , "", "info");
            return false;
        }//end if

        var responsable_seguimiento = $("#planAccion #responsable_seguimiento").val();
        if(responsable_seguimiento == "" || responsable_seguimiento == null ){
            swal("Seleccione el responsable !!" , "", "info");
            return false;
        }//end if
        
        //var estado_seguimiento =  $("#planAccion #estado_seguimiento").val();
        
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/updatePlanAccion/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_sac:id_sac,
                id_plan:id_plan,
                fecha_seguimiento:fecha_seguimiento,
                responsable_seguimiento:responsable_seguimiento,
            },
            dataType: "json",
            success: function(data) {

                var mensaje = data.mensaje;
                var codigo  = data.resultado;
                if (codigo=="ok_update"){
                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#planAccion').modal('hide');
                    //recargar pagina
                    location.reload();
                }//end if   
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

    }//end function


    function establecer_estado_planAccion(id_sac){

        //reset formulario
        document.getElementById("form_aprobacion_plan_accion").reset(); 
        //set id_sac
        $("#aprobacion_plan_accion #id_sac").val(id_sac);
        //mostrar modal
        $("#aprobacion_plan_accion").modal('show');

    }//end function establecer_estado_planAccion

    
    /**
     * MOSTRARA LAS OBSERVACIONES 
     * SI EL ESTADO ES POR CORREGIR
     */
    function mostrar_div_observaciones(estado_aprobacion_plan_accion){

        if (estado_aprobacion_plan_accion == "2"){
            $("#div_observaciones_plan_accion").show();
        }else{
            $("#div_observaciones_plan_accion").hide();
        }//end if

    }//end function mostrar_div_observaciones


    function grabarAprobacionPlanAccion(){
        swal({
            title: "Desea grabar los Datos ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {

            if (willDelete) {

                var id_sac                  = $("#aprobacion_plan_accion #id_sac").val();
                var estado_aprobacion       = $("#aprobacion_plan_accion #estado_aprobacion_plan_accion").val();
                if(estado_aprobacion == "" || estado_aprobacion == null){
                    swal({title: "Seleccione un estado !!", text: "",icon: "info",});
                    return false;
                }else{
                    if(estado_aprobacion == "2"){
                        var observacion_aprobacion  = $("#aprobacion_plan_accion #observacion_plan_accion").val();
                        if (observacion_aprobacion == null || observacion_aprobacion == ""){
                            swal({title: "Ingrese las observaciones !!", text: "",icon: "info",});
                            return false;
                        }//end if
                    }//end if
                }//end if
                var csrftoken = getCookie('csrftoken');

                $.ajax({
                    type: "POST",
                    url: "/upEstPlanAccion/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_sac:id_sac,
                        estado_aprobacion:estado_aprobacion,
                        observacion_aprobacion:observacion_aprobacion,
                    },
                    dataType: "json",
                    success: function(data) {
                        codigo = data.resultado;
                        mensaje = data.mensaje;
                        if(codigo == "ok_update"){
                            //mensaje
                            swal({title: mensaje, text: "",icon: "success",});
                            //ocultar modal
                            $("#aprobacion_plan_accion").modal('hide');
                            //refrescar pagina
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

            }//end if

          });//end willDelete
        
        

    }//end function


    

    function establecer_cierre(id_sac){
        
        //reset formulario
        document.getElementById("form_cierre_sac").reset();
        //asignar id_sac
        $("#modalCierreSac #id_sac").val(id_sac);
        //MOSTRAR MODAL
        $("#modalCierreSac").modal('show');

    }//end function establecer_cierre


    function grabar_cierre(){

        var numero_sac          = $("#modalCierreSac #numero_sac").val();
        var estado_cierre       = $("#modalCierreSac #estado_cierre").val();
        if (estado_cierre == "" || estado_cierre == null){
            swal('Seleccione el Estado !!', "", "info");
            return false;
        }

        swal({
            title: "Desea grabar los datos ?",
            text: "",
            icon: "warning",
            buttons: true,
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
       
                var csrftoken = getCookie('csrftoken');
                $.ajax({
                    type: "POST",
                    url: "/upCierre/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_sac:numero_sac,
                        estado_cierre:estado_cierre,
                    },
                    dataType: "json",
                    success: function(data) {
                        codigo = data.resultado;
                        mensaje = data.mensaje;
                        if(codigo == "ok_update"){
                            //mensaje
                            swal({title: mensaje, text: "",icon: "success",});
                            //ocultar modal
                            $("#modalCierreSac").modal('hide');
                            //refrescar pagina
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

            }//end if
          });

    }//end functiongrabar_cierre

 

    //INSTANCIAR CKEDITOR
    CKEDITOR.replace( 'informe_auditoria' );
    //agregar center CKEDITOR
    jQuery(function() {
        CKEDITOR.config.extraPlugins = 'justify';
    });  
    CKEDITOR.replace( 'page_body',{
        extraPlugins : 'uicolor',
        height: '850px',
    });

    
    function modalNumeroAuditoria(){

        //reset el form de generar auditoria
        document.getElementById("form_informeAuditoria").reset();

        //mostrar modal
        $('#modalNumeroAuditoria').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end function modalNumeroAuditoria



    function getData(){

        var numero_auditoria = $("#modalNumeroAuditoria #numero_auditoria").val();

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/getInformeAuditoria/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                numero_auditoria:numero_auditoria,
            },
            dataType: "json",
            success: function(data) {
                
                var encabezado  = data.encabezado;
                var alcance = data.alcance_equipo;
                var noConformidades = data.rows_noConformidades;

                $("#modalNumeroAuditoria").modal('hide');
                

                var html='<p style="text-align:center;float:left;"><strong>AUDITOR&Iacute;A INTERNA</strong></p>';
                html = html + '<p style="text-align:center;float:left;"><strong>INFORME FINAL</strong></p>';
                html = html + '<strong>1.- Fecha de realizaci&oacute;n de la auditor&iacute;a:</strong>';
                html = html + '<p>'+encabezado[0]['fecha_realizacion']+'</p>';
                html = html + '<p><strong>2.- Fecha de presentaci&oacute;n del informe:</strong></p>';
                html = html + '<p>'+encabezado[0]['fecha_realizacion']+'</p>';
                html = html + '<p><strong>3.- Lugar de la auditor&iacute;a:</strong></p>';
                html = html + '<p>'+encabezado[0]['lugar']+'</p>';
                html = html + '<p><strong>4.- Criterio de auditor&iacute;a:</strong></p>';
                html = html + '<p><strong>5.- Objetivo de la auditor&iacute;a:</strong></p>';
                html = html + '<p>'+encabezado[0]['objetivo']+'</p>';
                html = html + '<p><strong>6.- Alcance de la auditor&iacute;a:</strong></p>';
                html = html + '<table border="1">'
                html = html + '<tr>'
                html = html + '<td align="center"><strong>Proceso</strong></td>'
                html = html + '<td align="center"><strong>Procedimiento</strong></td>'
                html = html + '</tr>'
                for(i=0; i<alcance.length; i++){
                    html = html + '<tr>';
                    html = html + '<td>'+alcance[i]['proceso']+'</td>';
                    html = html + '<td>'+alcance[i]['procedimiento']+'</td>';
                    html = html + '</tr>';
                }//end for
                html = html + '</table>'
                html = html + '<p><strong>7.- Equipo Auditor:</strong></p>';
                html = html + '<table border="1">'
                html = html + '<tr bgcolor="#CDF4EC">'
                html = html + '<td style="text-align:center"><strong>Auditor</strong></td>'
                html = html + '<td style="text-align:center"><strong>Proceso</strong></td>'
                html = html + '<td style="text-align:center"><strong>Procedimiento</strong></td>'
                html = html + '</tr>'
                for(i=0; i<alcance.length; i++){
                    html = html + '<tr>';
                    html = html + '<td >'+alcance[i]['auditor']+'</td>';
                    html = html + '<td>'+alcance[i]['proceso']+'</td>';
                    html = html + '<td>'+alcance[i]['procedimiento']+'</td>';
                    
                    html = html + '</tr>';
                }//end for
                html = html + '</table>'
                html = html + '<p><strong>8.- Personal entrevistado:</strong></p>';
                html = html + '<p><strong>9.- Conclusiones:</strong></p>';
                html = html + '<p><strong>10.- Recomendaciones:</strong></p>';
                html = html + '<p><strong>11.- Anexos:</strong></p>';
                html = html + '<p><strong>11.1.- Informe de No Conformidades:</strong></p>';
                html = html + '<table border="1">';
                html = html + '<tr>';
                html = html + '<td style="text-align:center"><b>Proceso</b></td>';
                html = html + '<td style="text-align:center"><b>Criticidad</b></td>';
                html = html + '<td style="text-align:center"><b>Descripción del Hallazgo</b></td>';
                html = html + '<td style="text-align:center"><b>Analisis de la Causa</b></td>';
                html = html + '</tr>';
                for(i=0; i<noConformidades.length; i++){
                    html += '<tr>';
                    html += '<td style="text-align:center">'+noConformidades[i]['area']+'</td>';
                    html += '<td style="text-align:center">'+noConformidades[i]['criticidad']+'</td>';
                    html += '<td style="text-align:center">'+noConformidades[i]['descripcion_hallazgo']+'</td>';
                    html += '<td style="text-align:center">'+noConformidades[i]['analisis_causa']+'</td>';
                    html += '</tr>';
                }
                html = html + '</table>';
                html = html + '<p><strong>11.2.- Listas de verificaci&oacute;n utilizadas:</strong></p>';
                CKEDITOR.instances.informe_auditoria.setData(html);

                //mostrar modal
                $("#modalCrearInforme").modal('show');
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
        }); // end ajax

    }//end function getData



    //validar  fecha del calendario
    function validar_fecha() {

        var input = document.getElementById("fecha_seguimiento");

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



    function aprobar_plan_colaborador(id_plan){

        //establecer el id del plan
        $("#id_plan_colaborador").val(id_plan);

        //ocultar observaciones
        $("#div_observaciones_plan_colaborador").hide();

        //predefinir
        $("#estado_plan_colaborador").val(1);
        $("#observaciones_plan_colaborador").val('');

        //mostrar_modal
        $("#modalPlanColaborador").modal("show");

    }//end function aprobar_plan_colaborador


    function mostrar_observacionesPlan(estado_plan){

        if(estado_plan == 2){
            //mostrar observaciones
            $("#div_observaciones_plan_colaborador").show();
        }else{

            //ocultar observaciones
            $("#div_observaciones_plan_colaborador").hide();
        }

    }//end function mostrar_observacionesPlan

    function confirmarGrabarPlanColaborador(){
        swal({
          title: "Desea Grabar los Datos",
          text: "",
          icon: "warning",
          buttons: ['No', 'Si'],
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {

            //insertar plan colaborador
            insertPlanColaborador();

          } else {
            return false;
          }
        });

    }//end function confirmarGrabarPlanColaborador


    function insertPlanColaborador(){

        //validaciones
        id_plan_colaborador = $("#modalPlanColaborador #id_plan_colaborador").val();
        estado              = $("#modalPlanColaborador #estado_plan_colaborador").val();
        observaciones       = $("#modalPlanColaborador #observaciones_plan_colaborador").val();
        console.log(estado);
          console.log(observaciones);

        if(estado == 2 && (observaciones == null || observaciones == "")){
            swal('Ingrese las Observaciones !!', '', 'info');
            return false;
        }

        //token
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/aprobar_plan_colaborador/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_plan:id_plan_colaborador,
                estado: estado,
                observaciones: observaciones
            },
            dataType: "json",
            success: function(data) {
                codigo = data.resultado;
                mensaje = data.mensaje;
                if(codigo == 'ok_insert'){
                    //mensaje exitoso
                    swal(mensaje, '', 'success');
                    //recargar pagina
                    location.reload();
                }//end if
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


    }//end function insertPlanColaborador



    /**
     *
     *CARGAR PROCESOS POR AREA
     */
    function cargarProcesos(id_area){


        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selProcArea/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_area:id_area,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    var procesos =data.procesos_list;
                    if(data.director_list){
                        var director = data.director_list;
                        $("#modalCrearSac #responsable").val(director[0]['id_personal_id']);
                    }
                    //remover opt
                    //$('#id_proceso').find('option:not(:first)').remove();
                    $('#modalCrearSac #procedimiento').find('option').remove()
                    //agregar nuevo valor opt
                    $.each(procesos, function (i, proceso) {
                        $('#modalCrearSac #procedimiento').append($('<option>', {
                            value: proceso.id,
                            text : proceso.proceso
                        }));
                    });
                }
                if(codigo=="no_ok"){
                    $("#procesos").hide();
                    swal('El proceso seleccionado no posee procedimientos vinculados !!', "", "warning");
                    return false;
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


    }//end function cargarProcesos

    //INSTANCIAR CKEDITOR
    CKEDITOR.replace( 'descripcion_hallazgo' );
    //editor_descripcion


    CKEDITOR.config.width="100%";
    CKEDITOR.config.height="120px"

    function abrirmodalCrearSac(){

        //reset form
        document.getElementById('form_crearsac').reset();
        //abrir modal
        $("#modalCrearSac").modal('show');

    }//end function abrirmodalCrearSac


    function grabarSac(){

        var proceso = $("#modalCrearSac #proceso").val();
        if(proceso == '' || proceso == null){
            swal('Seleccione un Proceso !!', '', 'info');
            return false;
        }

        var tipo_sac = $("#modalCrearSac #tipo_sac").val();
        if(tipo_sac == '' || tipo_sac == null){
            swal('Seleccione el tipo de no Conformidad !!', '', 'info');
            return false;
        }
        /*
        var procedimiento = $("#modalCrearSac #procedimiento").val();
        if(procedimiento == '' || procedimiento == null){
            swal('Seleccione un Procedimiento !!', '', 'info');
            return false;
        }
        */
        var fecha = $("#modalCrearSac #fecha").val();
        if(fecha == '' || fecha == null){
            swal('Ingrese una fecha !!', '', 'info');
            return false;
        }

        var criticidad = $("#modalCrearSac #criticidad").val();
        if(criticidad == '' || criticidad == null){
            swal('Seleccione el tipo de Criticidad !!', '', 'info');
            return false;
        }

        var responsable = $("#modalCrearSac #responsable").val();
        if(responsable == '' || responsable == null){
            swal('Seleccione el Responsable !!', '', 'info');
            return false;
        }

        var solicitante = $("#modalCrearSac #solicitante").val();
        if(solicitante == '' || solicitante == null){
            swal('Seleccione el Solicitante !!', '', 'info');
            return false;
        }

        var descripcion_hallazgo      = CKEDITOR.instances.descripcion_hallazgo.getData();
        if (descripcion_hallazgo =="" || descripcion_hallazgo == null ){
            swal("Escriba la descripcion del hallazgo !", "", "info");
            return false;
        }//end if

        //ELIMINAR ESPACIOS ENTRE TAGS
        descripcion_hallazgo = descripcion_hallazgo.replace(/\s+/g, ' ');



        //token
        var csrftoken           = getCookie('csrftoken');
        //confirmar grabar datos
        swal({
          title: "Desea grabar los datos ?",
          text: "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            //grabar sac
            $.ajax({
                type: "POST",
                url: "/insertSacAuditor/",
                data:{
                    csrfmiddlewaretoken : csrftoken,
                    area:proceso,
                    tipo_solicitud:tipo_sac,
                    fecha_solicitud:fecha,
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
                        $('#modalCrearSac').modal('hide');
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
          } else {
            swal("La SAC no ha sido creada !!");
            return false;
          }
        });

    }//end function grabarSac

