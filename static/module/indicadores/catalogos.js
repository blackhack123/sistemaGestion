
    window.onload=gridObjetivosPadre;

    //definiendo datatables
    var table= $('#tableObjetivos').DataTable({
        "language":{
            url:"/static/DataTables/es_ES.json"
        }
    });


    $('#myTab a[href="#objetivos"]').tab('show')


    function cargarModalObjetivo(){

        //reset al formulario ->limpiar el form
        document.getElementById("formObjetivos").reset();
        //ocultar metas
        var divMetas = document.getElementsByClassName("metas")[0];
        divMetas.style.display='none';
        //titulo y color
        $("#modalObjetivos #titleModalObjetivo").attr('class', 'modal-title badge bg-green');
        $("#modalObjetivos #titleModalObjetivo").html('Crear Objetivo');
        //abrir modal
        $("#modalObjetivos").modal('show');

    }

    function consultaObjetivo(idobjetivo)
    {

        var csrftoken = getCookie('csrftoken');
        var jqxhr = $.ajax({
            url:'/consultar_objetivo',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                idobjetivo:idobjetivo,
            }
        }).done(function(data) {

            codigo= data.resultado;
            if (codigo=='ok_select') {
                consulta=data.objetivo;
                idobjetivo = consulta[0]['id']
                codigo = consulta[0]['codigo']
                nombre = consulta[0]['nombre']
                objetivo = consulta[0]['objetivo_id']
                indicador = consulta[0]['indicador']
                signo = consulta[0]['signo']
                operacion = consulta[0]['operacion']
                ponderacion = consulta[0]['ponderacion']
                periodos = consulta[0]['periodos']
                meta = consulta[0]['meta']
                observacion = consulta[0]['observacion']
                estado = consulta[0]['estado']

                $("#modalObjetivos #titleModalObjetivo").attr('class', 'modal-title badge bg-orange');
                $("#modalObjetivos #titleModalObjetivo").html('Modificar Objetivo');
                $('#modalObjetivos #idobjetivo').val(idobjetivo)
                $('#modalObjetivos #codigo').val(codigo)
                $('#modalObjetivos #nombre').val(nombre)
                if(objetivo){
                    $('#modalObjetivos #padre').val(objetivo)
                }else{
                    $('#modalObjetivos #padre').val($("#modalObjetivos option:first").val())
                }
                $('#modalObjetivos #indicador').val(indicador)
                $('#modalObjetivos #signo').val(signo)
                $('#modalObjetivos #operacion').val(operacion)
                $('#modalObjetivos #ponderacion').val(ponderacion)
                $('#modalObjetivos #periodos').val(periodos)
                $('#modalObjetivos #meta').val(meta)
                if( meta == 1 ){
                    var divMetas = document.getElementsByClassName("metas")[0];
                    divMetas.style.display = 'block';
                    $("#modalObjetivos #metaInicial").val(consulta[0]['meta_inicio']);
                    $("#modalObjetivos #metaFinal").val(consulta[0]['meta_fin']);
                }
                $('#modalObjetivos #comentarios').val(observacion)
                $('#modalObjetivos #estado').val(estado)
                $('#formObjetivos').attr('action','actualizar_objetivo')
                //mostrar modal
                $('#modalObjetivos').modal('show');
            }
      }).fail(function() {
        alert( "error" );
      });

    }//endfuntion consultaObjetivo



    //funtion eliminarProducto
    function eliminarObjetivo(idobjetivo)
    {
        swal({
            title: "Desea Inhabilitar el Objetivo ?",
            text: "",
            icon: "warning",
            buttons: ['No','Si'],
            dangerMode: true,
          })
          .then((willDelete) => {
            if (willDelete) {
                var csrftoken = getCookie('csrftoken');
                var jqxhr = $.ajax({
                    url:'/eliminar_objetivo',
                    type:'POST',
                    dataType:'json',
                    data:{
                        csrfmiddlewaretoken: csrftoken,
                        idobjetivo:idobjetivo,
                    }
                }).done(function(data) {
                    codigo= data.resultado;
                    if (codigo=='ok_delete'){
                        //mensaje
                        swal('Objetivo Deshabilitado !!', '', 'success');
                        //recargAR
                        $('#gridObjetivosPadre').jqGrid("setGridParam",{datatype:"json"}).trigger("reloadGrid");
                        /*setTimeout(function(){
                            location.reload();
                        }, 4000);
                        */
                    }
            })
            .fail(function() {
                alert( "error" );
            });
            } else {
                swal('Proceso cancelado.');
              return false;
            }
          });


    }//endfuntion eliminarProducto


    //mostrar observacion
    $('#modalObservacion').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $(this)
     $("#modalObservacion #observacion").val(recipient)
    })


    /*
    * OBJETIVOS PADRES
    */
    function gridObjetivosPadre(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridObjetivosPadre").jqGrid({
            url:'/grid_objetivosPadre',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 995,
            height: 350,
            rowNum:100,
            colNames:['ID','Codigo','Nombre', 'Indicador', 'Signo', 'Operación', 'Ponderación', 'Periodos', 'Aplica', 'Inicial', 'Final', 'Observación', 'Estado', ''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'codigo', width: 45, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'nombre', width: 60, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'indicador', width: 50, sorttype:"string", align:'center'},
                { name: 'signo', width: 20, sorttype:"string", align:'center'},
                { name: 'operacion', width: 50, sorttype:"string", align:'center', formatter:formatterOperacion},
                { name: 'ponderacion', width: 50, sorttype:"string", align:'center'},
                { name: 'periodos', width: 50, sorttype:"string", align:'center', formatter:formatterPeriodos},
                { name: 'meta', width: 25, sorttype:"string", align:'center', formatter:formatterMeta},
                { name: 'meta_inicio', width: 30, sorttype:"string", align:'center'},
                { name: 'meta_fin', width: 30, sorttype:"string", align:'center'},
                { name: 'observacion', width: 50, sorttype:"string", align:'center', formatter:formatterObservacion},
                { name: 'estado', width: 50, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 15, sorttype:"string", align:'center', formatter:formatterBtnEditar},
                //{ name: 'btnDesactivar', width: 15, sorttype:"string", align:'center', formatter:formatterBtnDesactivar},
            ],
            pager: '#pagerObjetivosPadre',
            rownumbers: true,
            caption: "OBJETIVOS",
            shrinkToFit: true,
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
                    url: /subgrid_objetivosHijos/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colNames:['ID','Codigo','Nombre', 'Indicador', 'Signo', 'Operación', 'Ponderación', 'Periodos', 'Aplica', 'Inicial','Final', 'Observación', 'Estado', ''],
                    colModel: [
                        { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                        { name: 'codigo', width: 30, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                        { name: 'nombre', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                        { name: 'indicador', width: 25, sorttype:"string", align:'center'},
                        { name: 'signo', width: 15, sorttype:"string", align:'center'},
                        { name: 'operacion', width: 25, sorttype:"string", align:'center', formatter:formatterOperacion},
                        { name: 'ponderacion', width: 25, sorttype:"string", align:'center'},
                        { name: 'periodos', width: 25, sorttype:"string", align:'center', formatter:formatterPeriodos},
                        { name: 'meta', width: 15, sorttype:"string", align:'center', formatter:formatterMeta},
                        { name: 'meta_inicio', width: 30, sorttype:"string", align:'center'},
                        { name: 'meta_fin', width: 30, sorttype:"string", align:'center'},
                        { name: 'observacion', width:27, sorttype:"string", align:'center', formatter:formatterObservacion},
                        { name: 'estado', width: 25, sorttype:"string", align:'center', formatter:formatterEstado},
                        { name: 'btnEditar', width: 12, sorttype:"string", align:'center', formatter:formatterBtnEditar},
                        //{ name: 'btnDesactivar', width: 12, sorttype:"string", align:'center', formatter:formatterBtnDesactivar},
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                            $("#" + childGridID).html("<span class='badge bg-yellow'>Sin Objetivos Hijos. </span>");
                        }
                    },
                    postData: {objetivo_id: row_id},
                    loadonce: true,
                    rownumbers: true,
                    rowNum:100,
                    width: 950,
                    height:'100%',
                    pager: "#" + childGridPagerID
                });
                jQuery("#"+childGridID).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false,
                    groupHeaders:[
                        {startColumnName: 'meta', numberOfColumns: 3, titleText: '<span class="badge bg-green">Meta entre Rangos</em>'},
                    ]
                });
            },
            subGridOptions : {
                expandOnLoad: false
            },
            /** END SUBGRID */
        });
        jQuery("#gridObjetivosPadre").jqGrid('setGroupHeaders', {
            useColSpanStyle: false,
            groupHeaders:[
                //{startColumnName: 'id', numberOfColumns: 7, titleText: '<span class="badge bg-green">RESPONSABLE PLAN DE ACCIÓN</em>'},
                {startColumnName: 'meta', numberOfColumns: 3, titleText: '<span class="badge bg-green">Meta entre Rangos</em>'},
            ]
        });
        function formatterOperacion(cellvalue, options, rowObject){
            if(rowObject.operacion == 1){
                return '<span class="badge bg-maroon">Ponderado</span>';
            }else if(rowObject.operacion == 2){
                return '<span class="badge bg-maroon">Promedio</span>';
            }else if(rowObject.operacion == 3){
                return '<span class="badge bg-maroon">Suma</span>';
            }
        }//end function formatterOperacion

        function formatterPeriodos(cellvalue, options, rowObject){
            if(rowObject.periodos == 1){
                return '<span class="badge bg-orange">Anual</span>';
            }else if(rowObject.periodos == 2){
                return '<span class="badge bg-orange">Semestral</span>';
            }else if(rowObject.periodos == 3){
                return '<span class="badge bg-orange">Quimestral</span>';
            }else if(rowObject.periodos == 4){
                return '<span class="badge bg-orange">Trimestral</span>';
            }else if(rowObject.periodos == 5){
                return '<span class="badge bg-orange">Mensual</span>';
            }
        }//end function formatterPeriodos

        function formatterMeta(cellvalue, options, rowObject){
            if(rowObject.meta==0){
                return '<span class="cellWithoutBackground" style="background-color:yellow;">NO</span>';
            }else{
                return '<span class="cellWithoutBackground" style="background-color:green;">SI</span>';
            }
        }// end function formatterMeta

        function formatterObservacion(cellvalue, options, rowObject){
            var observacion = encode(rowObject.observacion);
            var vinculo = '<a href="javascript:void(0);" data-toggle="modal" data-target="#modalObservacion" data-observacion="'+observacion+'">';
            vinculo += '<i class="fa fa fa-envelope-o fa-lg text-orange"></i> Abrir</a>';
            return vinculo;
        }//end function formatterObservacion

        function formatterEstado(cellvalue, options, rowObject){
            if(rowObject.estado == 0){
                return '<span class="badge bg-yellow">Inactivo</span>';
            }else{
                return '<span class="badge bg-green">Activo</span>';
            }
        }//end function formatterEstado

        function formatterBtnEditar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="consultaObjetivo('+rowObject.id+');"><i class="fa fa-pencil fa-lg text-orange"></i></a>';
        }//end function formatterBtnEditar

        function formatterBtnDesactivar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="eliminarObjetivo('+rowObject.id+');"><i class="fa fa-close fa-lg text-yellow"></i></a>';
        }//end function formatterBtnDesactivar


    }//end function gridObjetivosPadre


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode


    function mostrarMetas(sender){
        var value = sender.value;
        var divMetas = document.getElementsByClassName("metas")[0];
        console.log(divMetas);
        if(value == 1){
            divMetas.style.display='block';
        }else{
            divMetas.style.display='none';
        }
    }//end function mostrarMetas