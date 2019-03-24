

    //autocargar funcion
    window.onload = gridAreas;

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
     * PERMITE CARGAR GRILLA DE areas
    */
    function gridAreas(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridAreas").jqGrid({
            url:'/gridAreas/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            //data: mydata,
            loadonce: true, 
            viewrecords: true,
            width: 850,
            height: 230,
            rowNum:100,
            colNames:['ID','PROCESO','DESCRIPCIÓN', 'ENCARGADO', 'TIPO DE PROCESO','','ESTADO', ''],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'area', name: 'area', width: 45, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'descripcion', name: 'descripcion', width: 90, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'encargado', name: 'encargado', width: 40, sorttype:"string", align:'center'},
                { label: 'tipo_proceso', name: 'tipo_proceso', width: 40, sorttype:"string", align:'center', formatter: gridAreas_FormatterTipo},
                { label: 'estado', name: 'estado', width: 15, sorttype:"string", align:'center', hidden:true},
                { label: 'estadoA', name: 'estadoA', width: 25, sorttype:"string", align:'center', formatter: gridAreas_FormatterEstado},
                { name:'btn_editar_Area' , width:10, align:"center", formatter:gridAreas_FormatterEdit },
            ],
            pager: '#pagerAreas',
            rownumbers: true,
            caption: "Procesos",
            shrinkToFit: true,

            //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
            ondblClickRow: function (rowid,iRow,iCol,e) {
               
                //get data seleccionada
                var data = $('#gridAreas').getRowData(rowid);	
                //asignar a variables la data
                var id              = data.id;
                consultar_area(id);
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
                
        });
        // the bindKeys() 
        //$("#gridAreas").jqGrid('bindKeys');
        //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
        var groupingView = $("#gridAreas").jqGrid("getGridParam", "groupingView"),
        plusIcon = groupingView.plusicon,
        minusIcon = groupingView.minusicon;
        $("#gridAreas").click(function (e) {
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
        emptyMsgDiv.insertAfter($("#gridAreas").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridAreas").jqGrid('filterInput', self.value);
            },0);
        });

        function gridAreas_FormatterEstado(cellvalue, options, rowObject)
        {	

            if(rowObject.estado == "1"){

                new_format_value = '<span class="badge bg-green">Activo</span>';
                return new_format_value;
            }else{

                new_format_value = '<span class="badge bg-red">Inactivo</span>';
                return new_format_value;

            }//end if

        }//end function gridBodegas_FormatterEstado


        
        function gridAreas_FormatterEdit(cellvalue, options, rowObject){

            var id              = rowObject.id;	
            
            new_format_value = '<a href="javascript:void(0)" onclick="consultar_area(\''+id+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i></a>'; 
            
            return new_format_value
            
        }//end function gridBodegas_FormatterEdit


        function gridAreas_FormatterTipo(cellvalue, options, rowObject){
            
            var tipo_proceso = rowObject.tipo_proceso;
            
            new_format_tipo = '<span class="badge bg-aqua">' + tipo_proceso + '</span>'; 
            
            return new_format_tipo

        }//end function gridAreas_FormatterTipo

    }//end function gridAreas



    /**
     * 
     * CONSULTAR AREA POR ID
     */
    function consultar_area(id){

        var id_area     = id;
        
        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectArea/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_area:id_area,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    mostrarAreaExistente(data.personal, data.area_list);
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

    }//end function consultar_area por id


    /**
     * 
     * MUESTRA AREA EXISTENTE
     */
    function mostrarAreaExistente(personal, area_list){
        
        //asignar data a variables
        var id              = area_list.id;
        var area            = area_list.nombre;
        var descripcion     = area_list.descripcion;
        var id_personal     = area_list.id_personal;
        var estado          = area_list.estado;
        var id_cargo        = personal[0]['id_cargo_id'];
        var tipo_proceso    = area_list.tipo_proceso;

        //asignar data existente a modal
        $('#modalArea #idArea').val(id);
        $('#modalArea #accion').val("update");
        $('#modalArea #carpeta_anterior').val(area);
        $('#modalArea #tipo_anterior').val(tipo_proceso);

        $('#modalArea #nombre').val(area);
        $('#modalArea #descripcion').val(descripcion);
        $('#modalArea #id_cargo').val(id_cargo);
        //remover opt
        $('#id_personal').find('option:not(:first)').remove();
        //agregar nuevo valor opt
        $.each(personal, function (i, personal) {
            $('#id_personal').append($('<option>', { 
                value: personal.id,
                text : personal.nombre 
            }));
        });
        $("#jefeArea").show();
        $('#modalArea #id_personal').val(id_personal);
        
        //document.getElementById("id_personal").options.namedItem(id_personal).selected=true;
        if (estado =="1"){
            document.getElementById("estadoArea").options[1].selected=true;
        }else{
            document.getElementById("estadoArea").options[2].selected=true;
        }
        //tipo_proceso
        $("#modalArea #tipoProceso").val(tipo_proceso);

        //mostrar modal
        $('#modalArea').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrarAreaExistente




    /*********************************************/
    /**FUNCION cargarModal Areas *****************/
    /*********************************************/

    function cargarModalArea(){

        //mostrar modal
        $('#modalArea').modal({'show':true, backdrop: 'static', keyboard: false});
        //set focus
        $('#modalArea').on('shown.bs.modal', function () {
            $('#nombre').trigger('focus')
        });
        $('#modalArea #accion').val("insert");
        //limpiar formulario
        document.getElementById('formArea').reset();
        $("#jefeArea").hide();
        document.getElementById("estadoArea").options[1].selected=true;
 
    }//end funcion cargarModalArea



    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalArea #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertArea();
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
                    updateArea();
                }
            });


        }//end if


    }//END FUNCTION confirmarGrabar


    /**
     * INSERTAR AREA
     */
    function insertArea(){

        //token
        var csrftoken           = getCookie('csrftoken');
        //data
        var nombre              = $("#modalArea #nombre").val();
        if (nombre =="" || nombre== null ){
            swal("Ingrese un nombre !", "", "info");
            return false;
        }//end if
        var descripcion         = $("#modalArea #descripcion").val();
        var id_personal           = $("#modalArea #id_personal").val();
        if (id_personal =="" || id_personal== null || id_personal=="Seleccione:"){
            swal("Seleccione un Encargado del Proceso !", "", "info");
            return false;
        }//end if

        var estadoArea          = $("#modalArea #estadoArea").val();
        if (estadoArea =="" || estadoArea== null ){
            swal("Seleccione un Estado !", "", "info");
            return false;
        }//end if

        var tipoProceso          = $("#modalArea #tipoProceso").val();
        if (tipoProceso =="" || tipoProceso== null ){
            swal("Seleccione el Tipo de Proceso !", "", "info");
            return false;
        }//end if

        $.ajax({
            type: "POST",
            url: "/insertArea/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                nombre:nombre,
                descripcion:descripcion,
                id_personal:id_personal,
                estado:estadoArea,
                tipoProceso:tipoProceso,
                datetime:datetimenow()
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalArea').modal('hide');
                    //recargar grilla
                    //$('#gridAreas').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
                    location.reload();

                }
                if(codigo=="no_ok"){
                    swal({
                        title: mensaje,
                        //text: "Desea Editar los Datos !",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    })
                    .then((willDelete) => {
                        if (willDelete) {
                            var area_list=data.area_list;
                            mostrarAreaExistente(area_list);
                        }//end if
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

    }//end function insertArea


    /**
     * UPDATE AREA
     */
    function updateArea(){
        
        //token
        var csrftoken           = getCookie('csrftoken');
        //data
        var id_area             = $("#modalArea #idArea").val();
        var carpeta_anterior    = $("#modalArea #carpeta_anterior").val();
        var tipo_anterior       = $("#modalArea #tipo_anterior").val();

        var nombre              = $("#modalArea #nombre").val();
        if (nombre =="" || nombre== null ){
            swal("Ingrese un nombre !", "", "info");
            return false;
        }//end if
        var descripcion         = $("#modalArea #descripcion").val();
        var id_personal           = $("#modalArea #id_personal").val();
        if (id_personal =="" || id_personal== null ){
            swal("seleccione un encargado de Area !", "", "info");
            return false;
        }//end if
        var estadoArea          = $("#modalArea #estadoArea").val();
        if (estadoArea =="" || estadoArea== null ){
            swal("Seleccione un Estado !", "", "info");
            return false;
        }//end if

        var tipoProceso          = $("#modalArea #tipoProceso").val();
        if (tipoProceso =="" || tipoProceso== null ){
            swal("Seleccione el Tipo de Proceso !", "", "info");
            return false;
        }//end if


        $.ajax({
            type: "POST",
            url: "/updateArea/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_area:id_area,
                carpeta_anterior:carpeta_anterior,
                tipo_anterior:tipo_anterior,
                nombre:nombre,
                descripcion:descripcion,
                id_personal:id_personal,
                estado:estadoArea,
                datetime:datetimenow(),
                tipoProceso:tipoProceso,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){

                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalArea').modal('hide');
                    //recargar grilla
                    //$('#gridAreas').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
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

    }//end function updateArea



    function cargarJefeArea(id_cargo){
    
        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectJefe/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_cargo:id_cargo,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    var jefes =data.jefes_list;
                    $("#jefeArea").show();
                    //remover opt
                    $('#id_personal').find('option:not(:first)').remove();
                    //agregar nuevo valor opt
                    $.each(jefes, function (i, jefe) {
                        $('#id_personal').append($('<option>', { 
                            value: jefe.id,
                            text : jefe.nombre 
                        }));
                    });
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

    }//end function cargarJefeArea
