        /** 
     * PARAMETRIZAR DATATABLES
    */
    var table = $('#tablePersonal').DataTable( {
        // "pageLength": 5,
        "aLengthMenu": [[5, 10, 50, -1], [5, 10, 50, "All"]],
        "iDisplayLength": 5,
        "language": {
        url: "/static/DataTables/es_ES.json"
        }
    });

    $('#tablePersonal tbody').on( 'click', 'tr', function()
    {
        if ($(this).hasClass('selected') )
        {
            $(this).removeClass('selected');

        }else{
        table.$('tr.selected').removeClass('selected');
        $(this).addClass('selected');
        }
    });

    var totalDisplayRecord = $("#tablePersonal").DataTable().page.info().recordsDisplay
    if(totalDisplayRecord== 0){
        desabilitarReportes();
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

    function cargarModalPersonal(){
        
        //mostrar modal
        $('#modalPersonal').modal({'show':true, backdrop: 'static', keyboard: false});
        //set focus
        $('#modalPersonal').on('shown.bs.modal', function () {
            $('#nombre').trigger('focus')
        });
        $('#modalPersonal #accion').val("insert");
        //limpiar formulario
        document.getElementById('formPersonal').reset();
        document.getElementById('formPersonal').setAttribute('action','/insertPersonal');
        //document.getElementById('id_correo').setAttribute('onblur','validarEmail($(this).val());');
        //document.getElementById("id_estado").options[0].selected=true;
 
    }//end funcion cargarModalBodega


    function getPersonal(id_personal){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectPersonal/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_personal:id_personal,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    mostrarPersonalExistente(data.personal_list);
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


    function mostrarPersonalExistente(personal_list){
        //asignar data a variables
        var id              = personal_list.id;
        var nombre          = personal_list.nombre;
        var telefono        = personal_list.telefono;
        var celular         = personal_list.celular;
        var correo          = personal_list.correo;
        var estado          = personal_list.estado;
        var id_cargo        = personal_list.id_cargo;
        var id_area         = personal_list.id_area;
        
        //asignar data existente a modal
        $('#modalPersonal #id_pk').val(id);
        document.getElementById('formPersonal').setAttribute('action','/updatePersonal');

        $('#modalPersonal #id_nombre').val(nombre);
        $('#modalPersonal #id_telefono').val(telefono);
        $('#modalPersonal #id_celular').val(celular);
        $('#modalPersonal #id_correo').val(correo);
        $('#modalPersonal #id_estado').val(estado);
        $('#modalPersonal #id_cargo').val(id_cargo);
        $('#modalPersonal #area_id').val(id_area);
        $('#modalPersonal #id_area').val(id_area);

        //mostrar modal
        $('#modalPersonal').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end function mostrarPersonalExistente

    function setIdCargo(id_cargo){
        $('#modalPersonal #id_cargo').val(id_cargo);
    }//end function setIdCargo
    
    function setIdArea(id_area){
        $('#modalPersonal #id_area').val(id_area);
    }//end function setIdCargo

    $('#modalVincularColaboradores').modal('show');


    function mostrar_firma(path){

        window.open(path, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');

    }//end function mostrar_firma