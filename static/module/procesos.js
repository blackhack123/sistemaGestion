
    //cargar editor ckeditor
    //CKEDITOR.replace('editorActividad');



    //ESTABLECE EL MISMO VALOR PARA DOS INPUT
    function copiar_valores_input(valor_input){
        
        //establecer valor
        $("#directorio").val(valor_input);

    }//end function copiar_valores_input

    


    //autocargar funcion
    window.onload = gridProcesos;


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




    /*********************************************/
    /**FUNCION modalProceso Areas *****************/
    /*********************************************/

    function cargarModalProceso(){

        //mostrar modal
        $('#modalProceso').modal({'show':true, backdrop: 'static', keyboard: false});
        $('#modalProceso #accion').val("insert");

        $('#modalProceso #idProceso').val("");
        //set focus
        $('#modalProceso').on('shown.bs.modal', function () {
            $('#proceso').trigger('focus')
        });
        //$("#divDocumento").hide();
        //$("#divSelectDocumento").show();
        $("#formProceso").attr("action", "/insertProceso");
        //limpiar formulario
        document.getElementById('formProceso').reset();
        $('#modalProceso #destino').find('option').remove();
        $("#div_directorio_principal").hide();
        //CKEDITOR.instances.editorActividad.setData("");
        //document.getElementById("estado").options[1].selected=true;
        $('#modalProceso #estado').val(1);
 
    }//end funcion cargarModalArea


    /** 
    * PERMITE CARGAR GRILLA DE Procesos
    */
   function gridProcesos(){

    var csrftoken = getCookie('csrftoken');
    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
    $("#gridProcesos").jqGrid({
        url:'/gridProcesos/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
        },
        datatype: "json",
        loadonce: true, 
        viewrecords: true,
        width: 850,
        height: 450,
        rowNum:100,
        colNames:['ID','PROCEDIMIENTO', 'VINCULADO', 'PROCED. VINCULADO', '', 'TIPO', 'TIPO', 'ESTADO', ''],
        colModel: [
            { label: 'id_proceso', name: 'id_proceso', width: 20, key:true, sorttype:"integer", hidden:true},
            { label: 'proceso', name: 'proceso', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
            { label: 'flag', name: 'flag', width: 20, sorttype:"integer", align:'center', hidden:true},
            { label: 'flag_formatter', name: 'flag_formatter', width: 20, sorttype:"string", align:'center', formatter: gridProcesos_FormatterFlag},
            { label: 'tipo_proceso', name: 'tipo_proceso', width: 10, sorttype:"integer", align:'center', hidden:true},
            { label: 'tipo', name: 'tipo', width: 20, sorttype:"string", align:'center', formatter: gridProcesos_FormatterTipo},
            { label: 'estado_proceso', name: 'estado_proceso', width: 10, sorttype:"string", align:'center', hidden:true},
            { label: 'estado_procesoA', name: 'estado_procesoA', width: 15, sorttype:"string", align:'center', formatter: gridProcesos_FormatterEstado},
            { name:'btn_editar_Proceso' , width:10, align:"center", formatter:gridProcesos_FormatterEdit },
        ],
        pager: '#pagerProcesos',
        rownumbers: true,
        caption: "Procesos",
        shrinkToFit: true,
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

    //muestra el mensaje luego de cargar la grilla 
    emptyMsgDiv.insertAfter($("#gridProcesos").parent());

    //funcion Buscar
    var timer;
    $("#search_cells").on("keyup", function() {
        var self = this;
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(function(){
            //timer = null;
            $("#gridProcesos").jqGrid('filterInput', self.value);
        },0);
    });

    function gridProcesos_FormatterFlag(cellvalue, options, rowObject){
        
        var flag        = rowObject.flag;
        var id_proceso  = rowObject.id_proceso;

        if(flag == "1"){
            //new_format_value = '<i class="fa fa-check" style="color:green"></i> Vinculado';
            new_format_value = '<a href="javascript:void(0)" onclick="javascript:consultar_areas('+id_proceso+');"><i class="fa fa-check-square" style="color:green"></i> Vinculado</a>';
        }//end if
        if(flag == "0"){
            new_format_value = '<i class="fa fa-window-close" style="color:red"></i> No Vinculado';
        }//end if
        return new_format_value;
    }
    
    function gridProcesos_FormatterEstado(cellvalue, options, rowObject)
    {	

        if(rowObject.estado_proceso == "1"){

            new_format_value = '<span class="badge bg-green">Activo</span>';
            return new_format_value;
        }else{

            new_format_value = '<span class="badge bg-red">Inactivo</span>';
            return new_format_value;

        }//end if

    }//end function gridProcesos_FormatterEstado


    function gridProcesos_FormatterTipo(cellvalue, options, rowObject){

        var tipo = rowObject.tipo_proceso;
        if (tipo == "0"){
            new_format_value = '<span class="badge bg-blue">Transversal</span>';
        }else{
            new_format_value = '<span class="badge bg-yellow">Vertical</span>';
        }
        return new_format_value;

    }//end function gridProcesos_FormatterTipo
    

    function gridProcesos_FormatterEdit(cellvalue, options, rowObject){

        var id              = rowObject.id_proceso;	


        new_format_value = '<a href="javascript:void(0)" onclick="consultar_proceso(\''+id+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i></a>'; 
        return new_format_value
        
    }//end function gridProcesos_FormatterEdit

    /*
    function gridProcesos_FormatterArea(cellvalue, options, rowObject){
        
        if(rowObject.area == "" || rowObject.area == null || rowObject.area == undefined ){
            new_format_value = '<span class="badge bg-red">Area no Asignada</span>';
        }else{
            new_format_value = '<span class="badge bg-orange">'+rowObject.area+'</span>';
        }
        return new_format_value;

    }//end function gridProcesos_FormatterArea
    */

}//end function gridProcesos



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
            
            //armando ventana pop up javascript
            var html ='';
            for(i=0; i<data.length; i++){
                //agregar data areas
                html = html + "<li>"+ data[i]['area']+"</li>";
            }//end for
            $("#contenido_modal").html(html);
            //inicializar dialog
            $("#dialogProcesosVinculados").dialogResize({
                position: { my: "center", at: "center "},
                closeOnEscape: false,
                width: 250,
                height: 150,
                autoOpen: true,
                modal: true
            });
            /*
            var win = window.open("", "Procesos Vinculados", "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=500,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
            //fondo color 
            win.document.body.style.background = '#4fb0b0';
            //incluir data en venta pop up
            win.document.body.innerHTML = html;
            */

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

}//end function consultar_areas



/**
 * CONSULTAR POR ID 
 */
function consultar_proceso(id){


    var id_proceso      = id;

    //token
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        url: "/selectProceso/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            id_proceso:id_proceso,
        },
        dataType: "json",
        success: function(data) {
            var codigo = data.resultado;
            if (codigo=="ok_select"){
                mostrarProcesoExistente(data.proceso_list);
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

}//end function consultar_proceso


/**
 * 
 * muestra proceso existente
 */
function mostrarProcesoExistente(proceso_list){

    //asignar a variables la data
    var id              = proceso_list.id;
    var proceso         = proceso_list.nombre;
    var docProceso      = proceso_list.docfile;
    var tipo            = proceso_list.tipo;
    var estado          = proceso_list.estado;
    var url_carpeta     = proceso_list.url_carpeta;

    //grabar en session carpeta anterior
    //sessionStorage.setItem("carpeta_anterior", proceso);


    //asignar data a modal
    $('#modalProceso #carpeta_anterior').val(proceso);
    $('#modalProceso #id_idProceso').val(id);
    $("#idProceso").hide();
    $('#modalProceso #accion').val("update");
    $("#formProceso").attr("action", "/updateProceso");
    $('#modalProceso #proceso').val(proceso);
    
    var estrategicos  = 'media/gestionDocumental/Estrategicos/';
    var apoyo         = 'media/gestionDocumental/Apoyo/';
    var operativos    = 'media/gestionDocumental/Operativos/';

    //url_final = url_carpeta.split('/'+proceso)
    if(url_carpeta.includes(estrategicos)){
       $("#modalProceso #directorio_principal").val(estrategicos).trigger('change');
    }else if(url_carpeta.includes(apoyo)){
        $("#modalProceso #directorio_principal").val(apoyo).trigger('change');
    } else if(url_carpeta.includes(operativos)){
        $("#modalProceso #directorio_principal").val(operativos).trigger('change');
    }

    url_final = url_carpeta.split('/'+proceso);
    var destino_path = url_final[0];
    
    $("#div_directorio_principal").show();
    
    //$('#destino option[value="' + destino_path + '"]').prop('selected', true)
    $("#modalProceso #destino").val(destino_path);

    $("#modalProceso #directorio").val(proceso);
    $('#modalProceso #tipo_proceso').val(tipo);
    $('#modalProceso #estado').val(estado);
    $("#div_directorio").show();
    $("#div_directorio_principal").show();
    //mostrar modal
    $('#modalProceso').modal({'show':true, backdrop: 'static', keyboard: false});

}//end function mostrarProcesoExistente



    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalProceso #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertProceso();
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
                    updateProceso();
                }
            });


        }//end if


    }//END FUNCTION confirmarGrabar


    /**
     * INSERT
     */
    function insertProceso(){
 
        var fileInput = document.getElementById('docProceso');
        var file = fileInput.files[0];

        var data = new FormData();
        data.append("archivo",file);
        data.append("nombreProceso", $("#modalProceso #proceso").val());
        data.append("estadoProceso", $("#modalProceso #estadoProceso").val());
        data.append("csrfmiddlewaretoken", $("input[name=csrfmiddlewaretoken]").val());

       $.ajax({
            type: "POST",
            url: "/insertProceso/",
            data  : {
                data:file
            },
            dataType: "json",
            contentType: false,
            processData: false,
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalProceso').modal('hide');
                    //recargar grilla
                    //$('#gridProcesos').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
                    //location.reload();
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
                            var proceso_list=data.proceso_list;
                            mostrarProcesoExistente(proceso_list);
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
        
    }//end function insertProceso



    /**
     * UPDATE
     */
    function updateProceso(){

        //token
        var csrftoken           = getCookie('csrftoken');
        //data
        var id_proceso          = $("#modalProceso #idProceso").val();
        var proceso             = $("#modalProceso #proceso").val();
        if (proceso =="" || proceso== null ){
            swal("Ingrese el proceso !", "", "info");
            return false;
        }//end if
        //var dataEditor          = $.trim(CKEDITOR.instances.editorActividad.getData());
        var actividad           = $("#modalProceso #actividad").val();
        var estadoProceso       = $("#modalProceso #estadoProceso").val();
        if (estadoProceso =="" || estadoProceso== null ){
            swal("Seleccione un Estado !", "", "info");
            return false;
        }//end if

        $.ajax({
            type: "POST",
            url: "/updateProceso/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_proceso:id_proceso,
                proceso:proceso,
                actividad:actividad,
                estado:estadoProceso,
                datetime:datetimenow()
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){

                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalProceso').modal('hide');
                    //recargar grilla
                    //$('#gridProcesos').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
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

    }//end function updateProceso





    function obtenerSubDirectorios(path_directorioPrincipal){
       
        $("#div_directorio_principal").show();
        //token
        var csrftoken           = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/getSubdirectorios/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                path_directorio:path_directorioPrincipal,
            },
            dataType: "json",
            success: function(data) {
                var codigo =data.resultado;
                if (codigo=="ok_select"){
                   var subdirectorios = data.subdirectorios;
                   //remover las opciones para agregar las nuevas
                   $("#div_directorio_principal").show();   
                   $('#modalProceso #destino').find('option').remove();
                   for(i=0; i<subdirectorios.length; i++){
                        //armando el option
                        temporal_value =path_directorioPrincipal +subdirectorios[i];
                        var x = document.getElementById("destino");
                        var option = document.createElement("option");
                        option.text = subdirectorios[i];
                        option.value= temporal_value;
                        x.add(option);
                        //var option = $("<option value='"+ temporal_value +"'>"+ subdirectorios[i] +"</option>");
                        //append option
                        //$("#modalProceso #destino").append(option);
                   }
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

    }//end function obtenerListadoDirectorios
