    /** 
     * PARAMETRIZAR DATATABLES
    */
    $('table.display').DataTable({

        "language": {
            url: "/static/DataTables/es_ES.json",
        },
        //'scrollX':true
  
    });



    $('#tableCargos tbody').on( 'click', 'tr', function()
    {
        if ($(this).hasClass('selected') )
        {
            $(this).removeClass('selected');

        }else{
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        }
    });

    var totalDisplayRecord = $("#tableCargos").DataTable().page.info().recordsDisplay
    if(totalDisplayRecord== 0){
        desabilitarReportes();
    }

 
    

    //funcion inicio y liampiar
    function cargarModalObjetivo(){
    
        //reset al formulario ->limpiar el form
        document.getElementById("formPersonal").reset();
        //abrir modal
        $("#formPersonal").modal('show');
        
    }
    
    
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
    /**FUNCION cargarModalCatProveedor*******/
    /*********************************************/

    function cargarModalCargo(){

        //mostrar modal
        $('#modalCargo').modal({'show':true, backdrop: 'static', keyboard: false});

        $('#modalCargo #accion').val("insert");
        $('#modalCargo').on('shown.bs.modal', function () {
            $('#id_nombre').trigger('focus')
        });
        //limpiar formulario
        document.getElementById('formPersonal').reset();
        document.getElementById('formPersonal').setAttribute('action','/insertCargo');
        document.getElementById("id_estado").options[0].selected=true;
 
    }//end funcion cargarModalBodega


    function getCargo(id_cargo){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectCargo/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_cargo:id_cargo,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    mostrarCargoExistente(data.cargo_list);
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
        
    }//end function selectCargo



    function mostrarCargoExistente(cargo_list){
        

        //asignar data a variables
        var id              = cargo_list.id;
        var nombre          = cargo_list.nombre;
        var descripcion     = cargo_list.descripcion;
        var estado          = cargo_list.estado;
        
        //asignar data existente a modal
        $('#modalCargo #id_pk').val(id);
        document.getElementById('formPersonal').setAttribute('action','/updateCargo');

        $('#modalCargo #id_nombre').val(nombre);
        $('#modalCargo #id_descripcion').val(descripcion);
        $('#modalCargo #id_estado').val(estado);
        //mostrar modal
        $('#modalCargo').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrarCargoExistente
    
    
    function selecAreapersonal(idareapersonal){
        
        //token 
        var csrftoken = getCookie('csrftoken');
        // peticion ajax a la BD
        var jqxhr = $.ajax({
            url:'/selec_areapersonal',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                idareapersonal:idareapersonal,
            }
        }).done(function(data) {

            codigo= data.resultado;
            
            if (codigo=='ok_select') {
                consulta=data.areapersonal;
                idareapersonal = consulta[0]['id']
                nombre = consulta[0]['nombre']
                descripcion = consulta[0]['descripcion']
                estado = consulta[0]['estado']

                $('#modalAreados #id_id').val(idareapersonal)
                $('#modalAreados #id_nombre').val(nombre)
                $('#modalAreados #id_descripcion').val(descripcion)
                $('#modalAreados #id_estado').val(estado)

                $('#formArea').attr('action','/actualizar_areapersonal');

                //mostrar modal
                $('#modalAreados').modal('show');
            }
        })
        .fail(function() {
            alert( "error" );
        });

    }//endfuntion consultaProducto
    

    function eliminarAreapersonal(idareapersonal)
    {
        swal({
            title: "Desea eliminar Registro?",
            text: "",
            icon: "warning",
            buttons: ['No','Si'],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {

                //token 
                var csrftoken = getCookie('csrftoken');
                // peticion ajax a la BD
                var jqxhr = $.ajax({
                    url:'/eliminar_areapersonal',
                    type:'POST',
                    dataType:'json',
                    data:{
                        csrfmiddlewaretoken: csrftoken,
                        idareapersonal:idareapersonal,
                    }
                }).done(function(data) {
            
                    codigo= data.resultado;
                    
                    if (codigo=='ok_delete'){
                        //mensaje
                        swal('eliminado exitosamente', '', 'success');
                        //recargAR
                        location.reload();
                        sessionStorage.setItem("ok_delete", "ok_delete");
                    }
                })
                .fail(function(jqxhr, textStatus, errorThrown ) {
                    
                    if (jqxhr.status === 0) {

                        swal('Not connect: Verify Network.', "", "error");
    
                    } else if (jqxhr.status == 404) {
    
                        swal('Requested page not found [404]', "", "error");
    
                    } else if (jqxhr.status == 500) {
    
                        swal('Internal Server Error [500]', "", "error");
    
                    } else if (textStatus === 'parsererror') {
    
                        swal('Requested JSON parse failed.', "", "error");
            
                    } else if (textStatus === 'timeout') {
    
                        swal('Time out error', "", "error");
            
                    } else if (textStatus === 'abort') {
                        swal('Ajax request aborted.', "", "error");
            
                    } else {
                        swal('Uncaught Error: ' + jqxhr.responseText, "", "error");
            
                    }//end if 
    
                });
   
            } else {
              return false;
            }
          });
        
    }//endfuntion eliminarProducto
    


    function cargarModalArea(){
        document.getElementById('formArea').reset();
        $('#modalAreados').modal('show');
                                        
    }//end function cargarModalArea



    
    
    
    
    