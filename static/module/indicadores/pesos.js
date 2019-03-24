


    window.addEventListener('load', function() {
        gridPesosResponsables();
    });
    function cargarModalPesoResponsable(){

        document.getElementById('formPesoResponsable').reset();
        document.getElementById('formPesoResponsable').setAttribute('action', 'ingresar_pesoresponsable');
        $("#titlePesoResponsable").attr('class','modal-title badge bg-green');
        $("#titlePesoResponsable").text('Crear Peso Responsable');

        $("#modalPesoResponsable").modal('show');

    }//end function cargarModalPesoResponsable



    $('#modalObservacion').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })


    function grabarPeso(event){

        event.preventDefault();
        responsable = $("#modalPesoResponsable #responsable").val();
        if(responsable == '' || responsable == null){
            swal('Seleccione el Responsable.');
            return false;
        }

        departamento = $("#modalPesoResponsable #departamento").val();
        if(departamento == '' || departamento == null){
            swal('Seleccione el Departamento.');
            return false;
        }

        pesoEmpresa = $("#modalPesoResponsable #pesoEmpresa").val();
        if(pesoEmpresa == '' || pesoEmpresa == null){
            swal('Ingrese el Peso de Empresa.');
            return false;
        }

        pesoIndividual = $("#modalPesoResponsable #pesoIndividual").val();
        if(pesoIndividual == '' || pesoIndividual == null){
            swal('Ingrese el Peso Individual.');
            return false;
        }

        pesoTrabajoEquipo = $("#modalPesoResponsable #pesoTrabajoEquipo").val();
        if(pesoTrabajoEquipo == '' || pesoTrabajoEquipo == null){
            swal('Ingrese el Peso Equipo de Trabajo.');
            return false;
        }

        pesoOtros = $("#modalPesoResponsable #pesoOtros").val();
        if(pesoOtros == '' || pesoOtros == null){
            swal('Ingrese Otros Pesos.');
            return false;
        }
        totalPeso = parseInt(pesoEmpresa) + parseInt(pesoIndividual) + parseInt(pesoTrabajoEquipo) + parseInt(pesoOtros)
        if(totalPeso == 100){
            $('#formPesoResponsable').submit();
        }else{
            swal('El total de Pesos debe ser 100.');
            return false;
        }

    }//end function grabarPeso

    function gridPesosResponsables(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridPesosResponsables").jqGrid({
            url:'/grid_pesosresponsables',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 820,
            height: 350,
            rowNum:100,
            colNames:['ID','Responsable', 'Departamento', 'Empresa', 'Individual', 'Equi.Trabajo', 'Otros', 'Estado', ''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'responsable', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'departamento', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'pesoEmpresa', width: 20, sorttype:"integer", align:'center',},
                { name: 'pesoIndividual', width: 20, sorttype:"integer", align:'center',},
                { name: 'pesoTrabajoEquipo', width: 20, sorttype:"integer", align:'center'},
                { name: 'pesoOtros', width: 20, sorttype:"integer", align:'center'},
                { name: 'estado', width: 20, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 10, sorttype:"string", align:'center', formatter:formatterBtnEditar},
            ],
            pager: '#pagerPesosResponsables',
            rownumbers: true,
            caption: "PESOS RESPONSABLES",
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
        jQuery("#gridPesosResponsables").jqGrid('setGroupHeaders', {
          useColSpanStyle: true,
          groupHeaders:[
            {startColumnName: 'pesoEmpresa', numberOfColumns: 4, titleText: '<spa class="badge bg-green">PESOS</span>'},
            ]
        });
        function formatterEstado(cellvalue, options, rowObject){
            if(rowObject.estado == 0){
                return '<span class="badge bg-yellow">Inactivo</span>';
            }else{
                return '<span class="badge bg-green">Activo</span>';
            }
        }//end function formatterEstado

        function formatterBtnEditar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="editarPesoResponsable('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar

    }// gridProductos


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarPesoResponsable(pesoresponsable_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_pesoresponsable',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                pesoresponsable_id:pesoresponsable_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                pesoresponsableData = data.pesoresponsable[0];
                mostrarPesoResponsable(pesoresponsableData);
            }
      }).fail(function() {
        swal( "error en la consulta." );
      });

    }//end function editarPesoResponsable


    function mostrarPesoResponsable(pesoresponsableData){

        document.getElementById('formPesoResponsable').setAttribute('action', 'actualizar_pesoresponsable');
        $("#titlePesoResponsable").attr('class','modal-title badge bg-orange');
        $("#titlePesoResponsable").text('Editar Peso');

        $("#modalPesoResponsable #pesoResponsableId").val(pesoresponsableData.id);
        $("#modalPesoResponsable #responsable").val(pesoresponsableData.responsable_id);
        $("#modalPesoResponsable #departamento").val(pesoresponsableData.departamento_id);
        $("#modalPesoResponsable #pesoEmpresa").val(pesoresponsableData.pesoEmpresa);
        $("#modalPesoResponsable #pesoIndividual").val(pesoresponsableData.pesoIndividual);
        $("#modalPesoResponsable #pesoTrabajoEquipo").val(pesoresponsableData.pesoTrabajoEquipo);
        $("#modalPesoResponsable #pesoOtros").val(pesoresponsableData.pesoOtros);
        $("#modalPesoResponsable #estado").val(pesoresponsableData.estado);

        $("#modalPesoResponsable").modal('show');

    }//end function mostrarPesoResponsable


