
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


    //autocargar funcion
    window.onload = gridNormasVinculadas;



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
     * CARGAR MODAL DE VINCULACION
     */
    function cargarModalVincularNorma(){

        //mostrar modal
        $('#modalvincularNorma').modal({'show':true, backdrop: 'static', keyboard: false});
   
        //determino la accion
        $('#modalvincularNorma #accion').val("insert");

        //limpiar formulario
        document.getElementById('formVincularNorma').reset();

        //descargamos las grillas procesos y clausulas
        $.jgrid.gridUnload("gridProcesosNorma");
        $.jgrid.gridUnload("gridClausulas");

    }//end function cargarModalVincularNorma



    /**
     * 
     * CARGA GRID PROCESOS POR AREA(ID)
     */
    function cargarProcesosPorIdArea(idArea){
        
        var id_area     = idArea;
        //DESCARGAR GRID
        $.jgrid.gridUnload("gridProcesosNorma");
        //CARGAR GRID CON NUEVA DATA
        cargarGridProcesos(id_area);

    }//end function cargarProcesosPorIdArea




    /**
     * 
     * CARGA GRID DE PROCESOS EN BASE AL AREA (ID)
     */
    function cargarGridProcesos(id_area){
        
        var csrftoken = getCookie('csrftoken');
        //emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Procesos vinculados con dicha Area !!</span></div>");
        $("#gridProcesosNorma").jqGrid({
            url:'/gridVincularProcesos',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
                id_area:id_area,
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 350,
            height: '100%',
            rowNum:10,
            multiselect: true,
            colNames:['ID', 'PROCEDIMIENTOS'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'proceso', name: 'proceso', width: 20, sorttype:"string", align:'center'},
            ],
            pager: '#pagerProcesosNorma',
            rownumbers: true,
            caption: "Procedimientos",
            shrinkToFit: true,
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    swal("No existen Procedimientos vinculados al Proceso seleccionado !!", "", "warning");
                    //emptyMsgDiv.show();
                } else {
                    $(this).show();
                    //emptyMsgDiv.hide();
                    
                }
            },
                
        });
    
        //muestra el mensaje luego de cargar la grilla 
        //emptyMsgDiv.insertAfter($("#gridProcesosNorma").parent());

 

    }//end function cargarGridProcesos




    /**
     * 
     * CARGA GRID CLAUSULAS POR NORMA(ID)
     */
    function cargarClausulasPorNorma(id_norma){
        
        //var id_area     = idArea;
        //DESCARGAR GRID
        $.jgrid.gridUnload("gridClausulas");
        //CARGAR GRID CON NUEVA DATA
        cargarGridClausulas(id_norma);

    }//end function cargarClausulasPorNorma


    /**
     * 
     * CARGA GRID DE CLAUSULAS POR NORMA
     */
    function cargarGridClausulas(id_norma){
        
        var csrftoken = getCookie('csrftoken');
        //emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Clausulas vinculadas con dicha Norma !!</span></div>");
        $("#gridClausulas").jqGrid({
            url:'/gridVinClausulas',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
                id_norma:id_norma,
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 440,
            height: '100%',
            rowNum:10,
            multiselect: true,
            colNames:['ID', 'CLÁUSULA','DETALLE'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'clausula', name: 'clausula', width: 40, sorttype:"string", align:'left'},
                { name: 'btn_detalle', width: 10, sorttype:"string", align:'center', formatter:gridClausulasFormatterDetalle},
            ],
            pager: '#pagerClausulas',
            rownumbers: true,
            caption: "Clausulas",
            shrinkToFit: true,
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    //emptyMsgDiv.show();
                } else {
                    $(this).show();
                    //emptyMsgDiv.hide();
                    
                }
            },
                
        });

        function gridClausulasFormatterDetalle(cellvalue, options, rowObject){
    
            var id             = rowObject.id;	
            
            new_format_value = '<a href="javascript:void(0)" onclick="consultarDetalle(\''+id+'\')"><i class="fa fa-eye" style="color:orange"></i> Detalle</a>'; 
            
            return new_format_value
            
        }//end function gridNormasVinculados_FormatterDesvincularClausula
    
        //muestra el mensaje luego de cargar la grilla 
        //emptyMsgDiv.insertAfter($("#gridProcesosNorma").parent());
    

    }//end function cargarGridProcesos


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
                var html = "<h4><strong> Clausula "+clausula.clausula+"</strong></h4>"+ descripcion;
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
                /*
                var win         = window.open("", "Detalle", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
                //win.document.body.innerHTML = "<h4>"+clausula.clausula+"</h4>"+ descripcion;
                win.document.body.innerHTML = descripcion;
                */
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



