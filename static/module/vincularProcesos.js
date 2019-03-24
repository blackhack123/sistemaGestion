

   //autocargar grid vinculados
    //window.onload=gridVinculados;
    document.body.onload = function() {
        gridVinculados();
        var cargo = sessionStorage.getItem('id_cargo')
        var personal = sessionStorage.getItem('id_personal')

        if(cargo == null || personal == null){
            return false;
        }else{
            selecColaborador();
        }
    };
    //limpiar input buscar 
    document.getElementById("search_cells").value = "";

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


    /**
     * EVITAR GENERAR REPORTES EN CASO 
     * NO EXISTIRDATA 
     */
    function desabilitarReportes(){
        //$("#colaboradores").hide();

        $("#colaboradores").attr("href", "javascript:void(0)");
        $("#colaboradores").attr("disabled", "disabled");
        $("#colaboradores").attr("onclick", "");
        $("#colaboradores").click( function() {
            swal("No se puede vincular Colaboradores", "No existen Procesos vinculados", "info");
            return false;
        });

        $("#excel").attr("href", "javascript:void(0)");
        $("#excel").attr("disabled", "disabled");
        $("#excel").click( function() {
            swal("No se puede Generar Reporte", "No existen Procesos vinculados", "info");
            return false;
        });

        $("#pdf").attr("href", "javascript:void(0)");
        $("#pdf").attr("disabled", "disabled");
        $("#pdf").click( function() {
            swal("No se puede Generar Reporte", "No existen Procesos vinculados", "info");
            return false;
        });

    }//end function desabilitarReportes


    /*********************************************/
    /**FUNCION cargarModal Vincular***************/
    /*********************************************/

    function cargarModalVincular(){

        //cargar grilla procesos
        gridAreaProcesos();

        //refrescar grilla
        $('#gridProcesosArea').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");

        //mostrar modal
        $('#modalVincular').modal({'show':true, backdrop: 'static', keyboard: false});

        $('#modalVincular #accion').val("insert");

        //limpiar formulario
        document.getElementById('formVincular').reset();

    }//end funcion cargarModalVincular




