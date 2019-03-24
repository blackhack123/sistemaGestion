function cambiarNombre(nombre){
    
    $("#editarDirectorioModal #nombreAnterior").val(nombre);
    //mostrar modal
    $('#editarDirectorioModal').modal({'show':true, backdrop: 'static', keyboard: false});
}//end function

    //SE DEFINE EL FILETREE JS
    $('#directorios_principales').fileTree({
        root: 'media/gestionDocumental',
        script: '/dir_list',
        expandSpeed: 200,
        collapseSpeed: 200,
        multiFolder: false, //abrir multiples carpetas a la vez
    }, function(file) {
         //abrir modal acciones
        abrirmodalAccion(file);
        /*
        swal({
          title: "Desea abrir el Documento ?",
          text: "",
          icon: "warning",
          buttons: ['No', 'Si'],
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            //abrir archivo seleccionado
            window.open(file, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
          } else {
            return false;
          }
        });
        */
    });

    function abrirmodalAccion(file){
        //MOSTRAR MODAL
        $("#modalAccionDocumento").modal('show');
        //asignar path
        $("#modalAccionDocumento #documento").val(file);

    }//end function abrirmodalAccion


     function accionDocumento(){

        var accion =  $("#modalAccionDocumento #acciones").val();
        var path_documento =  $("#modalAccionDocumento #documento").val();
        if(accion ==1){
              //abrir archivo seleccionado
            window.open(path_documento, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
        }//end if
        if(accion ==2){
            swal({
              title: "Desea eliminar el Documento ?",
              text: "Tome encuenta que el Documento no podrá ser recuperado !!",
              icon: "warning",
              buttons: true,
              dangerMode: true,
            })
            .then((willDelete) => {
              if (willDelete) {

                 //token
                var csrftoken = getCookie('csrftoken');
                $.ajax({
                    type: "POST",
                    url: "/deleteArchivo/",
                    data:{
                        csrfmiddlewaretoken : csrftoken,
                        path_documento:path_documento,
                    },
                    dataType: "json",
                    success: function(data) {
                        var codigo = data.resultado;
                        if (codigo=="ok_select"){
                            //mensaje exitoso
                           swal("Documento Eliminado !!", "", "success");
                           location.reload();
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

              } else {
                swal("El documento no ha sido eliminado !!");
                return false;
              }
            });
        }//end if

    }//end function accionDocumento
