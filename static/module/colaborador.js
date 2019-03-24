
    //ESTABLECE FOCUS POPUP CKEDITOR
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        modal_this = this
        $(document).on('focusin.modal', function (e) {
            if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length
            // add whatever conditions you need here:
            &&
            !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
                modal_this.$element.focus()
            }
        })
    };

    CKEDITOR.replace('descripcion');
    $('#modalCol').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      var modal = $(this)
      CKEDITOR.instances.descripcion.setData(recipient);
    });


    CKEDITOR.replace('justificacion_seguimiento',{
    	filebrowserBrowseUrl: '',
	    filebrowserUploadUrl: '/uploadImagesCkeditor',
    });
    $('#modalSeguimiento').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('whatever')
      var modal = $(this)
      CKEDITOR.instances.justificacion_seguimiento.setData(recipient);
    });


    /**
     * PARAMETRIZAR DATATABLES
    */
    var table = $('#tableSeguimiento').DataTable( {
       //"pageLength": 5,
       //"scrollY":        "150px",
       //"scrollCollapse": true,
      "scrollX": true,
       //"aLengthMenu": [[5, 10, 50, 100,-1], [5, 10, 50, 100,"All"]],
       //"iDisplayLength": 5,
        "language": {
        url: "/static/DataTables/es_ES.json"
        }
    });

    var table = $('#tableDocumentos').DataTable( {

        "language": {
        url: "/static/DataTables/es_ES.json"
        }
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





    /**
     * OBTIENE PDF DE LA NORMA RESPECTIVA
     */
    function normaPdf(){

        //token
        var csrftoken   = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/selProcCol/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                   
                    //data retornante
                    var procesoUrl= data.procesoUrl;
                    //url documento
                    var urlDocumento    = procesoUrl[0]['docfile'];
                    
                    //ARMANDO URL DOC
                    var hostName=window.location.host+"/"
                    var linkDoc="http://"+hostName+urlDocumento;
                    //MOSTRAR VENTAN CON DOCUMENTO
                    window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
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
        
    }//consultar normaPdf


    /**
    * FUNCION CARGA MODAL
    * CON DETALLE PLAN ACCION
    */
    function cargarModalPlanAccion(detalle_plan_accion, id_sac){

        $("#seguimientoColaborador #id_sac").val(id_sac);
        $("#seguimientoColaborador #detalle_plan_accion").val(detalle_plan_accion);
        $('#seguimientoColaborador').modal('show')

    }//end function consultarPlanAccion


    function consultarPlanAccion(id_sac){

                //token
        var csrftoken   = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/selSeguimiento/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_sac:id_sac,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    mostrarPlanAccion(data.seguimiento);

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

    }//end function consultarPlanAccion


    function mostrarPlanAccion(seguimiento){

        var data = seguimiento;

        var plan_accion = data[0]['detalle_plan_accion'];

        //asignar data a modal
        $("#cambiosSugeridos #detalle_plan_accion").val(plan_accion);
        //mostrar modal
        $("#cambiosSugeridos").modal('show');

    }//end function




    /***
    *
    *funcion graba seguimiento
    */
    function grabarSeguimiento(id_sac){
        swal({
          title: "Desea grabar los Datos ?",
          text: "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            var seguimiento_realizado = $("#seguimientoColaborador #seguimiento_realizado").val();
            if(seguimiento_realizado == "" || seguimiento_realizado == null ){
                swal("Ingrese el detalle del seguimiento realizado !!", "", "info");
                return false;
            }//end if

            var csrftoken   = getCookie('csrftoken');
            $.ajax({
                type: "POST",
                url: "/updateSegCol/",
                data:{
                    csrfmiddlewaretoken : csrftoken,
                    id_sac:id_sac,
                    seguimiento_realizado:seguimiento_realizado,
                },
                dataType: "json",
                success: function(data) {

                    var codigo  = data.resultado;

                    if (codigo=="ok_update"){

                        swal('Datos Grabados Exitosamente !!', "", "success");
                        $('#seguimientoColaborador').modal('hide');
                        location.reload();
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

            //swal("Poof! Your imaginary file has been deleted!", { icon: "success",});
          }//end if
        });

    }//end function grabarSeguimiento



    function abrirAchivo(path){
        var hostName=window.location.host+"/"
        var linkDoc="http://"+hostName+path;
        window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');

    }//end function abrirAchivo


    function setDestino(){

      //destino
      var destino = $("#subirArchivo #procedimiento option:selected").text();
      $("#subirArchivo #destino").val($.trim(destino));

    }//end function setDestino


    function abrirModalSubirArchivo(){

      //abrir modal
      $("#subirArchivo").modal('show');

      //reset al formulario al abrir modal
      document.getElementById("formSubirArchivo").reset(); 
      
    }//end function abrirModalSubirArchivo



    function eliminar_archivo(archivo){
       
        
       
        swal({
            title: "Desea eliminar este Archivo ?",
            text: "",
            icon: "warning",
            buttons: ['No', 'Si'],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                
                //token
                var csrftoken = getCookie('csrftoken');
                //peticion de eliminar archivo
                $.ajax({
                    type: "POST",
                    url: "/deleteArchivo/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        archivo:archivo,
                    },
                    dataType: "json",
                    success: function(data) { 

                        //mensaje de eliminacion exitosa
                        //swal("Eliminado Correctamente !!", { icon: "success",});
                        //recargar pagina 
                        location.reload();

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
                
            } else {
              return false;
            }
          });
        

    }//end function delete_archivo



    function reemplazar_archivo(data){

        data_final = data.split(',');       

        var archivo = data_final[0]
        var carpeta = data_final[1]

        $('#modalReemplazarArchivo #id_archivo_anterior').val(archivo)
        $('#modalReemplazarArchivo #id_carpeta_anterior').val(carpeta)
            
        $('#modalReemplazarArchivo').modal('show')


    }//end function getListaArchivos



    /* DEFINIMOS EL CKEDITOR */
    CKEDITOR.replace('accion_realizada',{
	    filebrowserBrowseUrl: '',
	    filebrowserUploadUrl: '/uploadImagesCkeditor',
    });