/** 
 * PERMITE CARGAR GRILLA DE areas
*/
   function gridAreaProcesos(){

    var csrftoken = getCookie('csrftoken');
    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
    $("#gridProcesosArea").jqGrid({
        url:'/gridAreaProcesos/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
        },
        datatype: "json",
        //data: mydata,
        loadonce: true,
        gridview: true,
        viewrecords: true,
        width: 500,
        height: 150,
        rowNum:500,
        colNames:['ID','PROCEDIMIENTO', '', 'VINCULADO', 'TIPO', 'TIPO'],
        colModel: [
            { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
            { label: 'proceso', name: 'proceso', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
            { label: 'flag', name: 'flag', width: 20, sorttype:"integer", align:'center', hidden:true},
            { label: 'flag_formatter', name: 'flag_formatter', width: 20, sorttype:"string", align:'center', formatter: gridProcesos_FormatterFlag},
            { label: 'tipo_proceso', name: 'tipo_proceso', width: 5, sorttype:"integer", hidden:true},
            { label: 'label_tipo_proceso', name: 'label_tipo_proceso', width: 20, sorttype:"string", align:'center', formatter: grid_areasprocesos_FormaterTipoProceso},

        ],
        multiselect: true,
        pager: '#pagerProcesosArea',
        rownumbers: true,
        caption: "PROCEDIMIENTOS",
        shrinkToFit: true,
        loadComplete: function () {
            var ts = this;
            if (ts.p.reccount === 0) {
                $(this).hide();
                emptyMsgDiv.show();
            } else {
                $(this).show();
                emptyMsgDiv.hide();
            }
        },
        onSelectRow: function(rowid) {
            var row = $(this).getLocalRow(rowid);
            if(row.flag == 1 && row.tipo_proceso == '1'){
            //mostrar alert
                swal('El Procedimiento ya esta vinculado', 'No puede ser seleccionado porque es una Procedimiento Vertical', 'info');
                if ($(this).jqGrid("getGridParam", "selrow") === rowid) {
                     $(this).jqGrid("resetSelection");
                }
            }
            // do something with row
        }
            
    });
    //muestra el mensaje luego de cargar la grilla 
    emptyMsgDiv.insertAfter($("#gridProcesosArea").parent());

    //funcion Buscar
    var timer;
    $("#search_cells").on("keyup", function() {
        var self = this;
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(function(){
            //timer = null;
            $("#gridProcesosArea").jqGrid('filterInput', self.value);
        },0);
    });
    //mensaje para mostrar si es tipo vertical/transversal
    function grid_areasprocesos_FormaterTipoProceso(cellvalue, options, rowObject){
        
        var tipo_proceso = rowObject.tipo_proceso;
        if (tipo_proceso =="1"){
            new_format_value = "<span class='badge bg-green'>Vertical</span>";
        }
        if (tipo_proceso =="0"){
            new_format_value = "<span class='badge bg-blue'>Transversal</span>";
        }
        return new_format_value;
    }

    function gridProcesos_FormatterFlag(cellvalue, options, rowObject){
        
        var flag = rowObject.flag;
        var id_proceso = rowObject.id;
        
        if(flag == "1"){
            //new_format_value = '<i class="fa fa-check" style="color:green"></i> Vinculado';
            new_format_value = '<a href="javascript:void(0)" onclick="javascript:consultar_areas('+id_proceso+');"><i class="fa fa-check-square" style="color:green"></i> Vinculado</a>';
        }
        if(flag == "0"){
            new_format_value = '<i class="fa fa-close" style="color:red"></i> No Vinculado';
        }
        return new_format_value;
    }

}//end function gridAreaProcesos


function consultar_areas(id_proceso){
    
    //token
    var csrftoken = getCookie('csrftoken');

     $.ajax({
        type: "POST",
        url: "/consultarAreas/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            id_proceso:id_proceso,
        },
        dataType: "json",
        success: function(data) {
            html='';
            for(i=0; i<data.length; i++){
                //agregar data areas
                html = html + "<li>"+ data[i]['area']+"</li>";
            }//end for
            $("#lista_procedimientos").html(html);
            //inicializar dialog
            $("#dialogVinculados").dialogResize({
                position: { my: "center", at: "center "},
                closeOnEscape: false,
                width: 250,
                height: 150,
                autoOpen: true,
                modal: true
            });
            //sobre una ventana modal
            $(".ui-dialog").css({
              zIndex: '1060',
            });
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

}//end function consultar_areas


    /** 
    * PERMITE CARGAR GRILLA DE VINCULADOS
    */
   function gridVinculados(){

        var csrftoken = getCookie('csrftoken');
        //emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Procesos vinculados !!</span></div>");
        $("#gridVinculados").jqGrid({
            url:'/gridVinculados/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            //data: mydata,
            loadonce: true, 
            viewrecords: true,
            width: 850,
            height: 350,
            rowNum:200,
            colNames:['id','IDaREA', 'PROCESO', 'ENCARGADO DEL PROCESO', 'ID','PROCEDIMIENTO', 'DESVINCULAR'],
            colModel: [
                { label: 'id', name: 'id', width: 15, sorttype:"integer", align:'center', hidden:true, key:true},
                { label: 'id_area', name: 'id_area', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'area', name: 'area', width: 40, sorttype:"string", align:'center'},
                { label: 'encargado', name: 'encargado', width: 40, sorttype:"string", align:'center'},
                { label: 'id_proceso', name: 'id_proceso', width: 20, sorttype:"integer", hidden:true},
                { label: 'proceso', name: 'proceso', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name:'btn_desvincular_proceso' , width:25, align:"center", formatter:gridVinculados_FormatterDesvincular },

            ],
            pager: '#pagerVinculados',
            rownumbers: true,
            caption: "PROCEDIMIENTOS VINCULADOS",
            shrinkToFit: true,
            loadComplete: function () {

                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    //emptyMsgDiv.show();
                    desabilitarReportes();
                    
                } else {
                    $(this).show();
                    $("#colaboradores").show();
                    //emptyMsgDiv.hide();
                }
            },

            /**SUBGRID */
            subGrid: true,
            //subGridRowExpanded: showChildGrid,
            subGridRowExpanded:function(parentRowID,  row_id){
                //SELECCIONA LA DATA POR ROW_ID
                var dataFromTheRow = jQuery('#gridVinculados').jqGrid ('getRowData', row_id);
                //VARIABLES A CONSULTAR AREA/PROCESO
                var id_area     = dataFromTheRow.id_area;
                var id_proceso  = dataFromTheRow.id_proceso;
        
                // CREA UNA UNICA TABLA Y PAGINACION
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
                $("#" + childGridID).jqGrid({
                    url: /gridColabVinculados/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colModel: [
                        { label: 'id', name: 'id', width: 40, sorttype:"integer", align:'center', hidden:true},
                        { label: '<span class="badge bg-yellow">COLABORADOR</span>', name: 'colaborador', width: 40, sorttype:"string", align:'center'},
                        { label: '<span class="badge bg-blue">ROL</span>', name: 'rol', width: 20, sorttype:"string", align:'center', formatter:gridColaboradoresVinculados_FormatterRol},
                        { label: '<span class="badge bg-green">CARGO</span>', name: 'cargo', width: 30, sorttype:"string", align:'center', hidden:true},
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                           //oldGrid = $('#GridIdb2 tbody').html();
                           $("#" + childGridID).html("<span class='badge bg-red'>Sin  Colaboradores vinculados  !!</span>");
                        }
                    },
                    
                    postData: {id_proceso: id_proceso, id_area:id_area},
                    loadonce: true, 
                    rownumbers: true,
                    rowNum:10,
                    width: 500,
                    height:'100%',
                    pager: "#" + childGridPagerID
                    
                });
                
        
                function gridColaboradoresVinculados_FormatterRol(cellvalue, options, rowObject){
        
                    var rol              = rowObject.rol;
                    if(rol == 1){
                        new_format_value = "<span class='badge bg-green'>Director de Área<span>"
                    }
                    if(rol == 2){
                        new_format_value = "<span class='badge bg-yellow'>Colaborador<span>"
                    }
                    if(rol == 3){
                        new_format_value = "<span class='badge bg-aqua'>Líder de Norma<span>"
                    }

                    return new_format_value
                    
                }//end function gridColaboradoresVinculados_FormatterRol
        
                
            },
            subGridOptions : {
                // expande todas las filas al cargar
                  expandOnLoad: false
            },
            /**ENDSUBGRID */

                
        });

        //MUESTRA DETALLE AL HACER CLICK SOBRE EL HEADER GROUP
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
       // emptyMsgDiv.insertAfter($("#gridVinculados").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridVinculados").jqGrid('filterInput', self.value);
            },0);
        });

        function gridVinculados_FormatterDesvincular(cellvalue, options, rowObject){

            var id_proceso  = rowObject.id_proceso;	
            var id_area     = rowObject.id_area;	

            new_format_value = '<a href="javascript:void(0)" onclick="desvincular_proceso(\''+id_proceso+'\'+\''+','+id_area+'\')"><i class="fa fa-sign-out" style="color:orange"></i> Desvincular</a>'; 
            return new_format_value
            
        }//end function gridVinculados_FormatterDesvincular
        
    }//end function gridVinculados



    /**
     * 
     * desvincular proceso
     */
    function desvincular_colaborador(id){

        swal({
            title: "Desea desvincular el Colaborador ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                //token
                var csrftoken           = getCookie('csrftoken');
                $.ajax({
                    type: "POST",
                    url: "/removeColaborador/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id:id,
                    },
                    dataType: "json",
                    success: function(data) {
                        var mensaje=data.mensaje;
                        var codigo =data.resultado;
                        if (codigo=="ok_delete"){
                            //mensaje ok update
                            swal(mensaje, "", "success");
                            //refrescar pagina
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
            }//end if
        });


    }//end function desvincular_proceso



    /**
     * 
     * desvincular proceso
     */
    function desvincular_proceso(id_data){

        var array_id = id_data.split(',');
   
        var id_proceso  = array_id[0];
        var id_area     = array_id[1];
        
        
        swal({
            title: "Desea desvincular el Proceso ?",
            text:'Esto tambien desvinculara sus Colaboradores',
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                //token
                var csrftoken           = getCookie('csrftoken');
                $.ajax({
                    type: "POST",
                    url: "/removeVinculacion/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_proceso:id_proceso,
                        id_area:id_area,
                        datetime:datetimenow()
                    },
                    dataType: "json",
                    success: function(data) {
                        var mensaje=data.mensaje;
                        var codigo =data.resultado;
                        if (codigo=="ok_update"){
                            //mensaje ok update
                            swal(mensaje, "", "success");
                            //refrescar pagina
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
            }//end if
        });
        

    }//end function desvincular_proceso

    
    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalVincular #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertVinculacion();
                }
            });

        }

    }//END FUNCTION confirmarGrabar


    function insertVinculacion(){

        //token
        var csrftoken           = getCookie('csrftoken');
        var id_area     = $("#modalVincular #id_area").val();
        if(id_area == "" || id_area == null ){
            swal("Seleccione el area !", "", "info");
            return false
        }//end if

        //grid procesos
        var grid        = $("#gridProcesosArea");
        var rowKey      = grid.getGridParam("selrow");

        //validar seleccion
        if (!rowKey){
            swal("Seleccione un proceso !", "", "info");
            return false
        }else {

            //ids seleccionados
            var selectedIds         = grid.getGridParam("selarrrow");

            //array para data obtenida
            var procesos_arr_data   = new Array();

            //asignar los ids al arreglo
            for (var i = 0; i < selectedIds.length; i++) {
                element={}
                element.id_proceso  = selectedIds[i];
                element.id_area     = id_area;
                element.datetime    = datetimenow();
                procesos_arr_data.push(element);

            }//end for

        }//end if
        var data = { 
            gridProcesosIngresar:procesos_arr_data,
        }
        data = JSON.stringify(data); 


        $.ajax({
            type: "POST",
            url: "/insertVinculacion/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                data:data,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalVincular').modal('hide');
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


    }//end function insertVinculacion
    

    function cargarModalVincularColaboradores(){


        //mostrar modal
        $('#modalVincularColaboradores').modal({'show':true, backdrop: 'static', keyboard: false});

        $('#modalVincularColaboradores #accion').val("insert");

        //limpiar formulario
        document.getElementById('formVincularColaboradores').reset();
        //DESCARGAR GRID
        //$.jgrid.gridUnload("gridColaboradores");
        //gridColaboradores();

        $("#procesos").hide();
        cargarProcesos($(this).val());
        
        
    }//end function cargarModalVincularColaboradores



    /**
     * 
     *CARGAR PROCESOS POR AREA
     */
    function cargarProcesos(id_area){

        $("#procesos").show();
        
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
                        $("#modalVincularColaboradores #director").val(director[0]['id_personal_id']);
                    }


                    //remover opt
                    //$('#id_proceso').find('option:not(:first)').remove();
                    $('#id_proceso').find('option').remove()
                    //agregar nuevo valor opt
                    $.each(procesos, function (i, proceso) {
                        $('#id_proceso').append($('<option>', { 
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


/** 
* PERMITE CARGAR GRILLA PERSONAL POR CARGO
*/
   function gridColaboradores(){

    //DESCARGAR GRID
    $.jgrid.gridUnload("gridColaboradores");

    var csrftoken = getCookie('csrftoken');

    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
    $("#gridColaboradores").jqGrid({
        url:'/gridColaboradores/',
        postData: {
            csrfmiddlewaretoken : csrftoken,
            id_cargo : null, 
        },
        datatype: "json",
        //data: mydata,
        loadonce: true, 
        viewrecords: true,
        width: 550,
        height: 150,
        rowNum:1000,
        //colNames:['ID','NOMBRE', 'CARGO', 'proceso','PROCESO', 'procedimiento','PROCEDIMIENTO'],
        colNames:['ID','NOMBRE', 'CARGO', 'DETALLE'],
        colModel: [
          { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
          { label: 'nombre', name: 'nombre', width: 40, sorttype:"string", align:'center'},
          { label: 'cargo', name: 'cargo', width: 40, sorttype:"string", align:'center', formatter:gridColaboradores_FormatterCargo},
          //{ label: 'proceso_formatter', name: 'proceso_formatter', width: 35, sorttype:"string", align:'center', formatter:gridColaboradores_FormatterProceso},
          //{ label: 'procedimiento_formatter', name: 'procedimiento_formatter', width: 35, sorttype:"string", align:'center', formatter:gridColaboradores_FormatterProcedimiento},
          { label: 'btn_detalle', name: 'btn_detalle', width: 35, sorttype:"string", align:'center', formatter:gridColaboradores_FormatterDetalle},
        ],
        multiselect: true,
        //multiPageSelection: true,
        pager: '#pagerColaboradores',
        rownumbers: true,
        //caption: "Colaboradores",
        shrinkToFit: true,
        
        loadComplete: function () {
            var ts = this;
            if (ts.p.reccount === 0) {
                $(this).hide();
                emptyMsgDiv.show();
            } else {
                $(this).show();
                emptyMsgDiv.hide();
            }
        },
        onSelectRow: function(ids) {
            /*
            var dataFromTheRow = jQuery('#gridColaboradores').jqGrid ('getRowData', ids);
            var btn_detalle    = dataFromTheRow.btn_detalle;
            if(btn_detalle != null){
                //reset seleccion
                jQuery("#gridColaboradores").jqGrid('resetSelection', ids);
            }
            var proceso         = dataFromTheRow.proceso;
            var procedimiento   = dataFromTheRow.procedimiento;
            if(proceso){
                var select_proceso       = $("#modalVincularColaboradores #id_area option:selected").text();
                var select_procedimiento = $("#modalVincularColaboradores #id_proceso option:selected").text();

                if(select_proceso == proceso && select_procedimiento == procedimiento){
                    swal("El colaborador ya se encuentra vinculado al Proceso y Procedimiento seleccionado !!", "", "info");
                    jQuery("#gridColaboradores").jqGrid('resetSelection', ids);
                   return false;
                }//end if
                if (select_proceso =="" || select_proceso==null){
                    swal("Seleccione un Proceso !!", "", "info");
                    jQuery("#gridColaboradores").jqGrid('resetSelection', ids);
                    return false;
                }//end if
                if (select_procedimiento =="" || select_procedimiento==null){
                    swal("Seleccione un Procedimiento !!", "", "info");
                    jQuery("#gridColaboradores").jqGrid('resetSelection', ids);
                    return false;
                }//end if
            }else{
                return false;
            }
            */
        } 
    });
    //muestra el mensaje luego de cargar la grilla 
    emptyMsgDiv.insertAfter($("#gridColaboradores").parent());

    function gridColaboradores_FormatterProceso(cellvalue, options, rowObject){
        
        var proceso = rowObject.proceso;
        if (proceso == null){
            new_format_value = "<span class='badge bg-aqua'>Sin designar<span>";
        }else{
            new_format_value = proceso;
        }//end if
        return new_format_value;

    }//end function gridColaboradores_FormatterProceso


    function gridColaboradores_FormatterProcedimiento(cellvalue, options, rowObject){

        var procedimiento = rowObject.procedimiento;
        if (procedimiento == null){
            new_format_value = "<span class='badge bg-red'>Sin designar<span>";
        }else{  
            new_format_value = procedimiento;
        }//end if
        return new_format_value;

    }//end function gridColaboradores_FormatterProcedimiento

    function gridColaboradores_FormatterCargo(cellvalue, options, rowObject){
        var cargo = rowObject.cargo;
        new_format_cargo = "<span class='badge bg-green'>" + cargo + "<span>";
        return new_format_cargo;
    }//end function gridColaboradores_FormatterCargo

    //Detalle
    function gridColaboradores_FormatterDetalle(cellvalue, options, rowObject){

        var id_personal = rowObject.id;

        new_format_cargo = '<a href="javascript:void(0)" onclick="javascript:consultar_procedimientos('+id_personal+');"><i class="fa fa-eye" style="color:green"></i> Abrir</a>';
        return new_format_cargo;

    }//end function gridColaboradores_FormatterDetalle

}//end function gridPersonal



/**
 * CONFIRMAR GRABAR COLABORADORES
 */
function confirmarGrabarColaboradores(){

    var accion = $('#modalVincularColaboradores #accion').val();
    if(accion == "insert"){
        swal({
            title: "Desea insertar los Datos ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                insertColaboradores();
            }
        });

    }

}//end function confirmarGrabarColaboradores


function insertColaboradores(){

    var id_area = $("#modalVincularColaboradores #id_area").val();
    if (id_area =="" || id_area== null ){
        swal("Seleccione un Area !", "", "info");
        return false;
    }//end if
    var id_proceso = $("#modalVincularColaboradores #id_proceso").val();
    if (id_proceso =="" || id_proceso== null ){
        swal("Seleccione un Proceso !", "", "info");
        return false;
    }//end if

    var director = $("#modalVincularColaboradores #director").val();
    if (director =="" || director== null ){
        swal("Seleccione el Director de Área !!", "", "info");
        return false;
    }//end if

    var colaborador = $("#modalVincularColaboradores #colaborador").val();
    if (colaborador =="" || colaborador== null ){
        swal("Seleccione un Colaborador !!", "", "info");
        return false;
    }//end if

    var lider_norma = $("#modalVincularColaboradores #lider_norma").val();
    if (lider_norma =="" || lider_norma== null ){
        swal("Seleccione el Líder de Norma !!", "", "info");
        return false;
    }//end if

/*
    //grid Colaboradores
    var grid        = $("#gridColaboradores");
    var rowKey      = grid.getGridParam("selrow");

    //validar seleccion
    if (!rowKey){
        swal("Seleccione un Colaborador !", "", "info");
        return false
    }else {

        //ids seleccionados
        var selectedIds         = grid.getGridParam("selarrrow");
        total_seleccionados = selectedIds.length;
        

        if(total_seleccionados != 3){
            swal("Colaboradores Faltantes !", " Debe Vincular: Director de Area,  Lider de Norma, Colaborador", "warning");
            return false;
        }


        //array para data obtenida
        var colaboradores_arr_data   = new Array();

        //asignar los ids al arreglo
        for (var i = 0; i < selectedIds.length; i++) {
            element={}
            element.id_pesonal  = selectedIds[i];
            element.id_area     = id_area;
            element.id_proceso  = id_proceso;
            colaboradores_arr_data.push(element);
        }//end for

    }//end if


    var data={
        gridColaboradores:colaboradores_arr_data,
    }
    data = JSON.stringify(data)
 */


    var csrftoken = getCookie('csrftoken');
    $.ajax({
        type: "POST",
        url: "/vincular_colaboradores/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            //data:data,
            id_area:id_area,
            id_proceso:id_proceso,
            director:director,
            colaborador:colaborador,
            lider_norma:lider_norma,
        },
        dataType: "json",
        success: function(data) {
            var mensaje                 = data.mensaje;
            var codigo                  = data.resultado;

            if (codigo=="ok_insert"){

                //ocultar modal
                $('#modalVincularColaboradores').modal('hide');
                //mensaje exitoso update
                swal(mensaje, "", "success");
                //reset
                location.reload();
            }

            if(codigo=="no_ok"){
                //mensaje exitoso update
                swal(mensaje, data.personal, "error");
                 //ocultar modal
                 $('#modalVincularColaboradores').modal('hide');
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


}//end function insertColaboradores


function selecColaborador(){

    $('#modalVincularColaboradores').modal({'show':true, backdrop: 'static', keyboard: false});
    //DESCARGAR GRID
    $.jgrid.gridUnload("gridColaboradores");
    gridColaboradores();
    
    $('#id_cargo').val(sessionStorage.getItem('id_cargo')).trigger('change');


    jQuery('#gridColaboradores').setGridParam( {gridComplete:function()
    {
        var grid = jQuery('#gridColaboradores');
        grid.setSelection(sessionStorage.getItem('id_personal'),true);
       //eliminar variables de session
        sessionStorage.removeItem('id_cargo')
        sessionStorage.removeItem('id_personal')
    }
    });

    
}//end funcion selecColaborador





    function consultar_procedimientos(id_pesonal){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
          type: "POST",
          url: "/consultarprocedimientos_vinculados/",
          data:{
          csrfmiddlewaretoken : csrftoken,
          id_pesonal:id_pesonal,
          },
          dataType: "json",
          success: function(data) {
          codigo = data.resultado;

          if(codigo == 'ok_select'){
              data = data.data;
              html = "<table border='2'>";
              html = html + "<tr>";
              html = html + "<th class='text-center'><strong>Proceso</strong></th>"
              html = html + "<th><strong>Procedimiento</strong></th>"
              html = html + "</tr>";
              for(i=0; i<data.length; i++){
                //agregar data procesos/procedimientos
                html = html + "<tr>";
                html = html + "<td>"+data[i]['area']+"</td>"
                html = html + "<td>"+data[i]['proceso']+"</td>"
                html = html + "</tr>";
              }//end for
              html = html + "</table>"
          }else{
              html=data.mensaje;
          }

          $("#lista_procedimientos").html(html);
          //inicializar dialog
          $("#dialogVinculados").dialogResize({
              position: { my: "center", at: "center "},
              closeOnEscape: false,
              width: 410,
              height: 250,
              autoOpen: true,
              modal: true
          });
          //sobre una ventana modal
          $(".ui-dialog").css({
            zIndex: '1060',
          });
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

    }//end function consultar_procedimientos
