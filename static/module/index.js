    /**ESTABLECER TOGGLE BOOTSTRAP */
    //personal
    $('#permisoUsuario #personal').bootstrapToggle({ on: 'Habilitado', onstyle:'success', off: 'Desabilitado'});
    //usuarios
    $('#permisoUsuario #usuario').bootstrapToggle({ on: 'Habilitado', onstyle:'success', off: 'Desabilitado'});
    //areas
    $('#permisoUsuario #area').bootstrapToggle({ on: 'Habilitado', onstyle:'success', off: 'Desabilitado'});
    //Normas
    $('#permisoUsuario #norma').bootstrapToggle({ ograbarUsuarion: 'Habilitado', onstyle:'success', off: 'Desabilitado'});
    //Auditorias
    $('#permisoUsuario #auditoria').bootstrapToggle({ on: 'Habilitado', onstyle:'success', off: 'Desabilitado'});
    //Gestion Documental
    $('#permisoUsuario #documental').bootstrapToggle({ on: 'Habilitado', onstyle:'success', off: 'Desabilitado'});
    //SACS
    $('#permisoUsuario #sac').bootstrapToggle({ on: 'Habilitado', onstyle:'success', off: 'Desabilitado'});




    //autocargar funcion
    window.onload = gridUsuarios;
    function valorNorma(){
        if ($('#permisoUsuario #norma').prop('checked')== true){
            alert("ON");
        }else{
            alert("OFF");
        }
    }

    /*********************************************/
    /**FUNCION cargarModalCatProveedor*******/
    /*********************************************/

    function cargarModalUsuario(){
        $("#areas").hide();
        //mostrar modal
        $('#modalUsuario').modal({'show':true, backdrop: 'static', keyboard: false});

        $('#modalUsuario #accion').val("insert");
        //limpiar formulario
        document.getElementById('formUsuario').reset();
        document.getElementById("estadoUsuario").options[1].selected=true;


    }//end funcion cargarModalBodega


    function showAreas(id_tipo_usuario){
        if(id_tipo_usuario == "3"){
            $("#areas").show();
        }else{
            $("#areas").hide();
        }//end if

    }//end function showAreas

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
     * PERMITE CARGAR GRILLA DE USUARIOS
    */
    function gridUsuarios(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridUsuarios").jqGrid({
            url:'/gridUsuarios/',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            //data: mydata,
            loadonce: true,
            viewrecords: true,
            //width: 1000,
            autowidth:true,
            height: 250,
            rowNum:50,
            colNames:['ID','NOMBRE', 'TELEFONO', 'CORREO','USUARIO','DIRECT.','COLAB.', 'LID. NORM.','AUDIT.', 'AUD. LID.', 'LECT.', 'ESCRIT.', 'NIVEL', 'PROCESO','ESTADO', ''],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'nombre_personal', name: 'nombre_personal', width: 20, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'telefono', name: 'telefono', width: 40, sorttype:"string", align:'center', hidden:true},
                { label: 'correo', name: 'correo', width: 60, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'usuario', name: 'usuario', width: 20, sorttype:"string", align:'center'},
                { name: 'director', width: 10, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterDirector},
                { name: 'colaborador', width: 12, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterColaborador},
                { name: 'lider_norma', width: 14, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterLiderNorma},
                { name: 'auditor', width: 12, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterAuditor},
                { name: 'auditor_lider', width: 14, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterAuditorLider},
                { name: 'permiso_lectura', width: 14, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterLectura},
                { name: 'permiso_escritura', width: 14, sorttype:"string", align:'center', formatter:gridUsuarios_FormatterEscritura},
                { label: 'id_tipo_usuario_id', name: 'id_tipo_usuario_id', width: 30, sorttype:"string", align:'center', formatter: gridUsuarios_FormatterNivel, hidden:true},
                { label: 'proceso', name: 'proceso', width: 40, sorttype:"integer", align:'center', formatter:gridUsuarios_FormatterProceso},
                { label: 'estado', name: 'estado', width: 15, sorttype:"string", align:'center', formatter: gridUsuarios_FormatterEstado},
                { name:'btn_editar_bodega' , width:8, align:"center", formatter:gridUsuarios_FormatterEdit },
            ],
            pager: '#pagerUsuarios',
            rownumbers: true,
            caption: "Usuarios",
            shrinkToFit: true,
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    emptyMsgDiv.show();
                } else {
                    $(this).show();
                    emptyMsgDiv.hide();
                }
            },
        });
        jQuery("#gridUsuarios").jqGrid('setGroupHeaders', {
            useColSpanStyle: false,
            groupHeaders:[
              {startColumnName: 'id', numberOfColumns: 5, titleText: '<span class="badge bg-green">USUARIO</span>'},
              {startColumnName: 'director', numberOfColumns: 5, titleText: '<span class="badge bg-green">TIPO DE USUARIO</span>'},
              {startColumnName: 'permiso_lectura', numberOfColumns: 2, titleText: '<span class="badge bg-green">PERMISOS</span>'},
              {startColumnName: 'proceso', numberOfColumns: 1, titleText: '<span class="badge bg-green">PROCESO</span>'},
              {startColumnName: 'estado', numberOfColumns: 2, titleText: ''},
            ]
        });
        //muestra el mensaje luego de cargar la grilla
        emptyMsgDiv.insertAfter($("#gridUsuarios").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridUsuarios").jqGrid('filterInput', self.value);
            },0);
        });


        function gridUsuarios_FormatterDirector(cellvalue, options, rowObject){

            if (rowObject.director == 1 ){
                formatter_director = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_director = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_director;

        }//end function gridUsuarios_FormatterDirector

        function gridUsuarios_FormatterColaborador(cellvalue, options, rowObject){

            if (rowObject.colaborador == 1 ){
                formatter_colaborador = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_colaborador = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_colaborador;

        }//end function gridUsuarios_FormatterColaborador

        function gridUsuarios_FormatterLiderNorma(cellvalue, options, rowObject){

            if (rowObject.lider_norma == 1 ){
                formatter_lider_norma = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_lider_norma = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_lider_norma;

        }//end function gridUsuarios_FormatterLiderNorma

        function gridUsuarios_FormatterAuditor(cellvalue, options, rowObject){

            if (rowObject.auditor == 1 ){
                formatter_auditor = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_auditor = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_auditor;

        }//end function gridUsuarios_FormatterAuditor

        function gridUsuarios_FormatterAuditorLider(cellvalue, options, rowObject){

            if (rowObject.auditor_lider == 1 ){
                formatter_auditor_lider = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_auditor_lider = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_auditor_lider;

        }//end function gridUsuarios_FormatterAuditorLider

        function gridUsuarios_FormatterLectura(cellvalue, options, rowObject){

            if (rowObject.permiso_lectura == 1 ){
                formatter_permiso_lectura = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_permiso_lectura = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_permiso_lectura;

        }//end function gridUsuarios_FormatterLectura

        function gridUsuarios_FormatterEscritura(cellvalue, options, rowObject){

            if (rowObject.permiso_escritura == 1 ){
                formatter_permiso_escritura = '<span class="fa fa-unlock text-green"></span>'
            }else{
                formatter_permiso_escritura = '<span class="fa fa-lock text-red"></span>'
            }
            return formatter_permiso_escritura;

        }//end function gridUsuarios_FormatterLectura


        function gridUsuarios_FormatterEstado(cellvalue, options, rowObject)
        {

            if(rowObject.estado == "1"){

                new_format_value = '<span class="badge bg-green">Activo</span>';
                return new_format_value;
            }else{

                new_format_value = '<span class="badge bg-red">Inactivo</span>';
                return new_format_value;

            }//end if

        }//end function gridBodegas_FormatterEstado



        function gridUsuarios_FormatterEdit(cellvalue, options, rowObject){

            var id              = rowObject.id;
            var nombre          = rowObject.nombre_personal;

			new_format_value = '<a href="javascript:void(0)" onclick="consultar_usuario(\''+id+'\',\''+nombre+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i></a>';

            return new_format_value

        }//end function gridBodegas_FormatterEdit


        function gridUsuarios_FormatterNivel(cellvalue, options, rowObject){

            if(rowObject.id_tipo_usuario_id == "1"){

                new_format_value = '<span class="badge bg-yellow">Administrador</span>';
                return new_format_value;
            }
            if(rowObject.id_tipo_usuario_id == "2"){

                new_format_value = '<span class="badge bg-aqua">Auditor</span>';
                return new_format_value;

            }//end if
            if(rowObject.id_tipo_usuario_id == "3"){

                new_format_value = '<span class="badge bg-blue">Colaborador</span>';
                return new_format_value;

            }//end if

            if(rowObject.id_tipo_usuario_id == "4"){

                new_format_value = '<span class="badge bg-teal">Director de Área</span>';
                return new_format_value;

            }//end if

            if(rowObject.id_tipo_usuario_id == "5"){

                new_format_value = '<span class="badge bg-purple">Auditor Lider</span>';
                return new_format_value;

            }//end if
            if(rowObject.id_tipo_usuario_id == "6"){

                new_format_value = '<span class="badge bg-green">Lider de Norma</span>';
                return new_format_value;

            }//end if

        }//end function gridUsuarios_FormatterNivel

        function gridUsuarios_FormatterProceso(cellvalue, options, rowObject){

            var proceso  = rowObject.proceso;

            if(proceso != null){
                new_format_value = '<span class="badge bg-blue">'+proceso+'</span>';
            }else{
                new_format_value = '<span class="badge bg-red"> Sin designar</span>';
            }//end if

            return new_format_value;

        }//end function gridUsuarios_FormatterProceso


    }//end function gridUsuarios



    /**
     * CONSLTAR USUARIO POR ID
     */
    function consultar_usuario(id, nombre){

        var id_usuario      = id;
        var nombre          = nombre;

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectUsuario/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_usuario:id_usuario,
                nombre:nombre,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    mostrarUsuarioExistente(data.usuario_list);
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


    }//end function consultar_usuario


    /**
     *
     * MOSTRAR USUARIO POR ID EXISTENTE
     */
    function mostrarUsuarioExistente(usuario_list){

        var id_usuario          = usuario_list.idUsuario;
        var id_personal         = usuario_list.id_personal;
        var usuario             = usuario_list.usuario;
        var estado              = usuario_list.estado;
        var director            = usuario_list.director;
        var colaborador         = usuario_list.colaborador;
        var auditor             = usuario_list.auditor;
        var auditor_lider       = usuario_list.auditor_lider;
        var lider_norma         = usuario_list.lider_norma;
        var permiso_lectura     = usuario_list.permiso_lectura;
        var permiso_escritura   = usuario_list.permiso_escritura;


        //asignar data existente a modal
        $('#modalUsuarioMultiple #idUsuario').val(id_usuario);
        $('#modalUsuarioMultiple #accion').val("update");
        $('#modalUsuarioMultiple #id_personal').val(id_personal);
        $('#modalUsuarioMultiple #usuario').val(usuario);
        $('#modalUsuarioMultiple #clave').val("");

        if (estado =="1"){
            document.getElementById("estadoUsuarioMultiple").options[1].selected=true;
        }else{
            document.getElementById("estadoUsuarioMultiple").options[2].selected=true;
        }

        if (director == 1){
            $('#modalUsuarioMultiple #director').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #director').bootstrapToggle('off')
        }

        if (colaborador == 1){
            $('#modalUsuarioMultiple #colaborador').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #colaborador').bootstrapToggle('off')
        }

        if (lider_norma == 1){
            $('#modalUsuarioMultiple #lider_norma').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #lider_norma').bootstrapToggle('off')
        }

        if (auditor == 1){
            $('#modalUsuarioMultiple #auditor').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #auditor').bootstrapToggle('off')
        }

        if (auditor_lider == 1){
            $('#modalUsuarioMultiple #auditor_lider').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #auditor_lider').bootstrapToggle('off')
        }

        if (permiso_lectura == 1){
            $('#modalUsuarioMultiple #permiso_lectura').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #permiso_lectura').bootstrapToggle('off')
        }

        if (permiso_escritura == 1){
            $('#modalUsuarioMultiple #permiso_escritura').bootstrapToggle('on')
        }else{
            $('#modalUsuarioMultiple #permiso_escritura').bootstrapToggle('off')
        }

        //mostrar modal
        $('#modalUsuarioMultiple').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrarUsuarioExistente


/*
    function confirmarGrabar(){

            var accion = $('#modalUsuario #accion').val();
            if(accion == "insert"){
                swal({
                    title: "Desea insertar los Datos ?",
                    icon: "info",
                    buttons: true,
                    dangerMode: true,
                })
                .then((willDelete) => {
                    if (willDelete) {
                        insertUsuario();
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
                        updateUsuario();
                    }
                });
            }//end if

    }//END FUNCTION confirmarGrabar


    function insertUsuario(){

        //token
        var csrftoken = getCookie('csrftoken');

        //datos de categoria de proveedores
        var id_personal		    =  $('#modalUsuario #id_personal').val();
        if (id_personal==""){
            swal("Seleccione un nombre", "", "info");
            return false;
        }//end if
        var usuario		        =  $('#modalUsuario #usuario').val();
        if (usuario==""){
            swal("Ingrese un usuario", "", "info");
            return false;
        }//end if
        var clave		        =  $('#modalUsuario #clave').val();
        var id_tipo_usuario_id  =  $('#modalUsuario #id_tipo_usuario').val();
        if (id_tipo_usuario_id =="" || id_tipo_usuario_id== null ){
            swal("Seleccione un nivel", "", "info");
            return false;
        }//end if
        var estado              =  $('#modalUsuario #estadoUsuario').val();
        if (estado=="" || estado == null ){
            swal("Seleccione un Estado", "", "info");
            return false;
        }//end if



        $.ajax({
            type: "POST",
            url: "/insertUsuarios/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_personal:id_personal,
                usuario:usuario,
                clave:clave,
                id_tipo_usuario_id:id_tipo_usuario_id,
                estado:estado,
                datetime:datetimenow(),
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#modalUsuario').modal('hide');
                    //recargar grilla
                    $('#gridUsuarios').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");

                }
                if(codigo=="no_ok"){

                 swal('Usuario existente no puede ser Ingresado !!', "", "info");

                }//end if
                if(codigo == 'no_ok_personal'){
                    swal(mensaje, "", "info");
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

    }//end function insertUsuario



    function updateUsuario(){

        //token
        var csrftoken = getCookie('csrftoken');

        //datos
        var id_usuario		=  $('#modalUsuarioMultiple #idUsuario').val();
        var id_personal		=  $('#modalUsuarioMultiple #id_personal').val();
        if (id_personal == "" || id_personal== null){
            swal("Seleccione un nombre", "", "info");
            return false;
        }//end if

        var usuario		        =  $('#modalUsuarioMultiple #usuario').val();
        if (usuario==""){
            swal("Ingrese un usuario", "", "info");
            return false;
        }//end if
        var clave		        =  $('#modalUsuarioMultiple #clave').val();
        var estado              =  $('#modalUsuarioMultiple #estadoUsuario').val();
        if (estado=="" || estado == null ){
            swal("Seleccione un Estado", "", "info");
            return false;
        }//end if

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #director").prop('checked') == false){
            var director = 0;
        }else{
            var director = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #colaborador").prop('checked') == false){
            var colaborador = 0;
        }else{
            var colaborador = 1;
        }

       //get data bootstrap toogle
        if($("#modalUsuarioMultiple #lider_norma").prop('checked') == false){
            var lider_norma = 0;
        }else{
            var lider_norma = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #auditor").prop('checked') == false){
            var auditor = 0;
        }else{
            var auditor = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #auditor_lider").prop('checked') == false){
            var auditor_lider = 0;
        }else{
            var auditor_lider = 1;
        }

        //verificar al menos un tipo de usuario
        if((director == 0) && (colaborador == 0) && (lider_norma == 0) && (auditor == 0) && (auditor_lider == 0)){
            swal("Debe establecer al menos un nivel de usuario !!", "", "info");
             return false;
        }

        $.ajax({
            type: "POST",
            url: "/updateUsuario/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_usuario:id_usuario,
                id_personal:id_personal,
                usuario:usuario,
                clave:clave,
                id_tipo_usuario_id:id_tipo_usuario_id,
                estado:estado,
                datetime:datetimenow(),
                //id_proceso:id_proceso,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){

                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalUsuario').modal('hide');
                    //recargar grilla
                    $('#gridUsuarios').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");

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

    }//end function updateUsuario

*/

    /*********************************************/
    /****** FUNCION cargarModal Permisos *********/
    /*********************************************/

    function cargarModalPermisos(){

        //mostrar modal
        $('#permisoUsuario').modal({'show':true, backdrop: 'static', keyboard: false});

        $('#permisoUsuario #accion').val("insert");
        //limpiar formulario
        document.getElementById('formPermisoUsuario').reset();
       //reset checkbox
        $('input[type="checkbox"]').each(function () {
            $(this).bootstrapToggle('off');
        });

    }//end funcion cargarModalPermisos






    /**
     * FUNCION CONFIRMAR ACCION
     * INSERTAR / ACTUALIZAR
     * el cual se determina por la accion
     *
     */
    function confirmarGrabarPermisos(){

        var accion = $('#permisoUsuario #accion').val();
        if(accion == "insert"){
            swal({
                title: "Desea grabar los Datos ?",
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    insertPermiso();
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
                    updatePermiso();
                }
            });


        }//end if


    }//END FUNCTION confirmarGrabar


    function insertPermiso(){

        var id_usuario  = $("#permisoUsuario #id_usuario").val();
        console.log(id_usuario);
        if (id_usuario == "" || id_usuario == null ){
            swal("Seleccione un Usuario", "", "info");
            return false;
        }//end if

        if ($("#permisoUsuario #personal").prop('checked') == true ){
            var personal = "on";

        }else{
            var personal = "off";
        }//end if

        if ($("#permisoUsuario #usuario").prop('checked') == true ){
            var usuario = "on";

        }else{
            var usuario = "off";
        }//end if

        if ($("#permisoUsuario #area").prop('checked') == true ){
            var area = "on";

        }else{
            var area = "off";
        }//end if

        if ($("#permisoUsuario #norma").prop('checked') == true ){
            var norma = "on";

        }else{
            var norma = "off";
        }//end if


        if ($("#permisoUsuario #auditoria").prop('checked') == true ){
            var auditoria = "on";

        }else{
            var auditoria = "off";
        }//end if


        if ($("#permisoUsuario #documental").prop('checked') == true ){
            var documental = "on";

        }else{
            var documental = "off";
        }//end if

        if ($("#permisoUsuario #sac").prop('checked') == true ){
            var sac = "on";

        }else{
            var sac = "off";
        }//end if

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/insertPermisos/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_usuario:id_usuario,
                personal:personal,
                usuario:usuario,
                area:area,
                norma:norma,
                auditoria:auditoria,
                documental:documental,
                sac:sac,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_insert"){

                    //mensaje exitoso update
                    swal(mensaje, "", "success");
                    //ocultar modal
                    $('#permisoUsuario').modal('hide');
                    //recargar grilla
                    $('#gridUsuarios').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");

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

    }//end function insertPermiso


    function getPermisos(id_usuario){

        //token
        var csrftoken = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/selectPermisos/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_usuario:id_usuario,
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_select"){
                    //permisos
                    var permisos_list = data.permisos;
                    setPermisos(permisos_list);
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

    }//end function getPermisos


    function setPermisos(permisos_list){

        //data retornante
        var has_personal    = permisos_list['0']['has_personal'];
        var has_area        = permisos_list['0']['has_area'];
        var has_auditoria   = permisos_list['0']['has_auditoria'];
        var has_usuario     = permisos_list['0']['has_usuario'];
        var has_norma       = permisos_list['0']['has_norma'];
        var has_documental  = permisos_list['0']['has_documental'];
        var has_sac         = permisos_list['0']['has_sac'];
        //establecer checked
        $('#permisoUsuario #personal').bootstrapToggle(has_personal);
        $("#permisoUsuario #area").bootstrapToggle(has_area);
        $("#permisoUsuario #auditoria").bootstrapToggle(has_auditoria);
        $("#permisoUsuario #usuario").bootstrapToggle(has_usuario);
        $("#permisoUsuario #norma").bootstrapToggle(has_norma);
        $("#permisoUsuario #documental").bootstrapToggle(has_documental);
        $("#permisoUsuario #sac").bootstrapToggle(has_sac);


    }//end function setPermisos

    // funtion para el busqueda autocomplete
    function consultarPersonal(term){

        total_caracteres = term.length;
        if(total_caracteres >= 1){

            //token
            var csrftoken = getCookie('csrftoken');

            $.ajax({
                type: "GET",
                url: "/autocomplete_personal",
                data:{
                    csrfmiddlewaretoken : csrftoken,
                    term:term,
                },
                dataType: "json",
                success: function(data) {

                    $('#json-datalist').find('option').remove();
                    for(i=0; i<data.length; i++){
                        personal_option = "<option value='" + data[i]['nombre']+ "'>" + data[i]['nombre'] +"</option>";
                        $('#json-datalist').append(personal_option);
                    }

                },
                error: function( jqXHR, textStatus, errorThrown ) {

                    if (jqXHR.status === 0) {

                        swal('Error al intentar Conectarse: Verifique su conexion a Internet.', "", "error");

                    } else if (jqXHR.status == 404) {

                        swal('La Pagina solicitada no fue encontrada [404]', "", "error");

                    } else if (jqXHR.status == 500) {

                        swal('Erro Interno [500]', "", "error");

                    } else if (textStatus === 'parsererror') {

                        swal('Error en el retorno de Datos. [parseJson]', "", "error");

                    } else if (textStatus === 'timeout') {

                        swal('Tiempo de Espera agotado', "", "error");

                    } else if (textStatus === 'abort') {
                        swal('Solicitud Abortada. [Ajax Request]', "", "error");

                    } else {
                        swal('Error desconocido: ' + jqXHR.responseText, "", "error");

                    }//end if

                }//end error
            });
        }
    }//end function



    /*********************************************/
    /**FUNCION cargarModalUsuarioLectura *********/
    /*********************************************/

    function cargarModalUsuarioLectura(){

        //grid documentos
        gridDocumentosAprobados();

        //mostrar modal
        $('#modalUsuarioLectura').modal({'show':true, backdrop: 'static', keyboard: false});

        //accion
        $('#modalUsuarioLectura #accion').val("insert");

        //limpiar formulario
        document.getElementById('formUsuarioLectura').reset();
        //establecer select
        document.getElementById("estadoUsuarioLectura").options[1].selected=true;

    }//end function cargarModalUsuarioLectura




    function gridDocumentosAprobados(){

        var csrftoken = getCookie('csrftoken');
        $("#gridDocumentos").jqGrid({
            url:'/griddocumentos_disponibles/',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 500,
            height: 150,
            rowNum:1000,
            colNames:['','PROCESO','PROCEDIMIENTO', 'NOMBRE', 'VERSIÓN','DESCRIP.',''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'proceso', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'procedimiento', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'nombre', width: 20, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'version', width: 15, sorttype:"string", align:'center'},
                { name: 'descripcion', width: 15, sorttype:"string", align:'center', formatter: gridDocumentos_FormatterDescricion},
                { name: 'estado', width: 15, sorttype:"integer", align:'center', hidden:true},
            ],
            multiselect: true,
            pager: '#pagerDocumentos',
            rownumbers: true,
            caption: "Documentos",
            shrinkToFit: true,

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

        function gridDocumentos_FormatterDescricion(cellvalue, options, rowObject){

            if (rowObject.descripcion){

                new_formatter = '<a href="javascript:void(0)" onclick="mostrar_detalle(\''+rowObject.descripcion+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
            }else{
                new_formatter= "";
            }
            return new_formatter

        }//end funcion gridDocumentos_FormatterDescricion

    }//end function gridAreas


    function mostrar_detalle(data){

       $("#modalDetalle #descripcion").html(data.replace(/(<([^>]+)>)/ig,""));
       $("#modalDetalle").modal('show');

    }//end funtion

/* NUEVA METODOLOGIA */

    function cargarModalUsuarioMultiple(){


        //mostrar modal
        $('#modalUsuarioMultiple').modal({'show':true, backdrop: 'static', keyboard: false});

        //accion
        $('#modalUsuarioMultiple #accion').val("insert");

        //limpiar formulario
        document.getElementById('formUsuarioMultiple').reset();

        //reset bootstrap toogle
        $('.toogle_reset').bootstrapToggle('off');

        //establecer select
        document.getElementById("estadoUsuarioMultiple").options[1].selected=true;

    }//end function cargarModalUsuarioLectura



    function grabarUsuario(){

        var accion = $("#modalUsuarioMultiple #accion").val();
        swal({
          title: "Desea grabar los datos ?",
          text: "",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            if (accion == 'insert'){
                insertUsuarioMultiple();
            }
            if(accion == 'update'){
                updateUsuarioMultiple();
            }
          } else {
            return false;
          }
        });

    }//end function grabarUsuario


    function insertUsuarioMultiple(){

        //token
        var csrftoken = getCookie('csrftoken');

        //datos de categoria de proveedores
        var accion              = $().val("#modalUsuarioMultiple #accion").val();
        var id_personal		    =  $('#modalUsuarioMultiple #id_personal').val();
        if (id_personal=="" || id_personal == null){
            swal("Ingrese un nombre", "", "info");
            return false;
        }//end if
        var usuario		        =  $('#modalUsuarioMultiple #usuario').val();
        if (usuario=="" || usuario== null){
            swal("Ingrese un usuario", "", "info");
            return false;
        }//end if

        var clave		        =  $('#modalUsuarioMultiple #clave').val();
        if(accion == 'insert'){
            if(clave == "" || clave == null){
                swal("Ingrese una clave", "", "info");
                return false;
            }
        }
        var estado              =  $('#modalUsuarioMultiple #estadoUsuarioMultiple').val();
        if(estado == "" || estado == null){
            swal("Seleccione el Estado !!", "", "info");
            return false;
        }
        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #director").prop('checked') == false){
            var director = 0;
        }else{
            var director = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #colaborador").prop('checked') == false){
            var colaborador = 0;
        }else{
            var colaborador = 1;
        }

       //get data bootstrap toogle
        if($("#modalUsuarioMultiple #lider_norma").prop('checked') == false){
            var lider_norma = 0;
        }else{
            var lider_norma = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #auditor").prop('checked') == false){
            var auditor = 0;
        }else{
            var auditor = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #auditor_lider").prop('checked') == false){
            var auditor_lider = 0;
        }else{
            var auditor_lider = 1;
        }

        //verificar al menos un tipo de usuario
        if((director == 0) && (colaborador == 0) && (lider_norma == 0) && (auditor == 0) && (auditor_lider == 0)){
            swal("Debe establecer al menos un nivel de usuario !!", "", "info");
             return false;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #permiso_lectura").prop('checked') == false){
            var permiso_lectura = 0;
        }else{
            var permiso_lectura = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #permiso_escritura").prop('checked') == false){
            var permiso_escritura = 0;
        }else{
            var permiso_escritura = 1;
        }

        //verificar al menos un permiso
        if((permiso_lectura == 0) && (permiso_escritura == 0)){
            swal("Debe establecer al menos un permiso para el Usuario !!", "", "info");
             return false;
        }

        swal({
          title: "Desea grabar los datos ?",
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
                url: "/insertarusuario_multinivel",
                data:{
                    csrfmiddlewaretoken : csrftoken,
                    datetime:datetimenow(),
                    id_personal:id_personal,
                    usuario:usuario,
                    clave:clave,
                    estado:estado,
                    director:director,
                    colaborador:colaborador,
                    lider_norma:lider_norma,
                    auditor:auditor,
                    auditor_lider:auditor_lider,
                    permiso_lectura:permiso_lectura,
                    permiso_escritura:permiso_escritura
                },
                dataType: "json",
                success: function(data) {
                    var codigo = data.resultado;
                    if(codigo == 'no_ok_personal'){
                        swal(data.mensaje, "", "info");
                        return false;
                    }
                    if(codigo == 'no_ok'){
                        swal("El usuario ya existe, no puede ser ingresado !!", "", "info");
                        return false;
                    }
                    if(codigo == 'ok_insert'){
                        //ocultar modal
                        $("#modalUsuarioMultiple").modal('hide');
                        //mensaje exitoso
                        swal("Datos grabados con exito !!", "", "success");
                        //actualizar grid
                        jQuery("#gridUsuarios").jqGrid('setGridParam',{datatype:'json'}).trigger('reloadGrid');
                        //$('#gridUsuarios').trigger( 'reloadGrid' );
                    }
                },
                error: function( jqXHR, textStatus, errorThrown ) {

                    if (jqXHR.status === 0) {

                        swal('Error al intentar Conectarse: Verifique su conexion a Internet.', "", "error");

                    } else if (jqXHR.status == 404) {

                        swal('La Pagina solicitada no fue encontrada [404]', "", "error");

                    } else if (jqXHR.status == 500) {

                        swal('Erro Interno [500]', "", "error");

                    } else if (textStatus === 'parsererror') {

                        swal('Error en el retorno de Datos. [parseJson]', "", "error");

                    } else if (textStatus === 'timeout') {

                        swal('Tiempo de Espera agotado', "", "error");

                    } else if (textStatus === 'abort') {
                        swal('Solicitud Abortada. [Ajax Request]', "", "error");

                    } else {
                        swal('Error desconocido: ' + jqXHR.responseText, "", "error");

                    }//end if

                }//end error
            });
          } else {
            swal("Los datos no fueron grabados !!");
            return false;
          }
        });

    }//end function insertUsuarioMultiple


    function updateUsuarioMultiple(){

        //token
        var csrftoken = getCookie('csrftoken');

        //datos
        var id_usuario		=  $('#modalUsuarioMultiple #idUsuario').val();
        var id_personal		=  $('#modalUsuarioMultiple #id_personal').val();
        if (id_personal == "" || id_personal== null){
            swal("Seleccione un nombre", "", "info");
            return false;
        }//end if

        var usuario		        =  $('#modalUsuarioMultiple #usuario').val();
        if (usuario==""){
            swal("Ingrese un usuario", "", "info");
            return false;
        }//end if
        var clave		        =  $('#modalUsuarioMultiple #clave').val();
        var estado              =  $('#modalUsuarioMultiple #estadoUsuarioMultiple').val();
        if (estado=="" || estado == null ){
            swal("Seleccione un Estado", "", "info");
            return false;
        }//end if

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #director").prop('checked') == false){
            var director = 0;
        }else{
            var director = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #colaborador").prop('checked') == false){
            var colaborador = 0;
        }else{
            var colaborador = 1;
        }

       //get data bootstrap toogle
        if($("#modalUsuarioMultiple #lider_norma").prop('checked') == false){
            var lider_norma = 0;
        }else{
            var lider_norma = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #auditor").prop('checked') == false){
            var auditor = 0;
        }else{
            var auditor = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #auditor_lider").prop('checked') == false){
            var auditor_lider = 0;
        }else{
            var auditor_lider = 1;
        }

        //verificar al menos un tipo de usuario
        //if((director == 0) && (colaborador == 0) && (lider_norma == 0) && (auditor == 0) && (auditor_lider == 0)){
        //    swal("Debe establecer al menos un nivel de usuario !!", "", "info");
        //     return false;
        //}

                //get data bootstrap toogle
        if($("#modalUsuarioMultiple #permiso_lectura").prop('checked') == false){
            var permiso_lectura = 0;
        }else{
            var permiso_lectura = 1;
        }

        //get data bootstrap toogle
        if($("#modalUsuarioMultiple #permiso_escritura").prop('checked') == false){
            var permiso_escritura = 0;
        }else{
            var permiso_escritura = 1;
        }

        //verificar al menos un permiso
        //if((permiso_lectura == 0) && (permiso_escritura == 0)){
        //    swal("Debe establecer al menos un permiso para el Usuario !!", "", "info");
         //    return false;
        //}

        $.ajax({
            type: "POST",
            url: "/updateusuario_multinivel/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_usuario:id_usuario,
                id_personal:id_personal,
                usuario:usuario,
                clave:clave,
                estado:estado,
                datetime:datetimenow(),
                director:director,
                colaborador:colaborador,
                lider_norma:lider_norma,
                auditor:auditor,
                auditor_lider:auditor_lider,
                permiso_lectura:permiso_lectura,
                permiso_escritura:permiso_escritura
            },
            dataType: "json",
            success: function(data) {
                var mensaje=data.mensaje;
                var codigo =data.resultado;
                if (codigo=="ok_update"){
                    //mensaje ok update
                    swal(mensaje, "", "success");
                    //ocultar Modal
                    $('#modalUsuarioMultiple').modal('hide');
                    //recargar grilla
                    $('#gridUsuarios').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
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


    }//end function updateUsuarioMultiple
