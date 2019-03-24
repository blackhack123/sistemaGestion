
    //autocargar funcion
    window.onload = gridAuditorias;

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


    /*********************************************/
    /**FUNCION cargarModal Auditoria *************/
    /*********************************************/

    function cargarModalAuditoria(){

        
        document.getElementById("numero").disabled = false;
        $('#modalAuditoria #accion').val("insert");
        //limpiar formulario
        document.getElementById('formAuditoria').reset();
        $.jgrid.gridUnload("gridVinculados");
    
        //mostrar modal
        $('#modalAuditoria').modal({'show':true, backdrop: 'static', keyboard: false});
        
 
    }//end funcion cargarModalArea




 
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
            swal("No se puede Generar Reporte", "No existen datos !", "info");
            return false;
        });

    }//end function desabilitarReportes


        /**
     * GRID AUDITORIAS
     */
    function gridAuditorias(){
        

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Auditorias  !!</span></div>");
        $("#gridAuditoriasEstablecidas").jqGrid({
            url:'/gridAuditorias/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 1100,
            height: 400,
            rowNum:1000,
            colNames:['ID', 'NUM. AUDIT.', 'LUGAR', 'FEC. INICIO', 'HORA', 'FEC. FINAL', 'NORMA', 'CLÁUSULA', 'IDNORMA', 'AREA', 'IDAREA','PROCEDIMIENTO','IDPROCESO','AUDITOR','IDAUDITOR', 'EDITAR', 'ELIMINAR'],
            colModel: [
                { label: 'id_auditoria', name: 'id_auditoria', width: 15, key:true, sorttype:"integer", hidden:true},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 35, sorttype:"integer", align:'center'},
                { label: 'lugar', name: 'lugar', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'fec_inicio', name: 'fec_inicio', width: 40, sorttype:"string", align:'center'},
                { label: 'hora_inicio', name: 'hora_inicio', width: 30, sorttype:"string", align:'center'},
                { label: 'fec_fin', name: 'fec_fin', width: 40, sorttype:"string", align:'center'},
                { label: 'nombre_norma', name: 'nombre_norma', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'clausula', name: 'clausula', width: 30, sorttype:"string", align:'center'},
                { label: 'id_norma_id', name: 'id_norma_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'nombre_area', name: 'nombre_area', width: 40, sorttype:"string", align:'center'},
                { label: 'id_area_id', name: 'id_area_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'nombre_proceso', name: 'nombre_proceso', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'id_proceso_id', name: 'id_proceso_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'nombre_auditor', name: 'nombre_auditor', width: 50, sorttype:"string", align:'center'},
                { label: 'id_auditor_id', name: 'id_auditor_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { name:'btn_editar_Auditoria' , width:10, align:"center", width: 25, formatter:gridAuditorias_FormatterEdit },
                { name:'btn_eliminar_Auditoria' , width:10, align:"center", width: 25, formatter:gridAuditorias_FormatterEliminar },
            ],
            pager: '#pagerAuditoriasEstablecidas',
            rownumbers: true,
            caption: "Auditorias",
            shrinkToFit: true,
            grouping: true,
            groupingView: {
                groupField: ["numero_auditoria", "nombre_area"],
                groupColumnShow: [false, false],
                groupText: [
                    "<strong>Auditoría: </strong>  <span class='badge bg-blue'>{0}</span>",
                    "<strong>Proceso:</strong> <span class='badge bg-green'>{0}</span>",
                ],
                groupOrder: ["desc", "desc"],
                groupCollapse: true,
            },
            ondblClickRow: function (rowid,iRow,iCol,e) {

                var data = $('#gridAuditoriasEstablecidas').getRowData(rowid);	
                //asignar a variables la data
                var arrData= new Array();
                var element ={}
                element.numero_auditoria    = data.numero_auditoria;
                element.id_area             = data.id_area_id;
                element.id_proceso          = data.id_proceso_id;
                element.id_auditor          = data.id_auditor_id;
                
                arrData.push(element);
                consultar_auditoria(data.numero_auditoria);

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
                }//END IF
            },
                
        });
        //AGRUPAR HEADING JQGRID
        jQuery("#gridAuditoriasEstablecidas").jqGrid('setGroupHeaders', {
            useColSpanStyle: true, 
            groupHeaders:[
              {startColumnName: 'btn_editar_Auditoria', numberOfColumns: 2, titleText: 'ACCIONES'},
              ]   
          });
        //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
        var groupingView = $("#gridAuditoriasEstablecidas").jqGrid("getGridParam", "groupingView"),
        plusIcon = groupingView.plusicon,
        minusIcon = groupingView.minusicon;
        $("#gridAuditoriasEstablecidas").click(function (e) {
            var $target = $(e.target),
                $groupHeader = $target.closest("tr.jqgroup");
            if ($groupHeader.length > 0) {
                if (e.target.nodeName.toLowerCase() !== "span" ||
                        (!$target.hasClass(plusIcon) && !$target.hasClass(minusIcon))) {
                    $(this).jqGrid("groupingToggle", $groupHeader.attr("id"));
                    return false;
                }
            }
        });
        //muestra el mensaje luego de cargar la grilla 
        emptyMsgDiv.insertAfter($("#gridAuditoriasEstablecidas").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function(){
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridAuditoriasEstablecidas").jqGrid('filterInput', self.value);
            },0);
        });


    
        function gridAuditorias_FormatterEdit(cellvalue, options, rowObject){

            var numero_auditoria              = rowObject.numero_auditoria;	
            
            new_format_value = '<a href="javascript:void(0)" onclick="consultar_auditoria(\''+numero_auditoria+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i></a>'; 
            
            return new_format_value
            
        }//end function gridBodegas_FormatterEdit

        function gridAuditorias_FormatterEliminar(cellvalue, options, rowObject){

            var numero_auditoria              = rowObject.numero_auditoria;
            
            new_format_value = '<a href="javascript:void(0)" onclick="eliminar_auditoria(\''+numero_auditoria+'\')"><i class="glyphicon glyphicon-remove" style="color:red"></i></a>';
            
            return new_format_value
            
        }//end function gridBodegas_FormatterEdit


    }//end function grid auditorias



    function eliminar_auditoria(numero_auditoria){

        swal({
            title: "Desea eliminar la Auditoria ",
            text:'',
            icon: "warning",
            buttons: ['NO','SI'],
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {

                var csrftoken = getCookie('csrftoken');
                $.ajax({
                    type: "POST",
                    url: "/deleteAuditoria/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        numero_auditoria:numero_auditoria,
                    },
                    dataType: "json",
                    success: function(data) {
                        if (data.resultado== "ok_delete"){

                            swal(data.mensaje, "", "success");
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
            }else{
                return false;
            }
        });
    }//end function eliminar_auditoria




    function consultar_auditoria(numero_auditoria){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/getAuditoria/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                numero_auditoria:numero_auditoria,
            },
            dataType: "json",
            success: function(data) {
                if (data.resultado== "ok_select"){
                   var auditoria_list =  data.auditoria_list;
                   
                    mostrar_auditoria_existente(auditoria_list);
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


    }//end function consultar_auditoria





    function mostrar_auditoria_existente(auditoria_list){


        var numero              = auditoria_list[0]['numero_auditoria'];
        var lugar               = auditoria_list[0]['lugar'];
        var fec_inicio          = auditoria_list[0]['fec_inicio'];
        var fec_fin             = auditoria_list[0]['fec_fin'];
        var objetivo            = auditoria_list[0]['objetivo'];
        var id_area             = auditoria_list[0]['id_area_id'];
        var id_norma            = auditoria_list[0]['id_norma_id'];
        var hora_inicio         = auditoria_list[0]['hora_inicio'];
        var hora_fin            = auditoria_list[0]['hora_fin'];
        var id_auditor          = auditoria_list[0]['id_auditor'];
        
        $("#modalAuditoria #accion").val("update");
        $("#modalAuditoria #numero").val(numero);
        document.getElementById("numero").disabled = true;
        $("#modalAuditoria #lugar").val(lugar);
        $("#modalAuditoria #fecha_inicio").val(fec_inicio);
        $("#modalAuditoria #hora_inicio").val(hora_inicio);
        $("#modalAuditoria #hora_fin").val(hora_fin);
        $("#modalAuditoria #fecha_fin").val(fec_fin);
        
       
        $("#modalAuditoria #objetivo").val(objetivo);
        cargarVinculados(id_norma);
        $("#modalAuditoria #id_norma").val(id_norma);
        document.getElementById("id_norma").disabled = true;
        //mostrar modal
        $('#modalAuditoria').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrar_auditoria_existente

    
    function updateAuditoria(){



        //data de modal
        var numero           = $('#modalAuditoria #numero').val();
        if (numero == "" || numero == null){
            swal('Ingrese el numero de Auditoria !', "", "info");
            return false;
        }


        var lugar           = $('#modalAuditoria #lugar').val();
        if (lugar == "" || lugar == null){
            swal('Ingrese el lugar de la Auditoria ! ', "", "info");
            return false;
        }

        var fecha_inicio    = $('#modalAuditoria #fecha_inicio').val();
        if (fecha_inicio == "" || fecha_inicio == null){
            swal('Seleccione la fecha de inicio ! ', "", "info");
            return false;
        }

        var hora_inicio    = $('#modalAuditoria #hora_inicio').val();
        if (hora_inicio == "" || hora_inicio == null){
            swal('Ingrese la Hora de inicio ! ', "", "info");
            return false;
        }

        var fecha_fin       = $('#modalAuditoria #fecha_fin').val();
        if (fecha_fin == "" || fecha_fin == null){
            swal('Seleccione la fecha de finalizacion ! ', "", "info");
            return false;
        }
        
        var objetivo       = $('#modalAuditoria #objetivo').val();

        //token
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/updateAudit/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                numero:numero,
                lugar:lugar,
                fecha_inicio:fecha_inicio,
                hora_inicio:hora_inicio,
                fecha_fin:fecha_fin,
                objetivo:objetivo,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                var mensaje = data.mensaje;
                if (codigo=="ok_update"){
                    //mensaje ok update
                    swal(mensaje, "", "success");
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

    }




    /**
     * 
     * CARGA AUDITORES VINCULADOS POR NORMA(ID_NORMA)
     */
    function cargarVinculados(id_norma){

        //DESCARGAR GRILLA
        $.jgrid.gridUnload("gridVinculados");
        //TOKEN
        var csrftoken = getCookie('csrftoken');

        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Auditores designados !!</span></div>");
        $("#gridVinculados").jqGrid({
            url:'/gridAudtDesignados/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
                id_norma:id_norma,
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 400,
            height: 150,
            rowNum:10,
            colNames:['ID', 'id_area_id', 'id_auditor_id', 'id_norma_id', 'id_proceso_id', 'AUDITOR', 'NORMA', 'AREA', 'PROCEDIMIENTO', 'id_clausula','CLÁUSULA'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'id_area_id', name: 'id_area_id', width: 20, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_auditor_id', name: 'id_auditor_id', width: 20, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_norma_id', name: 'id_norma_id', width: 20, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_proceso_id', name: 'id_proceso_id', width: 50, sorttype:"integer", align:'center', hidden:true},
                { label: 'auditor', name: 'auditor', width: 20, sorttype:"string", align:'center'},
                { label: 'norma', name: 'norma', width: 20, sorttype:"string", align:'center', hidden:true},
                { label: 'area', name: 'area', width: 40, sorttype:"string", align:'center', hidden:true},
                { label: 'proceso', name: 'proceso', width: 20, sorttype:"string", align:'center'},
                { label: 'id_clausula', name: 'id_clausula', width: 10, sorttype:"string", align:'center', hidden:true},
                { label: 'clausula', name: 'clausula', width: 10, sorttype:"string", align:'center'}
            ],
            pager: '#pagerVinculados',
            rownumbers: true,
            caption: "Normas Vinculadas",
            shrinkToFit: true,
            grouping: true,
            groupingView: {
                groupField: ["area"],
                groupColumnShow: [false],
                groupText: [
                    "<strong>Procesos :</strong> <span class='badge bg-green'>{0}</span>",
                ],
                groupOrder: ["asc"],
                groupCollapse: true,
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
                }//END IF
            },
        });
        //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
        var groupingView = $("#gridVinculados").jqGrid("getGridParam", "groupingView"),
        plusIcon = groupingView.plusicon,
        minusIcon = groupingView.minusicon;
        $("#gridVinculados").click(function (e) {
            var $target = $(e.target),
                $groupHeader = $target.closest("tr.jqgroup");
            if ($groupHeader.length > 0) {
                if (e.target.nodeName.toLowerCase() !== "span" ||
                        (!$target.hasClass(plusIcon) && !$target.hasClass(minusIcon))) {
                    $(this).jqGrid("groupingToggle", $groupHeader.attr("id"));
                    return false;
                }
            }
        });
        //muestra el mensaje luego de cargar la grilla 
        emptyMsgDiv.insertAfter($("#gridVinculados").parent());


    }//function cargarVinculados




    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalAuditoria #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                      insertAuditoria();
                }else{
                    return false;
                }
            });

        }else{
            swal({
                title: "Desea actualizar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    updateAuditoria();
                }else{
                    return false;
                }
            });
        }

    }//END FUNCTION confirmarGrabar



    function insertAuditoria(){

        //data de modal
        var numero           = $('#modalAuditoria #numero').val();
        if (numero == "" || numero == null){
            swal('Ingrese el numero de Auditoria !', "", "info");
            return false;
        }


        var lugar           = $('#modalAuditoria #lugar').val();
        if (lugar == "" || lugar == null){
            swal('Ingrese el lugar de la Auditoria ! ', "", "info");
            return false;
        }

        var fecha_inicio    = $('#modalAuditoria #fecha_inicio').val();
        if (fecha_inicio == "" || fecha_inicio == null){
            swal('Seleccione la fecha de inicio ! ', "", "info");
            return false;
        }

        var hora_inicio    = $('#modalAuditoria #hora_inicio').val();
        if (hora_inicio == "" || hora_inicio == null){
            swal('Ingrese la Hora de inicio ! ', "", "info");
            return false;
        }

        var fecha_fin       = $('#modalAuditoria #fecha_fin').val();
        if (fecha_fin == "" || fecha_fin == null){
            swal('Seleccione la fecha de finalizacion ! ', "", "info");
            return false;
        }

        var hora_fin    = $('#modalAuditoria #hora_fin').val();
        if (hora_fin == "" || hora_fin == null){
            swal('Ingrese la Hora de Finalizacion ! ', "", "info");
            return false;
        }

        var id_norma        = $('#modalAuditoria #id_norma').val();
        if (id_norma == "" || id_norma == null){
            swal('Seleccione la Norma a ser Auditada ! ', "", "info");
            return false;
        }

        var objetivo        = $('#modalAuditoria #objetivo').val();
        if (objetivo == "" || objetivo == null){
            swal('Ingrese los objetivos de la Auditoría !!', "", "info");
            return false;
        }

        var gridProcesos    = $('#gridVinculados').jqGrid('getGridParam','data');
        totalGrid           = gridProcesos.length;

        var arrData = new Array();

        for (i=0; i<totalGrid; i++ ){

            var element = {}

            element.numero          = numero;
            element.lugar           = lugar;
            element.fecha_inicio    = fecha_inicio;
            element.hora_inicio     = hora_inicio
            element.fecha_fin       = fecha_fin;
            element.hora_fin        = hora_fin;
            element.objetivo        = objetivo;

            element.id_norma        = gridProcesos[i]['id_norma_id'];
            element.id_area         = gridProcesos[i]['id_area_id'];
            element.id_proceso      = gridProcesos[i]['id_proceso_id'];
            element.id_clausula     = gridProcesos[i]['id_clausula'];
            element.id_auditor      = gridProcesos[i]['id_auditor_id']

            arrData.push(element);

        }//end for

        var data = {
            gridData: arrData,
        }
        data = JSON.stringify(data)

        //token
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/setAuditoria/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                data:data,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                var mensaje = data.mensaje;
                if (codigo=="ok_insert"){
                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //recargar pagina
                    location.reload();
                }//end if

                if(codigo=="ok_select"){
                    swal(mensaje, "", "info");
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
    }//end function insertAuditoria




    //validar  fecha del calendario
    function validar_fecha() {
        var input = document.getElementById("fecha_inicio");
        var fin = document.getElementById("fecha_fin");

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
        fin.disabled = false;
        fin.setAttribute('min', date);
    }//end function validar_fecha
