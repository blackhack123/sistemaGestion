

    //autocargar funcion
    window.onload = gridAuditores;

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
     * PERMITE CARGAR GRILLA DE areas
    */
   function gridAuditores(){

    var csrftoken = getCookie('csrftoken');
    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Auditores designados !!</span></div>");
    $("#gridAuditores").jqGrid({
        url:'/gridAuditores/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
        },
        datatype: "json",
        //data: mydata,
        loadonce: true, 
        viewrecords: true,
        width: 950,
        height: 400,
        rowNum:1000,
        colNames:['ID', 'id_area_id', 'id_auditor_id', 'id_norma_id', 'id_proceso_id', 'AUDITOR', 'NORMA', 'CLÁUSULA', 'PROCESO', 'PROCEDIMIENTO', 'DESVINCULAR'],
        colModel: [
            { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
            { label: 'id_area_id', name: 'id_area_id', width: 20, sorttype:"integer", align:'center', hidden:true},
            { label: 'id_auditor_id', name: 'id_auditor_id', width: 20, sorttype:"integer", align:'center', hidden:true},
            { label: 'id_norma_id', name: 'id_norma_id', width: 20, sorttype:"integer", align:'center', hidden:true},
            { label: 'id_proceso_id', name: 'id_proceso_id', width: 50, sorttype:"integer", align:'center', hidden:true},
            { label: 'auditor', name: 'auditor', width: 50, sorttype:"string", align:'center'},
            { label: 'norma', name: 'norma', width: 50, sorttype:"string", align:'center'},
            { label: 'clausula', name: 'clausula', width: 18, sorttype:"string", align:'center'},
            { label: 'area', name: 'area', width: 40, sorttype:"string", align:'center'},
            { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center'},
            { name:'btn_desvincular' , width:25, align:"center", formatter:gridAuditores_FormatterDesvincular },
        ],
        pager: '#pagerAuditores',
        rownumbers: true,
        caption: "Auditores Vinculados",
        shrinkToFit: true,
        grouping: true,
        groupingView: {
            groupField: ["auditor"],
            groupColumnShow: [false, false],
            groupText: [
                "<strong>Auditor :</strong> <span class='badge bg-blue'>{0}</span>",
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
    var groupingView = $("#gridAuditores").jqGrid("getGridParam", "groupingView"),
    plusIcon = groupingView.plusicon,
    minusIcon = groupingView.minusicon;
    $("#gridAuditores").click(function (e) {
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
    emptyMsgDiv.insertAfter($("#gridAuditores").parent());

    //funcion Buscar
    var timer;
    $("#search_cells").on("keyup", function() {
        var self = this;
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(function(){
            //timer = null;
            $("#gridAuditores").jqGrid('filterInput', self.value);
        },0);
    });



    function gridAuditores_FormatterDesvincular(cellvalue, options, rowObject){

	
        var id  = rowObject.id;
        
        
        new_format_value = '<a href="javascript:void(0)" onclick="desvincular_auditor('+id+')"><i class="fa fa-sign-out" style="color:orange"></i> Desvincular</a>'; 
        
        return new_format_value
        
    }//end function gridAuditores_FormatterDesvincular



}//end function gridAuditores


    function desvincular_auditor(id){
        
        swal({
            title: "Desea desvincular el Auditor del Procedimiento ?",
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
                    url: "/removeAuditor/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id:id,
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
            }else{
                return false;
            }
        });


    }//end function desvincular_auditor


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




    /*********************************************/
    /**FUNCION cargarModal Areas *****************/
    /*********************************************/

    function cargarModalAuditor(){

        //mostrar modal
        $('#modalAuditor').modal({'show':true, backdrop: 'static', keyboard: false});

        $('#modalAuditor #accion').val("insert");
        //limpiar formulario
        document.getElementById('formAuditor').reset();

        //DESCARGAR GRID
        $.jgrid.gridUnload("gridProcesosDesignados");
        $.jgrid.gridUnload("gridColaboradores");


    }//end funcion cargarModalArea



    /** 
    * PERMITE CARGAR GRILLA PERSONAL POR CARGO
    */
   function gridColaboradores(id_cargo){
    
    //DESCARGAR GRID
    $.jgrid.gridUnload("gridColaboradores");

    var csrftoken = getCookie('csrftoken');

    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
    $("#gridColaboradores").jqGrid({
        url:'/gridColaboradores/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
            id_cargo:id_cargo,
        },
        datatype: "json",
        //data: mydata,
        loadonce: true, 
        viewrecords: true,
        width: 400,
        height: 150,
        rowNum:200,
        colNames:['ID','NOMBRE'],
        colModel: [
            { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
            { label: 'nombre', name: 'nombre', width: 60, sorttype:"string", align:'center'},
            //{ label: 'area', name: 'area', width: 60, sorttype:"string", align:'center', formatter:gridColaboradores_FormatterArea},

        ],
        multiselect: true,
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
           
    });
    //muestra el mensaje luego de cargar la grilla 
    emptyMsgDiv.insertAfter($("#gridColaboradores").parent());



}//end function gridPersonal



    /** 
    * PERMITE CARGAR GRILLA PROCESOS POR NORMA
    */
   function gridProDesignados(id_norma){
    
    //DESCARGAR GRID
    $.jgrid.gridUnload("gridProcesosDesignados");

    var csrftoken = getCookie('csrftoken');

    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Procesos Designados !!</span></div>");
    $("#gridProcesosDesignados").jqGrid({
        url:'/gridProDesignados/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
            id_norma:id_norma,
        },
        datatype: "json",
        loadonce: true, 
        viewrecords: true,
        width: 410,
        height: 150,
        rowNum:10,
        colNames:['id','id_area_id','id_proceso_id','id_norma_id','PROCESO','PROCEDIMIENTO', 'id_clausula' ,'CLÁUSULA', ''],
        colModel: [
            { label: 'id', name: 'id', width: 20, sorttype:"integer", hidden:true},
            { label: 'id_area_id', name: 'id_area_id', width: 20, sorttype:"integer", hidden:true},
            { label: 'id_proceso_id', name: 'id_proceso_id', width: 60, sorttype:"integer", hidden:true},
            { label: 'id_norma_id', name: 'id_norma_id', width: 60, sorttype:"integer", hidden:true},
            { label: 'area', name: 'area', width: 60, sorttype:"string", align:'center'},
            { label: 'proceso', name: 'proceso', width: 60, sorttype:"string", align:'center'},
            { label: 'id_clausula', name: 'id_clausula', width: 30, sorttype:"string", align:'center', hidden:true},
            { label: 'clausula', name: 'clausula', width: 30, sorttype:"string", align:'center'},
            { name: 'btn_detalle', width: 15, sorttype:"string", align:'center', formatter:gridClausulasFormatterDetalle},

        ],
        pager: '#pagerProcesosDesignados',
        rownumbers: true,
        //caption: "Colaboradores",
        shrinkToFit: true,
        multiselect: true,
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
           
    });
    //responsive jqgrid
    $(window).on("resize", function () {
        var $grid = $("#gridProcesosDesignados"),
            newWidth = $grid.closest(".ui-jqgrid").parent().width();
        $grid.jqGrid("setGridWidth", newWidth, true);
    });
    //muestra el mensaje luego de cargar la grilla 
    emptyMsgDiv.insertAfter($("#gridProcesosDesignados").parent());

    function gridClausulasFormatterDetalle(cellvalue, options, rowObject){

        var id_clausula             = rowObject.id_clausula;

        new_format_value = '<a href="javascript:void(0)" onclick="consultarDetalle(\''+id_clausula+'\')"><i class="fa fa-envelope-o" style="color:orange"></i></a>';

        return new_format_value

    }//end function gridClausulasFormatterDetalle

}//end function gridProDesignados


function consultarDetalle(id_clausula){

  //token
  var csrftoken = getCookie('csrftoken');
  $.ajax({
      type: "POST",
      url: "/selectClausula/",
      data:{
          csrfmiddlewaretoken : csrftoken,
          id_clausula:id_clausula,
      },
      dataType: "json",
      success: function(data) {
          var mensaje=data.mensaje;
          var codigo =data.resultado;
          if (codigo=="ok_select"){
              //mensaje ok update
            var clausula    = data.clausula_list;
            var descripcion = clausula.descripcion;
            var html ='<h4><strong>Clausula '+clausula.clausula+'</strong></h4>'+descripcion;
            $("#detalle_clausula").html(html);
            //inicializar dialog
            $("#dialogDetalleClausula").dialogResize({
                position: { my: "center", at: "center "},
                closeOnEscape: false,
                width: 400,
                height: 300,
                autoOpen: true,
                modal: true
            });
            //sobre una ventana modal
            $(".ui-dialog").css({
              zIndex: '1060',
            });
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
}//end function consultarDetalle



    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalAuditor #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertAuditor();
                }else{
                    return false;
                }
            });
        }

    }//END FUNCTION confirmarGrabar


    /**
     * INSERTAR AUDITORES
     */
    function insertAuditor(){
        
        //VALIDAMOS SELECCION GRID PROCESOS
        var grid = $("#gridColaboradores");
        var rowKey = grid.getGridParam("selrow");
        if (!rowKey){
            swal("Seleccione un Auditor !!", "", "info");
            return false;
        }//end if

        var id_norma    = $("#modalAuditor #id_norma").val();
        if( id_norma == "" || id_norma == null ){
            swal("Seleccione una Norma !", "", "info");
            return false;
        }//end if

        //IDS AUDITORES 
        var mygrid= $('#gridColaboradores');
        //DATA SELECCIONADA AUDITORES
        Auditores_arr_data = grid.getGridParam("selarrrow");
        
        //data procesos designados
        //ProcesosDesignados_arr_data = $('#gridProcesosDesignados').jqGrid('getGridParam','data');

        //id grilla procesos
        var mygrid_procesos             = $('#gridProcesosDesignados');
        
        ProcesosDesignados_arr_data = new Array();
        
        var i, selRowIds = mygrid_procesos.jqGrid("getGridParam", "selarrrow"), n, rowData;
        //se obtiene la data seleccionada
        for (i = 0, n = selRowIds.length; i < n; i++) {
            var element ={}
            rowData = mygrid_procesos.jqGrid("getLocalRow", selRowIds[i]);
            ProcesosDesignados_arr_data.push(rowData);
        }//end for
        
        
        //TOTALES
        total_idsAuditores  = Auditores_arr_data.length;
        total_procesos      = ProcesosDesignados_arr_data.length;
        console.log(ProcesosDesignados_arr_data);

        //preparamos el buffer 
        var arrData = new Array();


        //Se arma el buffer para el ingreso

        //SI TOTAL AUDITORES ES MAYOR QUE EL NUMERO DE PROCESOS SELECCIONADOS
        if( total_idsAuditores > total_procesos ){

            for(i=0; i < total_procesos; i++){

                for(j=0; j < total_idsAuditores; j++){

                    var element={}
                    element.proceso_clausula    = ProcesosDesignados_arr_data[i]['id'];
                    element.id_area             = ProcesosDesignados_arr_data[i]['id_area_id'];
                    element.id_norma            = ProcesosDesignados_arr_data[i]['id_norma_id'];
                    element.id_proceso          = ProcesosDesignados_arr_data[i]['id_proceso_id'];
                    element.id_auditor          = Auditores_arr_data[j];

                    arrData.push(element);
                }//end for   

            }//end for
            
        }//end if
        
        //SI TOTAL AUDITORES ES MAYOR QUE EL NUMERO DE PROCESOS SELECCIONADOS
        if( total_procesos > total_idsAuditores ){

            for(i=0; i < total_idsAuditores; i++){
                for(j=0; j < total_procesos; j++){
                    var element={}

                    element.proceso_clausula    = ProcesosDesignados_arr_data[j]['id'];
                    element.id_area             = ProcesosDesignados_arr_data[j]['id_area_id'];
                    element.id_norma            = ProcesosDesignados_arr_data[j]['id_norma_id'];
                    element.id_proceso          = ProcesosDesignados_arr_data[j]['id_proceso_id'];
                    element.id_auditor          = Auditores_arr_data[i];
                    
                    arrData.push(element);
                }//endfor
            }//end for

        }//end if

        //SI LOS PROCESOS SELECCIONADOS Y LOS AUDITORES SON SIMILARES
        if (total_procesos == total_idsAuditores ){
            
            for(i=0; i < total_idsAuditores; i++){

                var element={}

                element.proceso_clausula    = ProcesosDesignados_arr_data[i]['id'];
                element.id_area             = ProcesosDesignados_arr_data[i]['id_area_id'];
                element.id_norma            = ProcesosDesignados_arr_data[i]['id_norma_id'];
                element.id_proceso          = ProcesosDesignados_arr_data[i]['id_proceso_id'];
                element.id_auditor          = Auditores_arr_data[i];
                
                arrData.push(element);
            }//endfor

        }//end if
        console.log(arrData);
        var data ={
            gridData:arrData,
        }
        data = JSON.stringify(data);

        
        //token
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/insertAuditor/",
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
                if(codigo == "no_ok"){
                    var auditor = data.auditor_list;
                    swal('El Auditor ('+auditor.auditor+')', "ya se encuentra vinculado a "+auditor.proceso, "error");
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
        })

    }//end if insertAuditor

