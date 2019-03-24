    // Establece  campos requeridos class="value_required"
    $( '<span style="color:red;">*</span>' ).insertBefore( ".value_required" );

    //autocargar funcion
    window.onload = gridColaboradores;

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
    /**FUNCION cargarModal Areas *****************/
    /*********************************************/

    function cargarModalColaborador(){

        //mostrar modal
        $('#modalColaborador').modal({'show':true, backdrop: 'static', keyboard: false});
        //set focus
        $('#modalColaborador').on('shown.bs.modal', function () {
            $('#nombre').trigger('focus')
        });
        $('#modalColaborador #accion').val("insert");
        //limpiar formulario
        document.getElementById('formColaborador').reset();
        document.getElementById("estadoColaborador").options[1].selected=true;
 
    }//end funcion cargarModalArea



    /** 
     * PERMITE CARGAR GRILLA DE areas
    */
   function gridColaboradores(){

    var csrftoken = getCookie('csrftoken');
    emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
    $("#gridColaboradores").jqGrid({
        url:'/gridColaboradores/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
        },
        datatype: "json",
        //data: mydata,
        loadonce: true, 
        viewrecords: true,
        width: 800,
        height: 230,
        rowNum:10,
        colNames:['ID','NOMBRE','CORREO', 'TELEFONO', 'IDPROCESO','PROCESO','', 'ESTADO',''],
        colModel: [
            { label: 'id_colaborador', name: 'id_colaborador', width: 20, key:true, sorttype:"integer", hidden:true},
            { label: 'nombre_colaborador', name: 'nombre_colaborador', width: 30, sorttype:"string", align:'center'},
            { label: 'correo', name: 'correo', width: 50, sorttype:"string", align:'center'},
            { label: 'telefono', name: 'telefono', width: 30, sorttype:"string", align:'center'},
            { label: 'id_proceso', name: 'id_proceso', width: 40, sorttype:"string", align:'center', hidden:true},
            { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center'},
            { label: 'estado_colaborador', name: 'estado_colaborador', width: 15, sorttype:"string", align:'center', hidden:true},
            { label: 'estadoA', name: 'estadoA', width: 25, sorttype:"string", align:'center', formatter: gridColaboradores_FormatterEstado},
            { name:'btn_editar_Colaborador' , width:10, align:"center", formatter:gridColaboradores_FormatterEdit },
        ],
        pager: '#pagerColaboradores',
        rownumbers: true,
        caption: "Colaboradores",
        shrinkToFit: true,
        grouping: true,
        groupingView: {
            groupField: ["proceso"],
            groupColumnShow: [false],
            groupText: ["<strong>Proceso :</strong> <span class='badge bg-blue'>{0}</span>"],
            groupOrder: ["asc"],
            groupCollapse: true
        },
        //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
        ondblClickRow: function (rowid,iRow,iCol,e) {
           
            //get data seleccionada
            var data = $('#gridColaboradores').getRowData(rowid);	
            //asignar a variables la data
            var id_colaborador      = data.id_colaborador;
            var nombre_colaborador  = data.nombre_colaborador;
            var correo              = data.correo;
            var telefono            = data.telefono;
            var id_proceso          = data.id_proceso;
            var estado_colaborador  = data.estado_colaborador;


            //asignar data existente a modal
            $('#modalColaborador #idColaborador').val(id_colaborador);
            $('#modalColaborador #accion').val("update");

            $('#modalColaborador #nombre').val(nombre_colaborador);
            $('#modalColaborador #correo').val(correo);
            $('#modalColaborador #telefono').val(telefono);
            document.getElementById("id_proceso").options.namedItem(id_proceso).selected=true;
            if (estado_colaborador =="1"){
                document.getElementById("estadoColaborador").options[1].selected=true;
            }else{
                document.getElementById("estadoColaborador").options[2].selected=true;
            }
            //mostrar modal
            $('#modalColaborador').modal({'show':true, backdrop: 'static', keyboard: false});
            return false;
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
    //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
    var groupingView = $("#gridColaboradores").jqGrid("getGridParam", "groupingView"),
    plusIcon = groupingView.plusicon,
    minusIcon = groupingView.minusicon;
    $("#gridColaboradores").click(function (e) {
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
    emptyMsgDiv.insertAfter($("#gridColaboradores").parent());

    //funcion Buscar
    var timer;
    $("#search_cells").on("keyup", function() {
        var self = this;
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(function(){
            //timer = null;
            $("#gridColaboradores").jqGrid('filterInput', self.value);
        },0);
    });

    function gridColaboradores_FormatterEstado(cellvalue, options, rowObject)
    {	

        if(rowObject.estado_colaborador == "1"){

            new_format_value = '<span class="badge bg-green">Activo</span>';
            return new_format_value;
        }else{

            new_format_value = '<span class="badge bg-red">Inactivo</span>';
            return new_format_value;

        }//end if

    }//end function gridBodegas_FormatterEstado


    
    function gridColaboradores_FormatterEdit(cellvalue, options, rowObject){

        var id_colaborador              = rowObject.id_colaborador;	
        
        new_format_value = '<a href="javascript:void(0)" onclick="consultar_colaborador(\''+id_colaborador+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i></a>'; 
        
        return new_format_value
        
    }//end function gridColaboradores_FormatterEdit


}//end function gridColaboradores

/**
 * 
 * CONSULTAR COLABORADOR POR ID
 */
function consultar_colaborador(id_colaborador){

            
    //token
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        url: "/selectColaborador/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            id_colaborador:id_colaborador,
        },
        dataType: "json",
        success: function(data) {
            var codigo = data.resultado;
            if (codigo=="ok_select"){
                mostrarColaboradorExistente(data.colaborador_list);
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

}//end function consultar_colaborador



/**
 * MOSTRAR COLABORADOR EXISTENTE
 */
function mostrarColaboradorExistente(colaborador_list){


    //asignar a variables la data
    var id_colaborador      = colaborador_list.id;
    var nombre_colaborador  = colaborador_list.nombre;
    var correo              = colaborador_list.correo;
    var telefono            = colaborador_list.telefono;
    var id_proceso          = colaborador_list.id_proceso;
    var estado_colaborador  = colaborador_list.estado;


    //asignar data existente a modal
    $('#modalColaborador #idColaborador').val(id_colaborador);
    $('#modalColaborador #accion').val("update");

    $('#modalColaborador #nombre').val(nombre_colaborador);
    $('#modalColaborador #correo').val(correo);
    $('#modalColaborador #telefono').val(telefono);
    document.getElementById("id_proceso").options.namedItem(id_proceso).selected=true;
    if (estado_colaborador =="1"){
        document.getElementById("estadoColaborador").options[1].selected=true;
    }else{
        document.getElementById("estadoColaborador").options[2].selected=true;
    }
    //mostrar modal
    $('#modalColaborador').modal({'show':true, backdrop: 'static', keyboard: false});


}//end function mostrarColaboradorExistente


    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalColaborador #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea insertar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertColaborador();
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
                    updateColaborador();
                }
            });


        }//end if


    }//END FUNCTION confirmarGrabar


    /**
     * INSERT COLABORADOR
     */
    function insertColaborador(){

        //token
        var csrftoken           = getCookie('csrftoken');

        var nombre      = $('#modalColaborador #nombre').val();
        if (nombre =="" || nombre== null ){
            swal("Ingrese un nombre !", "", "info");
            return false;
        }//end if
        var correo      = $('#modalColaborador #correo').val();
        if (correo =="" || correo== null ){
            swal("Ingrese un correo !", "", "info");
            return false;
        }//end if
        var telefono    = $('#modalColaborador #telefono').val();
        var id_proceso  = $('#modalColaborador #id_proceso').val();
        if (id_proceso =="" || id_proceso== null ){
            swal("Seleccione un Proceso !", "", "info");
            return false;
        }//end if
        var estado      = $('#modalColaborador #estadoColaborador').val();
        if (estado =="" || estado== null ){
            swal("Seleccione un estado !", "", "info");
            return false;
        }//end if

        $.ajax({
            type: "POST",
            url: "/insertColaborador/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                nombre:nombre,
                correo:correo,
                telefono:telefono,
                id_proceso:id_proceso,
                estado:estado,
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
                    $('#modalColaborador').modal('hide');
                    //recargar grilla
                    //$('#gridColaboradores').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
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
                            var colaborador_list=data.colaborador_list;
                            mostrarColaboradorExistente(colaborador_list);
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
        }); //end ajax

    }//end function insertColaborador



    /**
     * UPDATE COLABORADOR
     */
    function updateColaborador(){

        //token
        var csrftoken           = getCookie('csrftoken');

        var id_colaborador      = $('#modalColaborador #idColaborador').val();
        var nombre      = $('#modalColaborador #nombre').val();
        if (nombre =="" || nombre== null ){
            swal("Ingrese un nombre !", "", "info");
            return false;
        }//end if
        var correo      = $('#modalColaborador #correo').val();
        if (correo =="" || correo== null ){
            swal("Ingrese un correo !", "", "info");
            return false;
        }//end if
        var telefono    = $('#modalColaborador #telefono').val();
        var id_proceso  = $('#modalColaborador #id_proceso').val();
        if (id_proceso =="" || id_proceso== null ){
            swal("Seleccione un Proceso !", "", "info");
            return false;
        }//end if
        var estado      = $('#modalColaborador #estadoColaborador').val();
        if (estado =="" || estado== null ){
            swal("Seleccione un estado !", "", "info");
            return false;
        }//end if

        $.ajax({
            type: "POST",
            url: "/updateColaborador/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_colaborador:id_colaborador,
                nombre:nombre,
                correo:correo,
                telefono:telefono,
                id_proceso:id_proceso,
                estado:estado,
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
                    $('#modalColaborador').modal('hide');
                    //recargar grilla
                    //$('#gridColaboradores').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
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



    }//end function updateColaborador