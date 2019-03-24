    
    //autocargar funcion
    window.onload = gridDocumentos;       


    function abrirAchivo(path){

        var hostName=window.location.host+"/"
        var linkDoc="http://"+hostName+path;
        console.log(linkDoc);
        window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');

    }//end function abrirAchivo



    function eliminar_archivo(archivo){
       
        swal({
            title: "Desea eliminar este Archivo ?",
            text: "Tome en cuenta que este archivo no deberia estar vinculado !!",
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



    function eliminar_directorio(url_carpeta){
       
        swal({
            title: "Desea eliminar este Directorio ?",
            text: "Tome en cuenta que esto eliminar todo su contenido !!!",
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
                    url: "/deleteDirectorio/",
                    data:{
                        csrfmiddlewaretoken : csrftoken, 
                        url_carpeta:url_carpeta,
                    },
                    dataType: "json",
                    success: function(data) { 

                        //mensaje de eliminacion exitosa
                        //swal("Eliminado Correctamente !!", {icon: "success",});
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



    function descargar_archivo(url_carpeta){
        
        //separar los parametros pasados
        var data=url_carpeta.split(',');
        //consultar url y abrir
        abrirAchivo(data[1]);

    }//end function descargar_archivo


    function cambiarNombre(nombre){
    
        $("#editarDirectorioModal #nombreAnterior").val(nombre);
        //mostrar modal
        $('#editarDirectorioModal').modal({'show':true, backdrop: 'static', keyboard: false});

    }//end function cambiarNombre



    function gridDocumentos(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridDocumentos").jqGrid({
            url:'/grid_documentosAdmin/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            loadonce: true, 
            viewrecords: true,
            width: 1150,
            height: 230,
            rowNum:100,
            colNames:['ID', 'Proceso',  'Procedimiento', 'Nombre','Descripcion', 'Versión', 'Responsable','Fec. Subido','Estado', '','','', 'Historico'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'proceso', name: 'proceso', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'procedimiento', name: 'procedimiento', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'nombre', name: 'nombre', width: 45, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'descripcion', name: 'descripcion', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'version', name: 'version', width: 20, sorttype:"string", align:'center'},
                { label: 'responsable', name: 'responsable', width: 40, sorttype:"string", align:'center'},
                { label: 'fec_subido', name: 'fec_subido', width: 27, sorttype:"string", align:'center'},
                { label: 'estado', name: 'estado', width: 50, sorttype:"string", align:'center', formatter: gridDocumentos_formatterEstado},
                { label: 'btn_accion', name: 'btn_accion', width: 30, sorttype:"string", align:'center', formatter: gridDocumentos_formatterBtn},
                { label: 'btn_editar', name: 'btn_editar', width: 15, sorttype:"string", align:'center', formatter: gridDocumentos_formatterBtnEditar},
                { label: 'btn_eliminar', name: 'btn_eliminar', width: 15, sorttype:"string", align:'center', formatter: gridDocumentos_formatterBtnEliminar},
                { label: 'btn_historico', name: 'btn_historico', width: 25, sorttype:"string", align:'center', formatter: gridDocumentos_formatterBtnHistorico},
            ],
            pager: '#pagerGridDocumentos',
            rownumbers: true,
            caption: "DOCUMENTOS",
            shrinkToFit: true,

            //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
            ondblClickRow: function (rowid,iRow,iCol,e) {

            },
            loadComplete: function () {

            },
                
        });

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridDocumentos").jqGrid('filterInput', self.value);
            },0);
        });

        jQuery("#gridDocumentos").jqGrid('setGroupHeaders', {
            useColSpanStyle: false, 
            groupHeaders:[
              {startColumnName: 'proceso', numberOfColumns: 5, titleText: '<span class="badge bg-green">DOCUMENTO</span>'},
              {startColumnName: 'responsable', numberOfColumns: 2, titleText: '<span class="badge bg-green">RESPONSABLE</span>'},
              {startColumnName: 'btn_accion', numberOfColumns: 4, titleText: '<span class="badge bg-green">ACCIONES</span>'},
            ]
        });

        function gridDocumentos_formatterBtn(cellvalue, options, rowObject){

            if(rowObject.estado == 4 || rowObject.estado == 5 || rowObject.estado == 3 || rowObject.estado == 2 || rowObject.estado == 1){
                new_formatter_btn ='<a href="javascript:void(0)" onclick="abrirAchivo(\''+rowObject.path+'\')"><i class="fa fa-cloud-download"> Abrir</i></a>'
            }else{
                new_formatter_btn=''
            }

            return new_formatter_btn

        }//end functionBtn

        function gridDocumentos_formatterBtnEditar(cellvalue, options, rowObject){

            if(rowObject.estado == 4 || rowObject.estado == 5 || rowObject.estado == 3 || rowObject.estado == 2 || rowObject.estado == 1){
                new_formatter_btn ='<a href="javascript:void(0)" onclick="editarDocumento(\''+rowObject.id+'\')"><i class="fa fa-pencil" style="color:orange"></i></a>'
            }else{
                new_formatter_btn=''
            }

            return new_formatter_btn

        }//end function gridDocumentos_formatterBtnEditar

        function gridDocumentos_formatterBtnEliminar(cellvalue, options, rowObject){

            //if(rowObject.estado == 4 || rowObject.estado == 5 || rowObject.estado == 3 || rowObject.estado == 2 || rowObject.estado == 1){
                new_formatter_btn ='<a href="javascript:void(0)" onclick="eliminarDocumento(\''+rowObject.id+'\')"><i class="fa fa-close" style="color:red"></i></a>'
            //}else{
                //new_formatter_btn=''
            //}

            return new_formatter_btn

        }//end function gridDocumentos_formatterBtnEditar

        function gridDocumentos_formatterEstado(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_estado = '<span class="badge bg-yellow" >Sin Archivo</span>'
            }
            if(rowObject.estado == 1){
                new_formatter_estado = '<i class="fa fa-clock-o" style="color:red;">En Revision</i>'
            }
            if(rowObject.estado == 2){
                new_formatter_estado = '<i class="fa fa-commenting-o" style="color:red;">Observaciones</i>'
            }
            if(rowObject.estado == 3){
                new_formatter_estado = '<i class="fa fa-clock-o" style="color:red;">En Revision</i>'
            }
            if(rowObject.estado == 4){
                new_formatter_estado = '<i class="fa fa-check" style="color:green;">Aprobado y Vigente</i>'
            }
            if(rowObject.estado == 5){
                new_formatter_estado = '<i class="fa fa-info-circle" style="color:red;"> No Vigente</i>'
            }
            return new_formatter_estado
        }

        function gridDocumentos_formatterBtnHistorico(cellvalue, options, rowObject){
            if (rowObject.estado>0){
                return '<a href="/historico_documento?documento_id='+rowObject.id+'"><i class="fa fa-file-excel-o text-green"></i> Historico</a>';
             }else{
                return '';
             }
        }//end function gridDocumentos_formatterBtnHistorico

    }//end function gridDocumentos


    function editarDocumento(id_documento){

         //token
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/select_documento/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_documento:id_documento,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    //data consultada
                    $("#modalEditarProcedimiento #id_documento").val(id_documento);
                    $("#modalEditarProcedimiento #nombre").val(data.nombre);
                    $("#modalEditarProcedimiento #descripcion").val(data.descripcion);
                    $("#modalEditarProcedimiento #version").val(data.version);

                    //mostrarl modal
                    $("#modalEditarProcedimiento").modal('show');

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

    }//end function editarDocumento


    function grabarCambiosProcedimiento(){

        //data
        var id_documento = $("#modalEditarProcedimiento #id_documento").val();
        var nombre       = $("#modalEditarProcedimiento #nombre").val();
        if(nombre=='' || nombre==null){
            swal('Ingrese un Nombre !!', '', 'info');
            return false;
        }
        var descripcion  = $("#modalEditarProcedimiento #descripcion").val();
        var version      = $("#modalEditarProcedimiento #version").val();
        if(version=='' || version==null){
            swal('Ingrese una versión !!', '', 'info');
            return false;
        }

        swal({
          title: "Desea modificar el Procedimiento ?",
          text: "",
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
                url: "/actualizar_documento/",
                data:{
                    csrfmiddlewaretoken : csrftoken,
                    id_documento:id_documento,
                    nombre:nombre,
                    descripcion:descripcion,
                    nombre:nombre,
                    descripcion:descripcion,
                    version:version
                },
                dataType: "json",
                success: function(data) {
                    var codigo =data.resultado;
                    if (codigo=="ok_update"){
                        //ocultar Modal
                        $('#modalEditarProcedimiento').modal('hide');
                        //mensaje ok update
                        swal("Procedimiento Actualizado !!", "", "success");

                        //recargar
                        jQuery("#gridDocumentos").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid');
                        //$('#gridDocumentos').trigger( 'reloadGrid' );
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
          } else {
            return false;
          }
        });


    }//end function grabarCambiosProcedimiento

  function eliminarDocumento(id_documento){

     swal({
          title: "Desea eliminar el Procedimiento ?",
          text: " Una vez eliminado no podra ser recuperado !! ",
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
                url: "/eliminar_documento/",
                data:{
                    csrfmiddlewaretoken : csrftoken,
                    id_documento:id_documento,
                },
                dataType: "json",
                success: function(data) {
                    var codigo =data.resultado;
                    if (codigo=="ok_delete"){
                        //mensaje ok update
                        swal("Procedimiento Eliminado !!", "", "success");
                        //recargar
                        jQuery("#gridDocumentos").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid');
                        //$('#gridDocumentos').trigger( 'reloadGrid' );
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
          } else {
            return false;
          }
      });

    }//end function eliminarDocumento