/*
    function confirmarGrabar(){

        var accion = $('#modalvincularNorma #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertVinculoNorma();
                }
            });
        }

    }//END FUNCTION GRABAR DATA
*/


    /**
     * FUNCTION INSERTAR CLAUSULAS-PROCESOS
     */
    function insertVinculoNorma(){
        
        var id_area     = $("#modalvincularNorma #id_area").val();
        if( id_area == "" || id_area == null ){
            swal("Seleccione un Proceso !", "", "info");
            return false;
        }//end if

        var id_norma    = $("#modalvincularNorma #id_norma").val();
        if( id_norma == "" || id_norma == null ){
            swal("Seleccione una Norma !", "", "info");
            return false;
        }//end if

        //VALIDAMOS SELECCION GRID PROCESOS
        var grid = $("#gridProcesosNorma");
        var rowKey = grid.getGridParam("selrow");
        if (!rowKey){
            swal("Seleccione un Procedimiento !", "", "info");
            return false;
        }//end if

        //VALIDAMOS SELECCION GRID CLAUSULAS
        var grid = $("#gridClausulas");
        var rowKey = grid.getGridParam("selrow");
        if (!rowKey){
            swal("Seleccione una Clausula !", "", "info");
            return false;
        }//end if



        //IDS SELECCIONADOS
        var idsProcesos     = $('#gridProcesosNorma').getGridParam("selarrrow");
        var idsClausulas    = $('#gridClausulas').getGridParam("selarrrow");

        //totales de procesos y clausulas
        var totalProcesos   = idsProcesos.length;
        var totalClausulas  = idsClausulas.length;

        //preparamos el buffer 
        var arrData = new Array();

        //Se arma el buffer
        // Se realizara si el numero de procesos y clausulas
        // seleccionadas son iguales
        if (totalProcesos == totalClausulas ){

            total_ciclo = totalProcesos + totalClausulas;

            //asignando la data a element
            for(j=0; j< totalProcesos; j++){

                for(i=0; i< totalClausulas; i++){
                    var element={}
                    element.id_area         = id_area;
                    element.id_norma        = id_norma;
                    element.id_proceso      = idsProcesos[j];
                    element.id_clausula     = idsClausulas[i];
                    arrData.push(element);
                }
            }

        }//end if
        

        // Se realizara si el numero de procesos seleccionados
        // es mayor al de las clausulas

        if( totalProcesos > totalClausulas ){

            for(i=0; i < totalClausulas; i++){

                for(j=0; j < totalProcesos; j++){

                    var element={}

                    element.id_area         = id_area;
                    element.id_norma        = id_norma;
                    element.id_proceso      = idsProcesos[j];
                    element.id_clausula     = idsClausulas[i];

                    arrData.push(element);
                }//end for   

            }//end for
            
        }//end if


        // Se realizara solo si el numero de clausulas 
        // seleccionadas es mayor al numero de procesos 
        if( totalClausulas > totalProcesos ){
        
            for(i=0; i < totalProcesos; i++){

                for(j=0; j < totalClausulas; j++){

                    var element={}

                    element.id_area         = id_area;
                    element.id_norma        = id_norma;
                    element.id_proceso      = idsProcesos[i];
                    element.id_clausula     = idsClausulas[j];

                    arrData.push(element);

                }//end for   

            }//end for
            
        }//end if
        console.log(arrData);
        //token
        var csrftoken = getCookie('csrftoken');
        var data = {
            gridData: arrData,
        }

        //se convierte a JSON la data para mejor manejo en python/Django
        data = JSON.stringify(data)

        $.ajax({
            type: "POST",
            url: "/insertVinculoNormas/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                data:data,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                var mensaje = data.mensaje;
                var proceso= data.proceso;
                if (codigo=="ok_insert"){
                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //recargar pagina
                    location.reload();

                }//end if
                if(codigo=="no_ok"){
                    //mensaje ok update
                    swal("No pude ser guardados los datos.. El proceso: "+data.proceso+" ya se encuentra Vinculado !!", "","error");
                    return false;
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


    }//end function insertVinculoNorma



    function gridNormasVinculadas(){


        var csrftoken = getCookie('csrftoken');
        //emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Normas Vinculadas !!</span></div>");
        $("#gridNormasVinculadas").jqGrid({
            url:'/gridVinculadoNormas/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 950,
            height: 230,
            rowNum:100,
            colNames:['ID','ID_AREA','ID_PROCESO', 'ID_NORMA','ID_CLAUSULA', 'AREA', 'PROCESO', 'NORMA', 'CLÁUSULA', '<span class="badge bg-red">CLÁUSULA</span>','<span class="badge bg-red">PROCESO</span>'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'id_area_id', name: 'id_area_id', width: 15, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_proceso_id', name: 'id_proceso_id', width: 15, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_norma_id', name: 'id_norma_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_clausula_id', name: 'id_clausula_id', width: 15, sorttype:"integer", align:'center', hidden:true},
                { label: 'area', name: 'area', width: 30, sorttype:"string", align:'center'},
                { label: 'proceso', name: 'proceso', width: 30, sorttype:"string", align:'left'},
                { label: 'nombre_norma', name: 'nombre_norma', width: 60, sorttype:"string", align:'center'},
                { label: 'clausula', name: 'clausula', width: 100, sorttype:"string", align:'left'},
                { name:'btn_desvincular_clausula' , width:25, align:"center", formatter:gridNormasVinculados_FormatterDesvincularClausula },
                { name:'btn_desvinculacionTotal' , width:25, align:"center", formatter:gridNormasVinculados_FormatterDesvincularTodo },
                //{ name:'btn_report_PdfNorma' , width:10, align:"center", formatter:gridNormas_FormatterReporte},
            ],
            pager: '#pagerNormasVinculadas',
            rownumbers: true,
            caption: "Normas Vinculadas",
            shrinkToFit: true,
            grouping: true,
            groupingView: {
                groupField: ["area", 'proceso'],
                groupColumnShow: [false, false],//set (false, true) para ocultar nombre grupo
                groupText: [
                    "<strong>Proceso:<strong> <span class='badge bg-green'>{0}</span>" ,
                    "<strong>Procedimiento:<strong> <span class='badge bg-yellow'>{0}</span>" ,
                ],
                groupOrder: ["desc", 'desc'],
                groupCollapse: true
            },
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                   // emptyMsgDiv.show();
                    desabilitarReportes();
                } else {
                    $(this).show();
                    //emptyMsgDiv.hide();
                }
            },
                
        });
        var grid = $("#gridNormasVinculadas");
        grid.setGridParam({
            onSortCol: function (index, iCol, sortorder) {
                wait();
                curSort = index;
                curDir = (sortorder == 'desc');
                loadGrid(expanded ? null : 15);
                return 'stop'; // <--- Problem
            }
        });
        //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
        var groupingView = $("#gridNormasVinculadas").jqGrid("getGridParam", "groupingView"),
        plusIcon = groupingView.plusicon,
        minusIcon = groupingView.minusicon;
        $("#gridNormasVinculadas").click(function (e) {
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
        //AGRUPA HEADERS JQGRID
        jQuery("#gridNormasVinculadas").jqGrid('setGroupHeaders', {
            useColSpanStyle: true, 
            groupHeaders:
            [
              {startColumnName: 'btn_desvincular_clausula', numberOfColumns: 2, titleText: '<span class="badge bg-yellow">DESVINCULAR</span>'},
            ]   
          });
    
    
        //muestra el mensaje luego de cargar la grilla 
        //emptyMsgDiv.insertAfter($("#gridNormasVinculadas").parent());
    
        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridNormasVinculadas").jqGrid('filterInput', self.value);
            },0);
        });
    
        
        function gridNormasVinculados_FormatterDesvincularClausula(cellvalue, options, rowObject){
    
            var id             = rowObject.id;	
            
            new_format_value = '<a href="javascript:void(0)" onclick="desvincular_clausula(\''+id+'\')"><i class="fa fa-sign-out" style="color:orange"></i> Cláusula</a>';
            
            return new_format_value
            
        }//end function gridNormasVinculados_FormatterDesvincularClausula
    
    
        function gridNormasVinculados_FormatterDesvincularTodo(cellvalue, options, rowObject){
    
            var id_norma_id              = rowObject.id_norma_id;	
            var id_proceso_id              = rowObject.id_proceso_id;	


            new_format_value = '<a href="javascript:void(0)" onclick="desvincular_proceso('+id_norma_id+','+id_proceso_id+');"><i class="fa fa-sign-out" style="color:orange"></i> Proceso</a>'; 
            
            return new_format_value
            
        }//end function gridNormasVinculados_FormatterDesvincularTodo


    }//end function gridNormasVinculadas



    /**
     * 
     * DESVINCULA CLA CLAUSULA DE UN PROCESO
     */
    function desvincular_clausula(id_proceso){
        

        swal({
            title: "Desea desvincular esta clausula ?",
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
                    url: "/desvincularNormaProceso/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_proceso:id_proceso,
                    },
                    dataType: "json",
                    success: function(data) {
                        var mensaje=data.mensaje;
                        var codigo =data.resultado;
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


    }//END FUNCTION 


    function desvincular_proceso(id_norma, id_proceso){

        swal({
            title: "Desea desvincular todo el Proceso ?",
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
                    url: "/desvincularNormasProcesos/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        id_norma:id_norma,
                        id_proceso:id_proceso,
                    },
                    dataType: "json",
                    success: function(data) {
                        var mensaje=data.mensaje;
                        var codigo =data.resultado;
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
    }//end function desvincular_proceso
