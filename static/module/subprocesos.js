    // Establece  campos requeridos class="value_required"
    $( '<span style="color:red;">*</span>' ).insertBefore( ".value_required" );

    //autocargar funcion
    window.onload = gridSubProcesos;

    
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
    * PERMITE CARGAR GRILLA DE Procesos
    */
   function gridSubProcesos(){

    var csrftoken = getCookie('csrftoken');
    emptyMsgDiv = $("<div style='margin-left:15px'><span class='badge bg-red'>No existen SubProcesos Vinculados !!</span></div>");
    $("#gridSubProcesos").jqGrid({
        url:'/gridSubProcesos/',
        postData: {
            csrfmiddlewaretoken : csrftoken, 
        },
        datatype: "json",
        //data: mydata,
        loadonce: true, 
        viewrecords: true,
        width: 750,
        height: 230,
        rowNum:10,
        colNames:['ID', 'AREA', 'PROCESO', 'SUBPROCESO', 'ESTADO', 'ESTADO', ''],
        colModel: [
            { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
            { label: 'area', name: 'area', width: 20, sorttype:"string", align:'center'},
            { label: 'proceso', name: 'proceso', width: 30, sorttype:"string", align:'center'},
            { label: 'subproceso', name: 'subproceso', width: 30, sorttype:"string", align:'center'},
            { label: 'estado', name: 'estado', width: 10, sorttype:"string", align:'center', hidden:true},
            { label: 'estado_procesoA', name: 'estado_procesoA', width: 15, sorttype:"string", align:'center', formatter: gridSubProcesos_FormatterEstado},
            { name:'btn_editar' , width:10, align:"center", formatter:gridSubProcesos_FormatterEdit },
        ],
        pager: '#pagerSubProcesos',
        rownumbers: true,
        caption: "SubProcesos",
        shrinkToFit: true,
        grouping: true,
        groupingView: {
            groupField: ["proceso"],
            groupColumnShow: [false],//set (false, true) para ocultar nombre grupo
            groupText: [
                "<strong>Proceso:<strong> <span class='badge bg-yellow'>{0}</span>" ,
            ],
            groupOrder: ["desc"],
            groupCollapse: true
        },
        ondblClickRow:function(rowid,iRow,iCol,e){
            //get data
            var data            = $('#gridSubProcesos').getRowData(rowid);
            //id subproceso
            var id_subproceso   = data.id;
            //consultar subproceso por id
            consultar_subProceso(id_subproceso);
        },
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
    //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
    var groupingView = $("#gridSubProcesos").jqGrid("getGridParam", "groupingView"),
    plusIcon = groupingView.plusicon,
    minusIcon = groupingView.minusicon;
    $("#gridSubProcesos").click(function (e) {
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
    emptyMsgDiv.insertAfter($("#gridSubProcesos").parent());

    //funcion Buscar
    var timer;
    $("#search_cells").on("keyup", function() {
        var self = this;
        if(timer) { clearTimeout(timer); }
        timer = setTimeout(function(){
            //timer = null;
            $("#gridSubProcesos").jqGrid('filterInput', self.value);
        },0);
    });

    function gridSubProcesos_FormatterEstado(cellvalue, options, rowObject)
    {	

        if(rowObject.estado == "1"){

            new_format_value = '<span class="badge bg-green">Activo</span>';
            return new_format_value;
        }else{

            new_format_value = '<span class="badge bg-red">Inactivo</span>';
            return new_format_value;

        }//end if

    }//end function gridProcesos_FormatterEstado


    
    function gridSubProcesos_FormatterEdit(cellvalue, options, rowObject){

        var id              = rowObject.id;	


        new_format_value = '<a href="javascript:void(0)" onclick="consultar_subProceso(\''+id+'\')"><i class="glyphicon glyphicon-pencil" style="color:orange"></i></a>'; 
        return new_format_value
        
    }//end function gridProcesos_FormatterEdit



}//end function gridSubProcesos


/**
 * 
 * mostrar los procesos 
 * por area(id)
 * 
 */
function mostrarProcesos(id_area){
    
    //remover todas las opciones excepto la primera (adorno Seleccione:)
    $('#id_proceso').children('option').remove();

    //token
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        url: "/selProcArea/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            id_area:id_area,
        },
        dataType: "json",
        success: function(data) {
            codigo=data.resultado;
            op_list=data.procesos_list;
            if(codigo=="ok_select"){

                //mostrar div procesos
                $("#divProcesos").show();
                //recorriendo el result
                for (i=0; i<op_list.length; i++){
                    var option = document.createElement("option");
                    option.text = op_list[i]['proceso'];
                    option.value = op_list[i]['id'];
                    var select = document.getElementById("id_proceso");
                    //insertando la opcion
                    select.appendChild(option);
                }//end for
            }else{
                //oculta el div procesos
                $("#divProcesos").hide();
                //mostrar mensaje de no existencia de procesos
                swal("El Area Seleccionada no posee procesos vinculados", "Vincule un proceso para asignar un subproceso !", 'info');
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


}//end function mostrarProcesos

function consultar_subProceso(id_subproceso){
    
    //token
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        type: "POST",
        url: "/selectSubProceso/",
        data:{
            csrfmiddlewaretoken : csrftoken, 
            id_subproceso:id_subproceso,
        },
        dataType: "json",
        success: function(data) {
            var codigo = data.resultado;
            if (codigo=="ok_select"){
                mostrar_subproceso(data.subproceso_list);
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


}//end function consultar_subProceso


function mostrar_subproceso(subproceso_list){
    
    //data retornante
    var id_subproceso   = subproceso_list.id;
    var nombre          = subproceso_list.nombre;
    var estado          = subproceso_list.estado;
    var docfile         = subproceso_list.docfile;
    var id_proceso      = subproceso_list.id_proceso;
    var id_area         = subproceso_list.id_area;

    //asignar data a modal
    $('#subProcesoModal #id_subproceso').val(id_subproceso);
    document.getElementById("formSubProceso").setAttribute("action","/updateSubProceso/")
    $('#subProcesoModal #id_proceso').val(id_proceso);

    //ARMANDO URL DEL DOCUMENTO
    var hostName=window.location.host+"/"
    var linkDoc="http://"+hostName+docfile;
    $("#divDocumento").show();
    $("#divSelectDocumento").hide();

    //CREAR VENTANA CON DOCUMENTO EN BLANCO
    document.getElementById("btnMostrarDocumento").onclick = function(){
        window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
    }//end function 

    $('#subProcesoModal #subproceso').val(nombre);
    $('#subProcesoModal #estado').val(estado);
    $('#subProcesoModal #id_area').val(id_area);
    
    //cargar procesos
    mostrarProcesos(id_area);
    //set option
    $('#subProcesoModal #id_proceso').val(id_proceso);

    //$('#id_proceso option[value=id_proceso]').attr('selected','selected');
    
    //mostrar modal
    $('#subProcesoModal').modal({'show':true, backdrop: 'static', keyboard: false});
     


}//end function mostrar_subproceso