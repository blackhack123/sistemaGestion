


    window.addEventListener('load', function() {
        gridResponsables();
    });
    function cargarModalResponsable(){

        document.getElementById('formResponsable').reset();
        document.getElementById('formResponsable').setAttribute('action', 'ingresar_responsable');
        $("#titleResponsable").attr('class','modal-title badge bg-green');
        $("#titleResponsable").text('Crear Responsable');

        $("#modalResponsable").modal('show');

    }//end function cargarModalResponsable



    $('#modalProducto').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    })

    function gridResponsables(){


        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridResponsables").jqGrid({
            url:'/grid_responsables',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 700,
            height: 350,
            rowNum:100,
            colNames:['ID','Nombre', 'Correo', 'Teléfono', 'Estado', ''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'nombre', width: 60, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'correo', width: 20, sorttype:"string", align:'center', formatter:formatterCorreo},
                { name: 'telefono', width: 20, sorttype:"string", align:'center'},
                { name: 'estado', width: 20, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 10, sorttype:"string", align:'center', formatter:formatterBtnEditar},
            ],
            pager: '#pagerResponsables',
            rownumbers: true,
            caption: "RESPONSABLES",
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

        function formatterCorreo(cellvalue, options, rowObject){
            if(rowObject.correo){
                correo = encode(rowObject.correo);
                return '<a href="javascript:void(0);" onclick="javascript:swal('+ "'"+correo +"'"+');"><i class="fa fa fa-envelope-o text-orange"></i> Abrir</a>';
            }else{
                return "";
            }
        }
        function formatterEstado(cellvalue, options, rowObject){
            if(rowObject.estado == 0){
                return '<span class="badge bg-yellow">Inactivo</span>';
            }else{
                return '<span class="badge bg-green">Activo</span>';
            }
        }//end function formatterEstado

        function formatterBtnEditar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="editarResponsable('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar


    }//end function gridResponsables


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode


    function editarResponsable(responsable_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_responsable',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                responsable_id:responsable_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                responsableData = data.responsable[0];
                mostrarResponsable(responsableData);
            }
      }).fail(function() {
            swal('Error', 'Ocurrio un error al intentar editar.', 'warning');
            return false;
      });

    }//end function editarResponsable


    function mostrarResponsable(responsableData){

        document.getElementById('formResponsable').setAttribute('action', 'actualizar_responsable');
        $("#titleResponsable").attr('class','modal-title badge bg-orange');
        $("#titleResponsable").text('Editar Responsable');

        $("#modalResponsable #responsableId").val(responsableData.id);
        $("#modalResponsable #nombre").val(responsableData.nombre);
        $("#modalResponsable #correo").val(responsableData.correo);
        $("#modalResponsable #telefono").val(responsableData.telefono);
        $("#modalResponsable #estado").val(responsableData.estado);

        $("#modalResponsable").modal('show');

    }//end function mostrarResponsable


