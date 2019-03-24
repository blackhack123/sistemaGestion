


    window.addEventListener('load', function() {
        gridProductos();
    });
    function cargarModalProducto(){

        document.getElementById('formProducto').reset();
        document.getElementById('formProducto').setAttribute('action', 'ingresar_producto');
        $("#titleProducto").attr('class','modal-title badge bg-green');
        $("#titleProducto").text('Crear Producto/Servicio');

        $("#modalProducto").modal('show');

    }//end function cargarModalProducto



    $('#modalProducto').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })

    function gridProductos(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridProductos").jqGrid({
            url:'/grid_productos',
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
            pager: '#pagerProductos',
            rownumbers: true,
            caption: "PRODUCTOS/SERVICIOS",
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
            return '<a href="javascript:void(0);" onclick="editarProducto('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar

    }// gridProductos


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarProducto(producto_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_producto',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                producto_id:producto_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                productoData = data.producto[0];
                mostrarProducto(productoData);
            }
      }).fail(function() {
        alert( "error" );
      });

    }//end function editarProducto


    function mostrarProducto(productoData){

        document.getElementById('formProducto').setAttribute('action', 'actualizar_producto');
        $("#titleProducto").attr('class','modal-title badge bg-orange');
        $("#titleProducto").text('Editar Producto/Servicio');

        $("#modalProducto #productoId").val(productoData.id);
        $("#modalProducto #nombre").val(productoData.nombre);
        $("#modalProducto #descripcion").val(productoData.descripcion);
        $("#modalProducto #estado").val(productoData.estado);

        $("#modalProducto").modal('show');

    }//end function mostrarDepartamento


