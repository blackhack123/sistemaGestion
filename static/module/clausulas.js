

   /** 
     * PARAMETRIZAR DATATABLES
    */
   var table = $('#tableClausulas').DataTable( {
    // "pageLength": 5,
    //"scrollY":        "150px",
    //"scrollCollapse": true,
    
    //AGRUPA LAS NORMAS
    drawCallback: function (settings) {

        var api = this.api();
        var rows = api.rows({ page: 'current' }).nodes();
        var last = null;

        api.column(2, { page: 'current' }).data().each(function (group, i) {
            if (last !== group) {
                $(rows).eq(i).before(
                    '<tr class="group"><td colspan="8">' + '<span class="badge bg-green">Norma: ' + group  + '</span></td></tr>'
                )
                last = group;
            }
        });
    },//end grouping
    
    "aLengthMenu": [[5, 10, 50, 100,-1], [5, 10, 50, 100,"All"]],
    "iDisplayLength": 5,
     "language": {
     url: "/static/DataTables/es_ES.json"
     }
 });

 $('#tableClausulas tbody').on( 'click', 'tr', function()
 {
     if ($(this).hasClass('selected') )
     {
         $(this).removeClass('selected');

     }else{
     table.$('tr.selected').removeClass('selected');
     $(this).addClass('selected');
     }
 });
 
 
    

    
    //INSTANCIAMOS EL CKEDITOR DE CLAUSUAL
    CKEDITOR.replace( 'detalleClausula' );
    CKEDITOR.replace( 'detalleEditarClausula' );



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
    /**FUNCION cargar modal clausula **************/
    /*********************************************/

    function cargarModalClausula(){

        //mostrar modal
        $('#modalClausula').modal({'show':true, backdrop: 'static', keyboard: false});
        //set focus
        $('#modalClausula').on('shown.bs.modal', function () {
            $('#id_norma').trigger('focus')
        });

        $('#modalClausula #accion').val("extraer");
        //limpiar formulario
        document.getElementById('form_clausula').reset();
        //OCULTAR CKEDITOR
        //CKEDITOR.instances.detalleClausula.updateElement();
        //CKEDITOR.instances.detalleClausula.destroy();
        $("#modalClausula #numero_pagina").val('');
        $('#div_numeroPagina').show();
        $('#nombre_clausula').hide();
        $('#ckeditor').hide();
        //CKEDITOR.instances['detalleClausula'].setData("")
        

 
    }//end funcion cargarModalNorma



    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     * 
     */
    function confirmarGrabar(){

        var accion = $('#modalClausula #accion').val();
        if(accion == "extraer"){
            //extraer clausula de pdf
            extraerClausula();
        }else{
            if(accion == "insert"){
                swal({
                    title: "Desea insertar los Datos ?",
                    icon: "info",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        insertClausula();
                    }
                });
    
            }
            /*else{
    
                swal({
                    title: "Desea actualizar los Datos ?",
                    //text: "Desea Editar los Datos !",
                    icon: "info",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        updateClausula();
                    }
                });
            }//end if
            */
        }


    }//END FUNCTION confirmarGrabar

    function confirmarGrabarUpdate(){

        swal({
            title: "Desea grabar los Datos ?",
            icon: "info",
            buttons: true,
            dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
                updateClausula();
            }
        });
    }



    function extraerClausula(){

        var id_norma        = $("#modalClausula #id_norma").val();
        if (id_norma =="" || id_norma== null ){
            swal("Seleccione una Norma !", "", "info");
            return false;
        }//end if

        var escaneado_pdf        = $("#modalClausula #escaneado_pdf").val();
        if (escaneado_pdf =="" || escaneado_pdf== null ){
            swal("Seleccione si el PDF es Escaneado o No!!", "", "info");
            return false;
        }//end if

        var numero_pagina        = $("#modalClausula #numero_pagina").val();
        if (numero_pagina =="" || numero_pagina== null ){
            swal("Ingrese el numero de Pagina para extrar la informacion !!", "", "info");
            return false;
        }//end if

        //token
        var csrftoken       = getCookie('csrftoken');

					
        //efecto cargando
        $('body').waitMe({
            effect : 'ios',
            text : 'Procesando ...',
            bg : 'rgba(255,255,255,0.7)',
            color :'#000',
            maxSize : '',
            waitTime : -1,
            textPos : 'vertical',
            fontSize : '14',
            source : '',
            onClose : function() {}   
        });
                    
        $.ajax({
            type: "POST",
            url: "/extraerClausula/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_norma:id_norma,
                escaneado_pdf:escaneado_pdf,
                numero_pagina:numero_pagina,
            },
            dataType: "json",
            success: function(data) {
                //ocultar efecto cargando
                $('body').waitMe("hide");
                var codigo =data.resultado;
                if (codigo=="ok_select"){
                    $.get('media/normas/temporalPdf.txt', function(data) {
                    //establecer accion
                    $('#modalClausula #accion').val('insert');
                    $('#modalClausula #clausula').val('');
                    //set data ckeditor
                    $('#nombre_clausula').show();
                    $('#ckeditor').show();
                    console.log(data);
                    CKEDITOR.instances.detalleClausula.setData(data);
                    }, 'text');
                }    
            },//end success
            error: function( jqXHR, textStatus, errorThrown ) {
                $('body').waitMe("hide");
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

    }//end function extraerClausula


    function insertClausula(){


        var id_norma        = $("#modalClausula #id_norma").val();
        if (id_norma =="" || id_norma== null ){
            swal("Seleccione una Norma !", "", "info");
            return false;
        }//end if

       
        var clausula        = $("#modalClausula #clausula").val();
        if (clausula =="" || clausula== null ){
            swal("Escriba el nombre de la Clausula !", "", "info");
            return false;
        }//end if
        var descripcion     = CKEDITOR.instances.detalleClausula.getData();

        if (descripcion =="" || descripcion== null ){
            swal("Escriba el detalle de la Clausula !", "", "info");
            return false;
        }//end if
        
        //token
        var csrftoken       = getCookie('csrftoken');

        //ELIMINAR ESPACIOS ENTRE TAGS 
        nuevaDescripcion = descripcion.replace(/\s+/g, ' ');

        $.ajax({
            type: "POST",
            url: "/insertClausula/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_norma:id_norma,
                clausula:clausula,
                descripcion:nuevaDescripcion,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalClausula').modal('hide');
                    //recargar pagina
                    location.reload();
                }
                if(codigo=="no_ok"){
                    swal(mensaje, '', 'warning');
                    return false;
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


    }//end function insertClausula


    function updateClausula(){

        var id_clausula     = $("#editarClausula #id_clausula").val();
        var id_norma        = $("#editarClausula #id_norma").val();
        if (id_norma =="" || id_norma== null ){
            swal("Seleccione una Norma !", "", "info");
            return false;
        }//end if
        var clausula        = $("#editarClausula #clausula").val();
        if (clausula =="" || clausula== null ){
            swal("Escriba el nombre de la Clausula !", "", "info");
            return false;
        }//end if
        //var descripcion     = CKEDITOR.instances.detalleEditarClausula.getData();
        var descripcion     = CKEDITOR.instances['detalleEditarClausula'].getData()

        if (descripcion =="" || descripcion== null ){
            swal("Escriba el detalle de la Clausula edit !", "", "info");
            return false;
        }//end if

        //token
        var csrftoken       = getCookie('csrftoken');

        //ELIMINAR ESPACIOS ENTRE TAGS 
        nuevaDescripcion = descripcion.replace(/\s+/g, ' ');


        $.ajax({
            type: "POST",
            url: "/updateClausula/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_clausula:id_clausula,
                id_norma:id_norma,
                clausula:clausula,
                descripcion:nuevaDescripcion,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){
                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#editarClausula').modal('hide');
                    //recargar pagina
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

    }//end function updateClausula




    /**
     * 
     * CONSULTA CLAUSULA POR ID
     */
    function getClausula(id_clausula){
        
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
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                        mostrarClausulaExistente(data.clausula_list);
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
        
    
    }//end function selectClausula



    /**
     * 
     * MOSTRAR CLAUSULA EXISTENTE
     */
    function mostrarClausulaExistente(clausula_list){

        var id_clausula     = clausula_list.id;
        var id_norma        = clausula_list.id_norma;
        var clausula        = clausula_list.clausula;
        var descripcion     = clausula_list.descripcion;

        //ocultar numero pagina
        $("#editarClausula #div_numeroPagina").hide();
        //ASIGNAR DATOS A MODAL
        $("#editarClausula #accion").val("update");
        $("#editarClausula #id_clausula").val(id_clausula);
        $("#editarClausula #id_norma").val(id_norma);
        $("#editarClausula #clausula").val(clausula);
        CKEDITOR.instances['detalleEditarClausula'].setData(descripcion)
        $('#editarClausula').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function clausula_list



    function consultar_procesos(id_clausula){
       
        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/consultarProcesoNorma/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_clausula:id_clausula,
            },
            dataType: "json",
            success: function(data) {

                if(data.resultado == 'ok_select'){
                    document.getElementById('form_directorios').reset();
                    procesos    = data.procesos_list;
                    directorios = data.archivos;
                    //console.log(directorios);
                    //mostrar los procedimientos vinculados
                    var html = '';
                    for(i=0; i<procesos.length; i++){
                        html = html + '<li>'+procesos[i]['proceso']+'</li>'
                    }
                    $("#modalProcedimientos #procedimientos").html(html);


                    //mostrar directorios
                    html_table = '';
                    for (i=0; i<directorios.length; i++){
                        html_table = html_table + '<table class="table table-bordered">'
                        html_table = html_table + '<tr>'
                        html_table = html_table + '<td>'+'<i class="fa fa-folder-open-o"></i> '+directorios[i]['directorio']+'</td>'
                        html_table = html_table + '</tr>'
                        html_table = html_table + '<tr bgcolor="#bee5eb">';
                        html_table = html_table + '<td width="60%">Archivo</td>';
                        html_table = html_table + '<td width="10%">Accion</td>';
                        html_table = html_table + '</tr>';
                        archivos = directorios[i]['archivos'];
                        html_archivos ='';
                        if(archivos.length > 0){
                           for(j=0; j<archivos.length; j++){
                            ruta_absoluta_archivo = '"'+ directorios[i]['ruta_absoluta']+'/'+archivos[j]+'"';
                            html_table = html_table + '<tr>';
                            html_table = html_table + '<td>'+archivos[j]+'</td>';
                            html_table = html_table + "<td><a href='#' onclick='abrirDocumento("+ruta_absoluta_archivo+");'><i class='fa fa-eye'> Abrir</i></a></td>";
                            html_table = html_table + '</tr>';
                            }
                            $("#modalProcedimientos #contenedor_directorios").html(html_table);
                        }else{
                            html_table = html_table + '<tr>';
                            html_table = html_table + '<td><span class="badge bg-yellow">Sin Documentos</span></td>';
                            html_table = html_table + "<td><span class='badge bg-yellow'>Sin Documentos</span></td>";
                            html_table = html_table + '</tr>';
                        }
                    }
                    html_table = html_table + '</table>'
                    //mostrar directorios y archivos
                    $("#modalProcedimientos #contenedor_directorios").html(html_table);

                    //mostrar ventana modal
                    $("#modalProcedimientos").modal('show');


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

    }//end function consultar_procesos

    function abrirDocumento(path){

         window.open(path, '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes')
        /*
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/convertdoc_topdf/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                path:path,
            },
            dataType: "json",
            success: function(data) {
                alert('convertido');
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
        */
    }//end function abrirDocumento



    function consultar_clausula(id_clausula){

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
               if(data.resultado == 'ok_select'){
                result = data.clausula_list;
                var div = document.getElementById('contenido_clausula');
                div.innerHTML = result.descripcion.replace(/<\/?[^>]+(>|$)/g, "");
                $("#modalClausulaConsultada #titulo_clausula_consultada").html('Cláusula: '+result.clausula);
                $("#modalClausulaConsultada").modal('show');
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

    }//end function consultar_clausula