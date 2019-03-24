
    //INSTANCIAR CKEDITOR
    CKEDITOR.replace( 'informe_auditoria' );
    //agregar center CKEDITOR
    jQuery(function() {
        CKEDITOR.config.extraPlugins = 'justify';
    });  
    //autocargar GRIDSACS
    window.onload = gridSacs;

    function gridSacs(){

        //token
        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen SACS !!</span></div>");
        $("#gridSacs").jqGrid({
            url:'/gridSacLider/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            //data: mydata,
            loadonce: true, 
            viewrecords: true,
            width: 1110,
            height: 300,
            rowNum:10,
            colNames:['SAC N°', 'SAC Vin.', 'AUDIT.', 'LUGAR','PROCESO', 'PROCEDIMIENTO', 'CRIT.', 'HALLAZG0', 'ANALISIS', 'CORRECCION', 'ESTADO', 'OBSERVACION'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", align:'center'},
                { label: 'sac_id', name: 'sac_id', width: 21, sorttype:"integer", align:'center'},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 25, sorttype:"integer", align:'center'},
                { label: 'lugar', name: 'lugar', width: 30, sorttype:"string", align:'center'},
                { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center'},
                { label: 'procedimiento', name: 'procedimiento', width: 50, sorttype:"string", align:'center'},
                { label: 'criticidad', name: 'criticidad', width: 30, sorttype:"string", align:'center'},
                { label: 'descripcion_hallazgo', name: 'descripcion_hallazgo', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterHallazgo},
                { label: 'analisis_causa', name: 'analisis_causa', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterAnalisis},
                { label: 'descripcion_correcion', name: 'descripcion_correcion', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterCorrecion},
                { label: 'estado_cabecera', name: 'estado_cabecera', width: 55, sorttype:"string", align:'center', formatter:gridSac_FormatterEstCab},
                { label: 'observacion_cabecera', name: 'observacion_cabecera', width: 30, sorttype:"string", align:'center', formatter:gridSac_FormatterObserCabecera},
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
                    //desabilitarReportes();
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
                    colNames:['ID', 'PLAN ACCIÓN', 'PLAZO', 'RESPONSABLE', 'JUSTIFICACIÓN','FEC. SEG.', 'RESP. SEGUIM.', 'DET. SEGUIMIENTO', 'OBSERVACIÓN','EST. SEG.', 'EST. PLAN', 'OBS. PLAN', 'EST. CIERRE','sac_id'],
                    colModel: [
                        { name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true},
                        { name: 'detalle_plan_accion', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterPlan},
                        { name: 'plazo_plan_accion', width: 12, sorttype:"string", align:'center'},
                        { name: 'responsable_accion', width: 17, sorttype:"string", align:'center'},
                        { name: 'justificacion_plan', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterJustificacion},
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
                    width: 1120,
                    height:'100%',
                    pager: "#" + childGridPagerID
                    
                });
                jQuery('#' + childGridID).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false,
                    groupHeaders:[
                        {startColumnName: 'id', numberOfColumns: 5, titleText: '<span class="badge bg-green">RESPONSABLE PLAN DE ACCIÓN</em>'},
                        {startColumnName: 'fecha_seguimiento', numberOfColumns: 5, titleText: '<span class="badge bg-green">RESPONSABLE SEGUIMIENTO</em>'},
                        {startColumnName: 'estado_aprobacion', numberOfColumns: 3, titleText: '<span class="badge bg-green">ESTADO</em>'},
                    ]
                });
                function gridPlanAccion_FormatterPlan(cellvalue, options, rowObject){
                    detalle_plan_accion = encode(rowObject.detalle_plan_accion);
                    if(detalle_plan_accion){
                        new_formatter_value ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+detalle_plan_accion+'"><i class="fa fa-envelope"></i> Abrir</a>';
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
                        new_formatter_responsableSeguimiento = '';
                    }
                    return new_formatter_responsableSeguimiento
                }//end function gridPlanAccion_FormatterRespSeguimiento


                function gridPlanAccion_FormatterDetalleSeguimiento(cellvalue, options, rowObject){
                    detalle_seguimiento = encode(rowObject.detalle_seguimiento);
                    if(detalle_seguimiento){
                        new_formatter_value ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+detalle_seguimiento+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_value =""
                    }
                    return new_formatter_value;

                }//end function gridPlanAccion_FormatterDetalleSeguimiento

                function gridPlanAccion_FormatterObservacionSeguimiento(cellvalue, options, rowObject){
                    if(rowObject.observacion_seguimiento){
                        new_formatter_observacionSeguimiento = '<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_seguimiento+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_observacionSeguimiento = '';
                    }
                    return new_formatter_observacionSeguimiento;
                }//end function gridPlanAccion_FormatterObservacionSeguimiento

                function gridPlanAccion_FormatterEstSeguimiento(cellvalue, options, rowObject){
                    
                    if(rowObject.estado_seguimiento ==0){
                        new_formatter_estadoSeguimiento = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }else if(rowObject.estado_seguimiento ==1){
                        new_formatter_estadoSeguimiento = '<i class="fa fa-check" style="color:green"> Designado</i>';
                    }else if(rowObject.estado_seguimiento ==2){
                        new_formatter_estadoSeguimiento = '<i class="fa fa-clock-o" style="color:orange">En Revision</i>';
                    }else if(rowObject.estado_seguimiento ==3){
                        new_formatter_estadoSeguimiento ='<i class="fa fa-check" style="color:green">Aprobado</i>';
                    }else if(rowObject.estado_seguimiento ==4){
                       new_formatter_estadoSeguimiento = '<i class="fa fa-commenting-o" style ="color:red"> Observaciones</i>';
                    }
                    return new_formatter_estadoSeguimiento;

                }//end function gridPlanAccion_FormatterEstSeguimiento

                function gridPlanAccion_FormatterJustificacion(cellvalue, options, rowObject){
                    if(rowObject.justificacion_plan){
                        justificacion = encode(rowObject.justificacion_plan);
                        //new_formatter_justificacion = '<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.justificacion_plan+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                        new_formatter_justificacion ='<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+justificacion+'"><i class="fa fa-envelope"></i> Abrir</a>';
                    }else{
                        new_formatter_justificacion='<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                    }
                    return new_formatter_justificacion;
                }//end function gridPlanAccion_FormatterJustificacion


                function gridPlanAccion_FormatterEstadoPlan(cellvalue, options, rowObject){
                    if(rowObject.estado_aprobacion ==1){
                        new_formatter_estadoAprobacion='<i class="fa fa-check" style="color:green">Aprobado</i>';
                    }else if(rowObject.estado_aprobacion ==0){
                        new_formatter_estadoAprobacion='<i class="fa fa-commenting-o" style ="color:red">Observaciones</i>';
                    }else{
                        new_formatter_estadoAprobacion='<span class="badge bg-yellow">Ninguna</span>';
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
                {startColumnName: 'id', numberOfColumns: 8, titleText: '<span class="badge bg-green">AUDITOR</em>'},
                {startColumnName: 'analisis_causa', numberOfColumns: 2, titleText: '<span class="badge bg-green">DIRECTOR DE AREA</em>'},
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
                nuevo_valor = tag.innerText;
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';;
            }else{
                new_formatter_value = '';
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
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';;
            }else{
                new_formatter_value = '';
            }//end if 
            
            return new_formatter_value;

        }//end function gridSac_FormatterAnalisis


        function gridSac_FormatterCorrecion(cellvalue, options, rowObject)
        {	
            var descripcion_correcion = rowObject.descripcion_correcion;
            if (descripcion_correcion){
                var tag = document.createElement('div');
                tag.innerHTML = descripcion_correcion;
                nuevo_valor = tag.innerText;
                var new_formatter_value = '<a href="javascript:void(0)" onclick="mi_funcion(\''+nuevo_valor+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }
            
            return new_formatter_value;

        }//end function gridSac_FormatterCorrecion


        function gridSac_FormatterEstCab(cellvalue, options, rowObject){

            
            if(rowObject.estado_cabecera==0){
                new_formatter_cabecera='<i class="fa fa-clock-o" style="color:red"> En Revision</i>';
            }
            if(rowObject.estado_cabecera == 1){

                new_formatter_cabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</i>';

            }//end if
            if(rowObject.estado_cabecera == 2){

                new_formatter_cabecera = '<i class="fa fa-commenting-o" style="color:red"> Cambios Sugeridos</i>';

            }//end if
            if(rowObject.estado_cabecera == 3){

                new_formatter_cabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</span>';

            }//end if
            if(rowObject.estado_cabecera == 4){

                new_formatter_cabecera = '<i class="fa fa-clock-o" style="color:orange"> En Revision</span>';

            }//end if
            if(rowObject.estado_cabecera == 5){

                new_formatter_cabecera = '<i class="fa fa-check" style="color:green"> Aprobado</span>';

            }//end if

            return new_formatter_cabecera;

        }//end function gridSac_FormatterEstadoCabecera


        function gridSac_FormatterObserCabecera(cellvalue, options, rowObject){
            if(rowObject.observacion_cabecera){
                new_formatter_observacionCabecera = '<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_cabecera+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter_observacionCabecera='';
            }
            return new_formatter_observacionCabecera
        }//end function gridSac_FormatterObserCabecera


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


    function modalNumeroAuditoria(){

        $("#modalNumeroAuditoria").modal('show');

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
                
                var encabezado          = data.encabezado;
                var encabezadoNorma     = data.encabezadoNorma;
                var alcance             = data.alcance_equipo;
                var involucrados        = data.involucrados;
                var auditor_lider       = data.auditor_lider;
                var auditor             = data.auditor;

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
                for(i=0; i< encabezadoNorma.length; i++){
                    html = html + '<tr>';
                    html = html + '<td>'+encabezadoNorma[i]['nombre']+',</td>';
                    html = html + '</tr>';
                }//end for
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
                html = html + '<table border="1">'
                html = html + '<tr>'
                html = html + '<td align="center"><strong>Nombre</strong></td>'
                html = html + '<td align="center"><strong>Cargo</strong></td>'
                html = html + '</tr>'
                for(i=0; i<involucrados.length; i++){
                    html = html + '<tr>';
                    html = html + '<td>'+involucrados[i]['nombre']+'</td>';
                    html = html + '<td>'+involucrados[i]['cargo']+'</td>';
                    html = html + '</tr>';
                }//end for
                html = html + '<tr>';
                html = html + '<td>'+auditor_lider[0]['nombre']+'</td>';
                html = html + '<td>'+auditor_lider[0]['cargo']+'</td>';
                html = html + '</tr>';
                html = html + '<tr>';
                html = html + '<td>'+auditor[0]['nombre']+'</td>';
                html = html + '<td>'+auditor[0]['cargo']+'</td>';
                html = html + '</tr>';
                html = html + '</table>'
                html = html + '<p><strong>9.- Conclusiones:</strong></p>';
                html = html + '<p><strong>10.- Recomendaciones:</strong></p>';
                html = html + '<p><strong>11.- Anexos:</strong></p>';
                html = html + '<p><strong>11.1.- Informe de No Conformidades:</strong></p>';
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


    function cargarModalSac(){
        
        //limpiar formulario
        document.getElementById('form_sac').reset();

        //mostrar modal
        $('#modalSac').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end funcion cargarModalNorma