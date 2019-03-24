


    window.addEventListener('load', function() {
        gridEjesEstrategicos();
    });
    function cargarModalEje(){

        document.getElementById('formEje').reset();
        document.getElementById('formEje').setAttribute('action', 'ingresar_ejeestrategico');
        $("#titleEje").attr('class','modal-title badge bg-green');
        $("#titleEje").text('Crear Eje Estratégico');

        $("#modalEje").modal('show');

    }//end function cargarModalEjesEstrategicos



    $('#modalObservacion').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })

    function gridEjesEstrategicos(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridEjesEstrategicos").jqGrid({
            url:'/grid_ejesEstrategicos',
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
                { name: 'descripcion', width: 20, sorttype:"string", align:'center', formatter:formatterDescripcion},
                { name: 'estado', width: 20, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 10, sorttype:"string", align:'center', formatter:formatterBtnEditar},
            ],
            pager: '#pagerEjesEstrategicos',
            rownumbers: true,
            caption: "EJES ESTRATÉGICOS",
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

        function formatterDescripcion(cellvalue, options, rowObject){
            if(rowObject.descripcion){
                var observacion = encode(rowObject.descripcion);
                var vinculo = '<a href="javascript:void(0);" data-toggle="modal" data-target="#modalObservacion" data-observacion="'+observacion+'">';
                vinculo += '<i class="fa fa fa-envelope-o text-orange"></i> Abrir</a>';
                return vinculo;
             }else{
                return "";
             }
        }//end function formatterDescripcion

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
            return '<a href="javascript:void(0);" onclick="editarEje('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar

    }// gridProductos


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarEje(ejeestrategico_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_ejeestrategico',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                ejeestrategico_id:ejeestrategico_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                ejeData = data.ejesestrategico[0];
                mostrarEje(ejeData);
            }
      }).fail(function() {
        alert( "error" );
      });

    }//end function editarProducto


    function mostrarEje(ejeData){

        document.getElementById('formEje').setAttribute('action', 'actualizar_ejeestrategico');
        $("#titleEje").attr('class','modal-title badge bg-orange');
        $("#titleEje").text('Editar '+ejeData.nombre);

        $("#modalEje #ejeId").val(ejeData.id);
        $("#modalEje #nombre").val(ejeData.nombre);
        $("#modalEje #descripcion").val(ejeData.descripcion);
        $("#modalEje #estado").val(ejeData.estado);

        $("#modalEje").modal('show');

    }//end function mostrarDepartamento


