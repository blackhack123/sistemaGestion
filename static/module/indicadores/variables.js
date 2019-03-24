


    window.addEventListener('load', function() {
        gridVariables();
    });
    function cargarModalVariable(){

        document.getElementById('formVariable').reset();
        document.getElementById('formVariable').setAttribute('action', 'ingresar_variable');
        $("#titleVariable").attr('class','modal-title badge bg-green');
        $("#titleVariable").text('Crear Variable');

        $("#modalVariable").modal('show');

    }//end function cargarModalVariable



    $('#modalObservacion').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })

    function gridVariables(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridVariables").jqGrid({
            url:'/grid_variables',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 700,
            height: 350,
            rowNum:100,
            colNames:['ID','Nombre', 'Operación', 'Operación entre Periodos', 'Estado', ''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'nombre', width: 60, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'operacion', width: 20, sorttype:"string", align:'center', formatter:formatterOperacion},
                { name: 'operacionEntrePeriodos', width: 30, sorttype:"string", align:'center', formatter:formatterOperacionEntrePeriodos},
                { name: 'estado', width: 20, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 10, sorttype:"string", align:'center', formatter:formatterBtnEditar},
            ],
            pager: '#pagerVariables',
            rownumbers: true,
            caption: "VARIABLES",
            shrinkToFit: true,
            ondblClickRow: function(rowId) {
                rowData = jQuery(this).getRowData(rowId);
                producto_id = rowData.id;
                editarProducto(producto_id);
            },
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    emptyMsgDiv.show();
                } else {
                    $(this).show();
                }
            },
        });

        function formatterOperacion(cellvalue, options, rowObject){
            if(rowObject.operacion == 1){
                return '<span class="badge bg-purple">Ponderado</span>';
             }else if (rowObject.operacion == 2){
                return '<span class="badge bg-purple">Promedio</span>';
             }else{
                return '<span class="badge bg-purple">Suma</span>';
             }
        }//end function formatterOperacion


        function formatterOperacionEntrePeriodos(cellvalue, options, rowObject){
            if(rowObject.operacionEntrePeriodos == 1){
                return '<span class="badge bg-purple">Ponderado</span>';
             }else if (rowObject.operacionEntrePeriodos == 2){
                return '<span class="badge bg-purple">Promedio</span>';
             }else{
                return '<span class="badge bg-purple">Suma</span>';
             }
        }//end function formatterOperacionEntrePeriodos

        function formatterEstado(cellvalue, options, rowObject){
            if(rowObject.estado == 0){
                return '<span class="badge bg-yellow">Inactivo</span>';
            }else{
                return '<span class="badge bg-green">Activo</span>';
            }
        }//end function formatterEstado

        function formatterBtnEditar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="editarVariable('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar

    }// gridProductos


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarVariable(variable_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_variable',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                variable_id:variable_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                variableData = data.variable[0];
                mostrarVariable(variableData);
            }
      }).fail(function() {
        alert( "error" );
      });

    }//end function editarProducto


    function mostrarVariable(variableData){

        document.getElementById('formVariable').setAttribute('action', 'actualizar_variable');
        $("#titleVariable").attr('class','modal-title badge bg-orange');
        $("#titleVariable").text('Editar Variable');

        $("#modalVariable #variableId").val(variableData.id);
        $("#modalVariable #nombre").val(variableData.nombre);
        $("#modalVariable #operacion").val(variableData.operacion);
        $("#modalVariable #operacionEntrePeriodos").val(variableData.operacionEntrePeriodos);
        $("#modalVariable #estado").val(variableData.estado);

        $("#modalVariable").modal('show');

    }//end function mostrarDepartamento


