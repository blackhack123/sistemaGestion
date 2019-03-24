    

    //autocargar funcion
    window.onload = gridNormas;


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
    /**FUNCION cargarModalNorma *****************/
    /*********************************************/

    function cargarModalNorma(){

        //mostrar modal
        $('#modalNorma').modal({'show':true, backdrop: 'static', keyboard: false});
        //set focus
        $('#modalNorma').on('shown.bs.modal', function () {
            $('#norma').trigger('focus')
        });
        $("#formNorma").attr("action", "/insertNorma");
        $('#modalNorma #accion').val("insert");
        //limpiar formulario
        document.getElementById('formNorma').reset();
        $("#modalNorma #estado").val(1);
        $("#divDocumento").hide();
        $("#divSelectDocumento").show();
        $("#div_personal").hide();

    }//end funcion cargarModalNorma

    


    /** 
     * PERMITE CARGAR GRILLA DE areas
    */
   function gridNormas(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridNormas").jqGrid({
            url:'/gridNormas/',
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
            colNames:['ID','NORMA','docFile', 'id_personal','id_cargo','AUDITOR LÍDER','','ESTADO', '', ''],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'nombre', name: 'nombre', width: 40, sorttype:"string", align:'center'},
                { label: 'docfile', name: 'docfile', width: 40, sorttype:"string", align:'center', hidden:true},
                { label: 'id_personal', name: 'id_personal', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'id_cargo_id', name: 'id_cargo_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'auditor_lider', name: 'auditor_lider', width: 30, sorttype:"string", align:'center', formatter:gridNormas_FormatterLider},
                { label: 'estado', name: 'estado', width: 15, sorttype:"string", align:'center', hidden:true},
                { label: 'estadoA', name: 'estadoA', width: 15, sorttype:"string", align:'center', formatter: gridNormas_FormatterEstado},
                { name:'btn_report_PdfNorma' , width:10, align:"center", formatter:gridNormas_FormatterReporte},
                { name:'btn_editar_Norma' , width:10, align:"center", formatter:gridNormas_FormatterEdit }
            ],
            pager: '#pagerNormas',
            rownumbers: true,
            caption: "Normas",
            shrinkToFit: true,

            //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
            ondblClickRow: function (rowid,iRow,iCol,e) {
            
                //get data seleccionada
                var data = $('#gridNormas').getRowData(rowid);	
                //asignar a variables la data
                var id              = data.id;
                var nombre          = data.nombre;
                var urlDocumento    = data.docfile;
                var estado          = data.estado;

                //asignar data existente a modal
                $("#formNorma").attr("action", "/updateNorma");
                $('#modalNorma #id_idNorma').val(id);
                $('#modalNorma #accion').val("update");

                //MOSTRAR LINK DE DOCUMENTO
                var hostName=window.location.host+"/"
                var linkDoc="http://"+hostName+urlDocumento;
                $("#divDocumento").show();
                $("#divSelectDocumento").hide();
                document.getElementById("btnMostrarDocumento").onclick = function(){
                    window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
                }//end function 
                

                $('#modalNorma #norma').val(nombre);
                $('#modalNorma #estado').val(estado);
                if(data.id_personal!=null && data.id_cargo_id){
                    $("#modalNorma #cargo").val(data.id_cargo_id);
                    cargarPersonal(data.id_cargo_id, data.id_personal);
                }//endif
                //mostrar modal
                $('#modalNorma').modal({'show':true, backdrop: 'static', keyboard: false});
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

        $('#gridNormas').setGroupHeaders({
        useColSpanStyle: true,
        groupHeaders:
        [
            { "numberOfColumns": 2, "titleText": "Acciones", "startColumnName": "btn_report_PdfNorma" }
        ]
        });
        //responsive jqgrid
        $(window).on("resize", function () {
            var $grid = $("#gridNormas"),
                newWidth = $grid.closest(".ui-jqgrid").parent().width();
            $grid.jqGrid("setGridWidth", newWidth, true);
        });
        //muestra el mensaje luego de cargar la grilla 
        emptyMsgDiv.insertAfter($("#gridNormas").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridNormas").jqGrid('filterInput', self.value);
            },0);
        });

        function gridNormas_FormatterEstado(cellvalue, options, rowObject)
        {	

            if(rowObject.estado == "1"){

                new_format_value = '<span class="badge bg-green">Activo</span>';
                return new_format_value;
            }else{

                new_format_value = '<span class="badge bg-red">Inactivo</span>';
                return new_format_value;

            }//end if

        }//end function gridNormas_FormatterEstado


    
        function gridNormas_FormatterEdit(cellvalue, options, rowObject){

            var id              = rowObject.id;	
            
            new_format_value = '<a href="javascript:void(0)" onclick="consultar_norma(\''+id+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i> Editar</a>';

            return new_format_value
            
        }//end function gridNormas_FormatterEdit

        function gridNormas_FormatterReporte(cellvalue, options, rowObject){

            var norma = rowObject.docfile
            new_format_value = '<a href="javascript:void(0)" onclick="abrir_normaPDF(\''+norma+'\')"><i class="fa fa-envelope" style="color:orange"></i> Abrir</a>';

            return new_format_value


        }//end function gridNormas_FormatterReporte

        function gridNormas_FormatterLider(cellvalue, options, rowObject){

            if(rowObject.auditor_lider !=null){
                new_format_value =rowObject.auditor_lider;
            }else{
                new_format_value ="<span class='badge bg-red'>Sin designar</span>";
            }//end if
            return new_format_value;
        }

    }//end function gridNormas


    function abrir_normaPDF(path){
        //abrir venta con pdf
        window.open(path, '_blank', 'location=yes,height=450,width=550,scrollbars=yes,status=yes');

    }//end function abrir_normaPDF


    /**
     * 
     * CONSULTAR NORMA POR ID
     */
    function consultar_norma(id){

        //token
        var csrftoken   = getCookie('csrftoken');
        var id_norma    = id;

        $.ajax({
            type: "POST",
            url: "/selectNorma/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_norma:id_norma,
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){
                    mostrarNormaExistente(data.norma_list);
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

    }//end function consultar_norma



    /**
     * 
     * PEMITE MOSTRAR NORMA EXISTENTE
     */
    function mostrarNormaExistente(norma_list){

        
        var data = norma_list;
        //asignar a variables la data
        var id              = data[0]['id'];
        var nombre          = data[0]['nombre'];
        var urlDocumento    = data[0]['docfile'];
        var estado          = data[0]['estado'];
        var id_cargo        = data[0]['id_cargo_id'];
        var id_personal     = data[0]['id_personal'];

        //asignar data existente a modal
        $("#formNorma").attr("action", "/updateNorma");
        $('#modalNorma #id_idNorma').val(id);
        $('#modalNorma #accion').val("update");

        //MOSTRAR LINK DE DOCUMENTO
        var hostName=window.location.host+"/"
        var linkDoc="http://"+hostName+urlDocumento;
        $("#divDocumento").show();
        $("#divSelectDocumento").hide();
        document.getElementById("btnMostrarDocumento").onclick = function(){
            window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
        }//end function 
        
        $('#modalNorma #norma').val(nombre);
        $('#modalNorma #estado').val(estado);

        if(id_cargo){

            //si existe cargo consulta el personal y los selecciona
            $("#cargo").val(id_cargo);
            cargarPersonal(id_cargo, id_personal);

        }else{

            //si no existe el cargo oculta el div del personal
            $("#div_personal").hide();
            
        }//end if

        //mostrar modal
        $('#modalNorma').modal({'show':true, backdrop: 'static', keyboard: false});


    }//end function mostrarNormaExistente



    function cargarPersonal(id_cargo, id_personal){
       

        //token
        var csrftoken   = getCookie('csrftoken');

        $.ajax({
            type: "POST",
            url: "/perPorCargo",
            data:{
                csrfmiddlewaretoken : csrftoken, 
                id_cargo:id_cargo,
            },
            dataType: "json",
            success: function(data) {
                //codigo de si trae o no data
                resultado = data.resultado;
                
                if(resultado =="ok_select"){
                
                    //remover todas las opciones
                    $('#personal').find('option').remove()
                    
                    //mostrar el div personal
                    $("#div_personal").show();
                    personal = data.personal_list;
                    //recorrer la data y asignar al select personal
                    for (i=0; i<personal.length; i++){
                        
                        //si existe id_personal lo selecciona x defecto
                        if(personal[i]['id'] == id_personal){ 
                            $('#personal').append('<option value='+personal[i]['id']+' selected="selected">'+personal[i]['nombre']+'</option>');
                        }else{
                            $('#personal').append('<option value='+personal[i]['id']+'>'+personal[i]['nombre']+'</option>');
                        }//end if

                    }//endfor
                    $('#personal').append('</select>');
                }//end if
                $("#div_personal").show();
                if(resultado=="no_ok"){
                    //en caso de que no exista personal con dicho cargo mostrar mensaje
                    swal("No existe personal con el Cargo seleccionado !!", "", "info");
                    //remover todas las opciones
                    $('#personal').find('option').remove()
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

                    swal('Requested JSON parse failed.', '', "error");
        
                } else if (textStatus === 'timeout') {

                    swal('Time out error', "", "error");
        
                } else if (textStatus === 'abort') {
                    swal('Ajax request aborted.', "", "error");
        
                } else {
                    swal('Uncaught Error: ' + jqXHR.responseText, "", "error");
        
                }//end if 

            }//end error
        }); 

    }//end function cargarPersonal