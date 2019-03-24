


    window.addEventListener('load', function() {
        gridPlanesDeAccion();
    });
    function cargarModalPlan(){

        document.getElementById('formPlan').reset();
        document.getElementById('formPlan').setAttribute('action', 'ingresar_plan');
        $("#titlePlan").attr('class','modal-title badge bg-green');
        $("#titlePlan").text('Crear Plan');

        $("#modalPlan").modal('show');

    }//end function cargarModalPlan



    $('#modalPlan').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })

    function gridPlanesDeAccion(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridPlanes").jqGrid({
            url:'/grid_planesAccion',
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
            pager: '#pagerPlanes',
            rownumbers: true,
            caption: "PLANES DE ACCIÓN",
            shrinkToFit: true,
            ondblClickRow: function(rowId) {
                rowData = jQuery(this).getRowData(rowId);
                plan_id = rowData.id;
                editarPlan(plan_id);
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
            return '<a href="javascript:void(0);" onclick="editarPlan('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar


    }// gridPlanesDeAccion


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarPlan(plan_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_planAccion',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                plan_id:plan_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                planData = data.plan[0];
                mostrarPlan(planData);
            }
      }).fail(function() {
        alert( "error" );
      });

    }//end function editarProducto


    function mostrarPlan(planData){

        document.getElementById('formPlan').setAttribute('action', 'actualizar_planAccion');
        $("#titlePlan").attr('class','modal-title badge bg-orange');
        $("#titlePlan").text('Editar Plan de Acción');

        $("#modalPlan #planId").val(planData.id);
        $("#modalPlan #nombre").val(planData.nombre);
        $("#modalPlan #descripcion").val(planData.descripcion);
        $("#modalPlan #estado").val(planData.estado);

        $("#modalPlan").modal('show');

    }//end function mostrarDepartamento


