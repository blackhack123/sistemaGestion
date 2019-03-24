


    window.addEventListener('load', function() {
        grid_deparmantosPadre();
    });
    function cargarModalDepartamento(){

        document.getElementById('formDepartamento').reset();
        //url
        document.getElementById('formDepartamento').setAttribute('action', 'ingresar_departamento');
        $("#titleDepartamento").attr('class','modal-title badge bg-green');
        $("#titleDepartamento").text('Crear Departamento');
        $("#modalDepartamento").modal('show');

    }//end function cargarModalDepartamento



    $('#modalObservacion').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })

    function grid_deparmantosPadre(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridDepartamentos").jqGrid({
            url:'/grid_deparmantosPadre',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 700,
            height: 350,
            rowNum:100,
            colNames:['ID','Nombre', 'Descripción', 'Estado', ''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'nombre', width: 60, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'descripcion', width: 20, sorttype:"string", align:'center', formatter:formatterObservacion},
                { name: 'estado', width: 20, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 10, sorttype:"string", align:'center', formatter:formatterBtnEditar},
            ],
            pager: '#pagerDepartamentos',
            rownumbers: true,
            caption: "DEPARTAMENTOS",
            shrinkToFit: true,
            ondblClickRow: function(rowId) {
                rowData = jQuery(this).getRowData(rowId);
                departamento_id = rowData.id;
                editarDepartamento(departamento_id);
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
            /** SUBGRID */
            subGrid: true,
            subGridRowExpanded:function(parentRowID,  row_id){
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + ' class="text-black"></div>');
                $("#" + childGridID).jqGrid({
                    url: /subgrid_deparmantosHijo/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colNames:['ID','Nombre', 'Descripción', 'Estado', ''],
                    colModel: [
                        { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                        { name: 'nombre', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                        { name: 'observacion', width:20, sorttype:"string", align:'center', formatter:formatterObservacion},
                        { name: 'estado', width: 25, sorttype:"string", align:'center', formatter:formatterEstado},
                        { name: 'btnEditar', width: 20, sorttype:"string", align:'center', formatter:formatterBtnEditar},
                    ],
                    ondblClickRow: function(rowId) {
                        rowData = jQuery(this).getRowData(rowId);
                        departamento_id = rowData.id;
                        editarDepartamento(departamento_id);
                    },
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                            $("#" + childGridID).html("<span class='badge bg-yellow'>Sin Departamentos Hijos. </span>");
                        }
                    },
                    postData: {departamentoPadre_id: row_id},
                    loadonce: true,
                    rownumbers: true,
                    rowNum:100,
                    width: 500,
                    height:'100%',
                    pager: "#" + childGridPagerID
                });
            },
            subGridOptions : {
                expandOnLoad: false
            },
            /** END SUBGRID */
        });

        function formatterObservacion(cellvalue, options, rowObject){
            if(rowObject.descripcion){
                var observacion = encode(rowObject.descripcion);
                var vinculo = '<a href="javascript:void(0);" data-toggle="modal" data-target="#modalObservacion" data-observacion="'+observacion+'">';
                vinculo += '<i class="fa fa fa-envelope-o fa-lg text-orange"></i> Abrir</a>';
                return vinculo;
             }else{
                return "";
             }
        }//end function formatterObservacion

        function formatterEstado(cellvalue, options, rowObject){
            if(rowObject.estado == 0){
                return '<span class="badge bg-yellow">Inactivo</span>';
            }else{
                return '<span class="badge bg-green">Activo</span>';
            }
        }//end function formatterEstado

        function formatterBtnEditar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="editarDepartamento('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar

    }// grid_deparmantosPadre

    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarDepartamento(departamento_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_departamento',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                departamento_id:departamento_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                departamentoData = data.departamento[0];
                mostrarDepartamento(departamentoData);
            }
      }).fail(function() {
        alert( "error" );
      });

    }//end function editarDepartamento

    function mostrarDepartamento(departamentoData){

        document.getElementById('formDepartamento').setAttribute('action', 'actualizar_departamento');
        $("#titleDepartamento").attr('class','modal-title badge bg-orange');
        $("#titleDepartamento").text('Editar Departamento');

        $("#modalDepartamento #departamentoId").val(departamentoData.id);
        $("#modalDepartamento #nombre").val(departamentoData.nombre);
        if(departamentoData.parent_id>0){
            $("#modalDepartamento #departamentoPadre").val(departamentoData.parent_id);
        }else{
            $("#modalDepartamento #departamentoPadre").val(0);
        }
        $("#modalDepartamento #descripcion").val(departamentoData.descripcion);
        $("#modalDepartamento #estado").val(departamentoData.estado);

        $("#modalDepartamento").modal('show');

    }//end function mostrarDepartamento


