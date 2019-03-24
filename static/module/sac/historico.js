
    //mostrar por defecto primer tab
    $('#myTab li:first-child a').tab('show');
    //autocargar funcion
    window.onload = function(){
        gridSacs();
        gridHistoricoPlanAccion();
    }

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
            width:990,
            height:300,
            rowNum:30,
            colNames:['SAC', 'SAC Vinc.','AUDIT.', 'PROCESO', 'PROCEDIMIENTO', 'CRIT.', 'HALLAZG0', 'ANÁLISIS', 'CORREC.', 'ESTADO'],
            colModel: [
                { label: 'id', name: 'id', width: 22, key:true, sorttype:"integer", align:'center'},
                { label: 'sac_id', name: 'sac_id', width: 25, sorttype:"integer", align:'center'},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 25, sorttype:"integer", align:'center'},
                { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center'},
                { label: 'procedimiento', name: 'procedimiento', width: 60, sorttype:"string", align:'center'},
                { label: 'criticidad', name: 'criticidad', width: 30, sorttype:"string", align:'center'},
                { label: 'descripcion_hallazgo', name: 'descripcion_hallazgo', width: 30, sorttype:"string", align:'center', formatter: gridSac_FormatterHallazgo},
                { label: 'analisis_causa', name: 'analisis_causa', width: 30, sorttype:"string", align:'center', formatter: gridSac_FormatterAnalisis},
                { label: 'descripcion_correcion', name: 'descripcion_correcion', width: 30, sorttype:"string", align:'center', formatter: gridSac_FormatterCorrecion},
                { label: 'estado_cabecera', name: 'estado_cabecera', width: 50, sorttype:"string", align:'center', formatter:gridSac_FormatterEstCab},
            ],
            pager: '#pagerSacs',
            rownumbers: true,
            caption: "SACS",
            shrinkToFit: true,
            loadComplete: function () {
                if ($("#gridSacs").getGridParam('records') === 0) {
                    $("#gridSacs").html("<span class='badge bg-yellow'>Sin Historico !!</span>");
                }
            },
            /* SUBGRID */
            subGrid: true,
            subGridRowExpanded:function(parentRowID,  row_id){

                // CREA UNA UNICA TABLA Y PAGINACION
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
                $("#" + childGridID).jqGrid({
                    url: /grid_historicoSac/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colNames:['ID', 'AUDITOR', 'OBSERVACIÓN', 'FECHA', 'ESTADO', 'DIRECTOR', 'OBSERVACIÓN', 'FECHA','ESTADO'],
                    colModel: [
                        { name: 'id', width: 15, sorttype:"integer", align:'center', hidden:true},
                        { name: 'auditor', width: 20, sorttype:"string", align:'center'},
                        { name: 'observacion_rev_auditor', width: 7, sorttype:"string", align:'center', formatter: subGrid_formatterObservacionAuditor},
                        { name: 'fec_rev_auditor', width: 8, sorttype:"string", align:'center'},
                        { name: 'estado_rev_auditor', width: 10, sorttype:"string", align:'center', formatter: subGrid_formatterEstadoAuditor},
                        { name: 'director', width: 20, sorttype:"string", align:'center'},
                        { name: 'observacion_rev_director', width: 8, sorttype:"string", align:'center', formatter: subGrid_formatterObservacionDirec},
                        { name: 'fec_rev_director', width: 8, sorttype:"string", align:'center'},
                        { name: 'estado_rev_director', width: 10, sorttype:"string", align:'center', formatter: subGrid_formatterEstadoDirector},
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                           $("#" + childGridID).html("<span class='badge bg-yellow'>Sin  Historico !!</span>");
                        }
                    },
                    postData: {row_id: row_id},
                    loadonce: true,
                    rownumbers: true,
                    rowNum:10,
                    width: 1100,
                    height:'100%',
                    pager: "#" + childGridPagerID

                });

                 $("#" + childGridID).setGroupHeaders({
                    useColSpanStyle: true,
                    groupHeaders: [
                        { "numberOfColumns": 4, "titleText": "<span class='badge bg-green'>AUDITOR</span>", "startColumnName": "auditor" },
                        { "numberOfColumns": 4, "titleText": "<span class='badge bg-green'>DIRECTOR DE AREA</span>", "startColumnName": "director" }]
                  });

                  function subGrid_formatterObservacionAuditor(cellvalue, options, rowObject){

                    if(rowObject.observacion_rev_auditor){
                        data = encode(rowObject.observacion_rev_auditor);
                        new_formatter_observacionAuditor = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
                    }else{
                        new_formatter_observacionAuditor = '';
                    }
                    return new_formatter_observacionAuditor

                  }//end function subGrid_formatterObservacionAuditor


                  function subGrid_formatterEstadoAuditor(cellvalue, options, rowObject){

                    if(rowObject.estado_rev_auditor == 0){
                        new_formatter_estadoAuditor = "<i class='fa fa-commenting-o' style='color:red;'>Observaciones</i>";
                    }else{
                        new_formatter_estadoAuditor = "<i class='fa fa-check' style='color:green;'> Aprobado</i>";
                    }
                    return new_formatter_estadoAuditor;

                  }//end function subGrid_formatterEstadoAuditor

                  function subGrid_formatterObservacionDirec(cellvalue, options, rowObject){
                    if(rowObject.observacion_rev_director){
                        data = encode(rowObject.observacion_rev_director);
                        new_formatter_observacionDirector = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
                    }else{
                        new_formatter_observacionDirector = '';
                    }
                    return new_formatter_observacionDirector

                  }//end function subGrid_formatterObservacionDirec


                  function subGrid_formatterEstadoDirector(cellvalue, options, rowObject){

                    if(rowObject.estado_rev_director == null){
                        new_formatter_estadoDirector = "<i class='fa fa-clock-o' style='color:orange;'> Pendiente</i>";
                    }else if(rowObject.estado_rev_director == 0){
                        new_formatter_estadoDirector = "<i class='fa fa-commenting-o' style='color:red;'>Observaciones</i>";
                    }else{
                        new_formatter_estadoDirector = "<i class='fa fa-check' style='color:green;'> Aprobado</i>";
                    }
                    return new_formatter_estadoDirector;

                  }//end function subGrid_formatterEstadoAuditor
            },
            subGridOptions : {
					openicon: "ui-icon-arrowreturnthick-1-e"
			},
             /* FIN SUBGRID */
        });
        $(".ui-jqgrid-sortable").each(function(i) {
           //if(i>0){
                $(this).css({
                    'display': "inline-block",
                    'background-color':"#00a65a",
                    'padding': "3px 7px",
                    'font-size': "12px",
                    'font-weight': "700",
                    'line-height': "1",
                    'border-radius': "10px"
                });

           //}
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

            if(rowObject.descripcion_hallazgo){
                var hallazgo = encode(rowObject.descripcion_hallazgo);
                new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+hallazgo+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }//end if

            return new_formatter_value;

        }//end function gridSac_FormatterHallazgo


        function gridSac_FormatterAnalisis(cellvalue, options, rowObject)
        {

            if(rowObject.analisis_causa){
                var analisis_causa = encode(rowObject.analisis_causa);
                new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+analisis_causa+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }//end if

            return new_formatter_value;

        }//end function gridSac_FormatterAnalisis


        function gridSac_FormatterCorrecion(cellvalue, options, rowObject)
        {
            if (rowObject.descripcion_correcion){
                var descripcion_correcion = encode(rowObject.descripcion_correcion);
                new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+descripcion_correcion+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
            }else{
                new_formatter_value = '';
            }

            return new_formatter_value;

        }//end function gridSac_FormatterCorrecion


        function gridSac_FormatterEstCab(cellvalue, options, rowObject){


            if(rowObject.estado_cabecera==0){
                new_formatter_cabecera='<i class="fa fa-clock-o" style="color:red"> Pendiente</i></a>';
            }
            if(rowObject.estado_cabecera == 1){

                new_formatter_cabecera = '<i class="fa fa-clock-o" style="color:orange"> En Proceso</i>';

            }//end if
            if(rowObject.estado_cabecera == 2){

                new_formatter_cabecera = '<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';

            }//end if
            if(rowObject.estado_cabecera == 3){

                new_formatter_cabecera = '<i class="fa fa-pencil" style="color:red"> Pendiente</i>';

            }//end if
            if(rowObject.estado_cabecera == 4){

                new_formatter_cabecera = '<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';

            }//end if
            if(rowObject.estado_cabecera == 5){

                new_formatter_cabecera = '<i class="fa fa-check" style="color:green"> Aprobada</i>';

            }//end if

            return new_formatter_cabecera;

        }//end function gridSac_FormatterEstadoCabecera

    }//end function gridSacs

    CKEDITOR.replace('descripcion');
    $('#modalHallazgo').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      var modal = $(this)
      CKEDITOR.instances.descripcion.setData(recipient);
    });

  function mostrar_detalle(detalle){

    //agregando la data
    $("#descripcion").html(detalle.replace(/(<([^>]+)>)/ig,""));
    $("#modalHallazgo").modal('show')

  }//end function mostrar_detalle

  function encode(r){
    return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
  }//end function encode


  function gridHistoricoPlanAccion(){

    //token
    var csrftoken = getCookie('csrftoken');

    $("#gridHistoricoPlan").jqGrid({

        url: '/grid_plan_colaborador',
        postData: {
                csrfmiddlewaretoken : csrftoken,
        },
        datatype: "json",
        page: 1,
        colNames:['ID', 'SAC', 'PLAN ACCIÓN', 'PLAZO', 'RESPONSABLE', 'JUSTIFICACIÓN', 'OBSERVACIÓN', 'ESTADO','FEC. SEG.', 'RESP. SEGUIM.', 'JUSTIFICACIÓN', 'OBSERVACIÓN','ESTADO', 'EST. PLAN', 'OBS. PLAN', 'EST. CIERRE','sac_id'],
        colModel: [
            { name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true, key:true},
            { name: 'sac_id', width: 10, sorttype:"string", align:'integer', align:'center'},
            { name: 'detalle_plan_accion', width: 17, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterPlan},
            { name: 'plazo_plan_accion', width: 13, sorttype:"string", align:'center', hidden:true},
            { name: 'responsable_accion', width: 20, sorttype:"string", align:'center'},
            { name: 'justificacion_plan', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterJustificacion},
            { name: 'observacion_plan', width: 14, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObervaPla },
            { name: 'estado_plan', width: 22, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstPlan},
            { name: 'fecha_seguimiento', width: 13, sorttype:"string", align:'center', hidden:true},
            { name: 'responsable_seguimiento', width: 20, sorttype:"string", align:'center'},
            { name: 'detalle_seguimiento', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterDetalleSeguimiento},
            { name: 'observacion_seguimiento', width: 14, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObservacionSeguimiento},
            { name: 'estado_seguimiento', width: 15, sorttype:"string", align:'center', formatter: gridPlanAccion_FormatterEstSeguimiento},
            { name: 'estado_aprobacion', width: 15, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoPlan, hidden:true},
            { name: 'observaciones_aprobacion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterObservacionPlan, hidden:true},
            { name: 'estado_cierre_accion', width: 20, sorttype:"string", align:'center', formatter:gridPlanAccion_FormatterEstadoCierre, hidden:true},
            { name: 'sac_id', width: 25, sorttype:"string", align:'center', hidden:true},
        ],
        loadComplete: function() {
            if ($("#gridHistoricoPlan").getGridParam('records') === 0) {
                $("#gridHistoricoPlan").html("<span class='badge bg-yellow'>Sin Historico !!</span>");
            }
        },
        loadonce: true,
        rownumbers: true,
        caption: 'Plan de Acción',
        rowNum:30,
        width: 1220,
        height: 250,
        pager: "#pagerHistoricoPlan",
        shrinkToFit: true,
        /**SUBGRID */
        subGrid: true,
        subGridRowExpanded:function(parentRowID,  row_id){

            // CREA UNA UNICA TABLA Y PAGINACION
            var childGridID = parentRowID + "_table";
            var childGridPagerID = parentRowID + "_pager";
            $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
            $("#" + childGridID).jqGrid({
                url: '/grid_historico_plan',
                mtype: "GET",
                datatype: "json",
                page: 1,
                    colNames:['ID', 'JUSTIFICACIÓN', 'OBSERVACIÓN', 'PLAZO', 'ESTADO', 'JUSTIFICACIÓN','OBSERVACIÓN', 'FECHA', 'ESTADO'],
                colModel: [
                    { name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true},
                    { name: 'justificacion_responsable', width: 10, sorttype:"string", align:'center', formatter:subGrid_formatterJustificacionResponsable},
                    { name: 'observacion_rev_responsable', width: 8, sorttype:"string", align:'center', formatter:subGrid_formatterObservacionResponsable},
                    { name: 'fec_rev_responsable', width: 8, sorttype:"string", align:'center'},
                    { name: 'estado_rev_responsable', width: 10, sorttype:"string", align:'center', formatter:subGrid_formatterEstadoResponsable},
                    { name: 'justificacion_seguimiento', width: 10, sorttype:"string", align:'center', formatter:subGrid_formatterJustificacionSeguimiento},
                    { name: 'observacion_rev_seguimiento', width: 7, sorttype:"string", align:'center', formatter:subGrid_formatterObservacionSeguimiento},
                    { name: 'fec_rev_seguimiento', width: 8, sorttype:"string", align:'center'},
                    { name: 'estado_rev_seguimiento', width: 10, sorttype:"string", align:'center', formatter:subGrid_formatterEstadoSeguimiento},

                ],
                loadComplete: function() {
                    if ($("#" + childGridID).getGridParam('records') === 0) {
                       $("#" + childGridID).html("<span class='badge bg-yellow'>Sin Historico</span>");
                    }
                },
                postData: {row_id: row_id},
                loadonce: true,
                rownumbers: true,
                rowNum:5,
                width: 850,
                height:'100%',
                pager: "#" + childGridPagerID

            });
            jQuery("#" + childGridID).jqGrid('setGroupHeaders', {
                useColSpanStyle: false,
                groupHeaders:[
                    {startColumnName: 'id', numberOfColumns: 5, titleText: '<span class="badge bg-green">RESPONSABLE PLAN DE ACCIÓN</em>'},
                    {startColumnName: 'observacion_rev_seguimiento', numberOfColumns: 4, titleText: '<span class="badge bg-green">RESPONSABLE SEGUIMIENTO</em>'},
                ]
            });

            /*  INICIO FORMATTER SUBGRID HISTORICO PLAN ACCION */

            function subGrid_formatterJustificacionResponsable(cellvalue, options, rowObject){

                if(rowObject.justificacion_responsable){
                    data = encode(rowObject.justificacion_responsable);
                    new_formatter_justificacionResponsable = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
                }else{
                    new_formatter_justificacionResponsable = '';
                }
                return new_formatter_justificacionResponsable;
            }

            function subGrid_formatterObservacionResponsable(cellvalue, options, rowObject){

                if(rowObject.observacion_rev_responsable){
                    data = encode(rowObject.observacion_rev_responsable);
                    new_formatter_observacionResponsable = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
                }else{
                    new_formatter_observacionResponsable = '';
                }
                return new_formatter_observacionResponsable;

            }//end function subGrid_formatterObservacionResponsable


            function subGrid_formatterEstadoResponsable(cellvalue, options, rowObject){

                if(rowObject.estado_rev_responsable == 0){
                    new_formatter_estadoResponsable = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                }

                if(rowObject.estado_rev_responsable == 1){
                    new_formatter_estadoResponsable = '<i class="fa fa-check" style="color:green"> Aprobado</i>';
                }
                if(rowObject.estado_rev_responsable == 2){
                    new_formatter_estadoResponsable = '<i class="fa fa-commenting" style="color:red"> Observaciones</i>';
                }
                return new_formatter_estadoResponsable;

            }//end function subGrid_formatterEstadoResponsable

            function subGrid_formatterJustificacionSeguimiento(cellvalue, options, rowObject){

                if(rowObject.justificacion_seguimiento){
                    data = encode(rowObject.justificacion_seguimiento);
                    new_formatter_justificacionSeguimiento = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
                }else{
                    new_formatter_justificacionSeguimiento = '';
                }
                return new_formatter_justificacionSeguimiento;
            }

            function subGrid_formatterObservacionSeguimiento(cellvalue, options, rowObject){

                if(rowObject.observacion_rev_seguimiento){
                    data = encode(rowObject.observacion_rev_seguimiento);
                    new_formatter_observacionSeguimiento = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
                }else{
                    new_formatter_observacionSeguimiento = '';
                }
                return new_formatter_observacionSeguimiento;

            }//end function subGrid_formatterObservacionSeguimiento


            function subGrid_formatterEstadoSeguimiento(cellvalue, options, rowObject){

                if(rowObject.estado_rev_seguimiento == 0 || rowObject.estado_rev_seguimiento == null){
                    new_formatter_estadoSeguimiento = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
                }
                if(rowObject.estado_rev_seguimiento == 1){
                    new_formatter_estadoSeguimiento = '<i class="fa fa-check" style="color:green"> Aprobado</i>';
                }
                if(rowObject.estado_rev_seguimiento == 2){
                    new_formatter_estadoSeguimiento = '<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
                }
                return new_formatter_estadoSeguimiento;

            }//end function subGrid_formatterEstadoSeguimiento


            /*  FIN FORMATTER SUBGRID HISTORICO PLAN ACCION */

        }
        /**SUBGRID */
    });
    jQuery("#gridHistoricoPlan").jqGrid('setGroupHeaders', {
        useColSpanStyle: false,
        groupHeaders:[
            {startColumnName: 'id', numberOfColumns: 8, titleText: '<span class="badge bg-green">RESPONSABLE DE PLAN DE ACCIÓN</em>'},
            {startColumnName: 'fecha_seguimiento', numberOfColumns: 5, titleText: '<span class="badge bg-green">RESPONSABLE SEGUIMIENTO</em>'},
            //{startColumnName: 'estado_cabecera', numberOfColumns: 2, titleText: '<span class="badge bg-green">ACCIONES</em>'},
        ]
    });

    function gridPlanAccion_FormatterPlan(cellvalue, options, rowObject){
        var detalle_plan_accion = rowObject.detalle_plan_accion;
        if(detalle_plan_accion){
            var new_formatter_value = '<a href="javascript:void(0)" onclick="mostrar_detalle(\''+detalle_plan_accion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
        }else{
            new_formatter_value =""
        }
        return new_formatter_value;
    }//end function gridPlanAccion_FormatterPlan

    function gridPlanAccion_FormatterJustificacion(cellvalue, options, rowObject){
        var justificacion_plan =rowObject.justificacion_plan
        if(rowObject.justificacion_plan){
            data = encode(rowObject.justificacion_plan);
            new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
        }else{
            new_formatter_value='<span class="badge bg-yellow">Pendiente</span>';
        }
        return new_formatter_value;
    }//end function gridPlanAccion_FormatterJustificacion

    function gridPlanAccion_FormatterObervaPla(cellvalue, options, rowObject){

        if(rowObject.observacion_plan){
            data = encode(rowObject.observacion_plan);
            new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
        }else{
            new_formatter_value='';
        }
        return new_formatter_value;

    }//end function gridPlanAccion_FormatterObervaPla

    function gridPlanAccion_FormatterEstPlan(cellvalue, options, rowObject){

        if(rowObject.estado_plan == 0){
            var new_formatter_valuePlan = '<i class="fa fa-clock-o" style="color:orange"> Pendiente<i></a>';
        }
        if(rowObject.estado_plan == 1){
            new_formatter_valuePlan='<i class="fa fa-check" style="color:green"> Aprobado</i>';
        }
        if(rowObject.estado_plan == 2){
            new_formatter_valuePlan='<i class="fa fa-commenting-o" style="color:red"> Observaciones</i>';
        }
        return new_formatter_valuePlan;

    }//end function gridPlanAccion_FormatterEstPlan

    function gridPlanAccion_FormatterDetalleSeguimiento(cellvalue, options, rowObject){
        if(rowObject.detalle_seguimiento){
            data = encode(rowObject.detalle_seguimiento);
            new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
        }else{
            new_formatter_value ="<span class='badge bg-yellow'>Sin Detalle </span>"
        }
        return new_formatter_value;

    }//end function gridPlanAccion_FormatterDetalleSeguimiento

    function gridPlanAccion_FormatterObservacionSeguimiento(cellvalue, options, rowObject){
        if(rowObject.observacion_seguimiento){
            data = encode(rowObject.observacion_seguimiento);
            new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
        }else{
            new_formatter_value = '';
        }
        return new_formatter_value;
    }//end function gridPlanAccion_FormatterObservacionSeguimiento


    function gridPlanAccion_FormatterEstSeguimiento(cellvalue, options, rowObject){

        if(rowObject.estado_seguimiento ==0){
            new_formatter_estadoSeguimiento = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
        }else if(rowObject.estado_seguimiento ==1){
            new_formatter_estadoSeguimiento = '<span class="badge bg-blue">Designado</span>';
        }else if(rowObject.estado_seguimiento ==2){
            new_formatter_estadoSeguimiento = '<i class="fa fa-clock-o" style="color:orange"> Pendiente</i>';
        }else if(rowObject.estado_seguimiento ==3){
            new_formatter_estadoSeguimiento ='<i class="fa fa-check" style="color:green">Aprobado</i>';
        }else if(rowObject.estado_seguimiento ==4){
           // new_formatter_estadoSeguimiento ='<span class="badge bg-yellow">Observaciones</span>';
           new_formatter_estadoSeguimiento = '<i class="fa fa-commenting-o" style="color:red;"> Observaciones</i>';
        }
        return new_formatter_estadoSeguimiento;

    }//end function gridPlanAccion_FormatterEstSeguimiento

    function gridPlanAccion_FormatterEstadoPlan(cellvalue, options, rowObject){
        if(rowObject.estado_aprobacion ==1){
            new_formatter_estadoAprobacion='<span class="badge bg-green">Aprobado</span>';
        }else if(rowObject.estado_aprobacion ==0){
            new_formatter_estadoAprobacion='<span class="badge bg-yellow">Observaciónes</span>';
        }else{
            new_formatter_estadoAprobacion='<span class="badge bg-yellow">Ninguna</span>';
        }
        return new_formatter_estadoAprobacion;
    }//end function gridPlanAccion_FormatterEstadoPlan

    function gridPlanAccion_FormatterObservacionPlan(cellvalue, options, rowObject){
        var observaciones_aprobacion = rowObject.observaciones_aprobacion;
        if(rowObject.observaciones_aprobacion){
            data = encode(rowObject.observaciones_aprobacion);
            new_formatter_value = '<a href="javascript:void(0)" data-toggle="modal" data-target="#modalHallazgo" data-whatever="'+data+'"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';
        }else{
            new_formatter_value = '<span class="badge bg-yellow">Ninguna</span>';
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


  }//end function gridHistoricoPlanAccion
