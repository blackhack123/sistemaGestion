


    window.addEventListener('load', function() {
        gridFormulas();
    });
    function cargarModalFormula(){

        document.getElementById('formFormula').reset();
        document.getElementById('formFormula').setAttribute('action', 'ingresar_formula');
        $("#titleFormula").attr('class','modal-title badge bg-green');
        $("#titleFormula").text('Crear Formula');

        $("#modalFormula").modal('show');

    }//end function cargarModalFormula


    function armarFormula(){

        //data
        operador1 = $("#operador1").val();
        variable1 = $("#variable1 option:selected").text();

        operador2 = $("#operador2").val();
        variable2 = $("#variable2 option:selected").text();

        operador3 = $("#operador3").val();
        variable3 = $("#variable3 option:selected").text();

        operador4 = $("#operador4").val();
        variable4 = $("#variable4 option:selected").text();

        operador5 = $("#operador5").val();
        variable5 = $("#variable5 option:selected").text();

        operador6 = $("#operador6").val();
        variable6 = $("#variable6 option:selected").text();

        html = "";
        html += operador1;
        if(variable1 != 'Seleccione'){
            html += variable1;
        }

        html += operador2;
        if(variable2 != 'Seleccione'){
            html += variable2;
        }

        html += operador3;
        if(variable3 != 'Seleccione'){
            html += variable3;
        }

        html += operador4;
        if(variable4 != 'Seleccione'){
            html += variable4;
        }

        html += operador5;
        if(variable5 != 'Seleccione'){
            html += variable5;
        }

        html += operador6;
        if(variable6 != 'Seleccione'){
            html += variable6;
        }

        $("#formulaResultante").text(html)

    }//end function armarFormula


    $('#modalObservacion').on('show.bs.modal', function (event) {
      var button = $(event.relatedTarget)
      var recipient = button.data('observacion')
      var modal = $("#modalObservacion")
      $("#modalObservacion #observacion").val(recipient);
    });

    function gridFormulas(){

        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridFormulas").jqGrid({
            url:'/grid_formulas',
            postData: {
                csrfmiddlewaretoken : csrftoken,
            },
            datatype: "json",
            loadonce: true,
            viewrecords: true,
            width: 700,
            height: 350,
            rowNum:100,
            colNames:['ID','Nombre', 'Descripción', 'Fórmula', 'Estado', ''],
            colModel: [
                { name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { name: 'nombre', width: 60, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { name: 'descripcion', width: 25, sorttype:"string", align:'center', formatter:formatterDescripcion},
                { name: 'formulaResultante', width: 25, sorttype:"string", align:'center', formatter:formatterFormulaResultante},
                { name: 'estado', width: 20, sorttype:"string", align:'center', formatter:formatterEstado},
                { name: 'btnEditar', width: 10, sorttype:"string", align:'center', formatter:formatterBtnEditar},
            ],
            pager: '#pagerFormulas',
            rownumbers: true,
            caption: "FORMULAS",
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

        function formatterFormulaResultante(cellvalue, options, rowObject){

            formula = "";
            if(rowObject.operador1)
                formula += rowObject.operador1;
            if(rowObject.variable_1)
                formula+= rowObject.variable_1;

            if(rowObject.operador2)
                formula+= rowObject.operador2;
            if(rowObject.variable_2)
                formula+= rowObject.variable_2;

            if(rowObject.operador3)
                formula+= rowObject.operador3;
            if(rowObject.variable_3)
                formula+= rowObject.variable_3;

            if(rowObject.operador4)
                formula+= rowObject.operador4;
            if(rowObject.variable_4)
                formula+= rowObject.variable_4;

            if(rowObject.operador5)
                formula+= rowObject.operador5;
            if(rowObject.variable_5)
                formula+= rowObject.variable_5;

            if(rowObject.operador6)
                formula+= rowObject.operador6;
            if(rowObject.variable_6)
                formula+= rowObject.variable_6;

            //formula = operador1 + variable_1 + operador2 + variable_2 + operador3 + variable_3 + operador4 + variable_4 + operador5 + variable_5 + operador6 + variable_6;
            formulaResultante = "'"+'Formula :'+"'"
            formulaResultante += ", '"+ formula + "', ''";
            return '<a href="javascript:void(0);" onclick="swal('+formulaResultante+');"><i class="fa fa-envelope-o text-orange"></i> Abrir</a>';

        }//end function formatterFormulaResultante


        function formatterEstado(cellvalue, options, rowObject){
            if(rowObject.estado == 0){
                return '<span class="badge bg-yellow">Inactivo</span>';
            }else{
                return '<span class="badge bg-green">Activo</span>';
            }
        }//end function formatterEstado

        function formatterBtnEditar(cellvalue, options, rowObject){
            return '<a href="javascript:void(0);" onclick="editarFormula('+rowObject.id+');"><i class="fa fa-pencil text-orange"></i></a>';
        }//end function formatterBtnEditar

    }// gridFormulas


    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function editarFormula(formula_id){

        var csrftoken = getCookie('csrftoken');
        $.ajax({
            url:'/consultar_formula',
            type:'POST',
            dataType:'json',
            data:{
                csrfmiddlewaretoken: csrftoken,
                formula_id:formula_id,
            }
        }).done(function(data) {
            codigo= data.resultado;
            if (codigo=='ok_select') {
                formulaData = data.formula[0];
                mostrarFormula(formulaData);
            }
      }).fail(function() {
        swal( 'Error',"Ocurrio un error en la consulta.", 'warning' );
      });

    }//end function editarFormula


    function mostrarFormula(formulaData){

        document.getElementById('formFormula').setAttribute('action', 'actualizar_formula');
        $("#titleFormula").attr('class','modal-title badge bg-orange');
        $("#titleFormula").text('Editar '+formulaData.nombre);

        $("#modalFormula #formulaId").val(formulaData.id);
        $("#modalFormula #nombre").val(formulaData.nombre);
        $("#modalFormula #descripcion").val(formulaData.descripcion);
        $("#modalFormula #estado").val(formulaData.estado);
        $("#modalFormula #operador1").val(formulaData.operador1);
        $("#modalFormula #variable1").val(formulaData.variable1_id);

        $("#modalFormula #operador2").val(formulaData.operador2);
        if(formulaData.variable2_id){
            $("#modalFormula #variable2").val(formulaData.variable2_id);
        }else{
            $("#modalFormula #variable2").val($("#modalFormula #variable2 option:first").val());
        }
        $("#modalFormula #operador3").val(formulaData.operador3);
        if(formulaData.variable3_id){
            $("#modalFormula #variable3").val(formulaData.variable3_id);
        }else{
            $("#modalFormula #variable3").val($("#modalFormula #variable3 option:first").val());
        }

        $("#modalFormula #operador4").val(formulaData.operador4);
        if(formulaData.variable4_id){
            $("#modalFormula #variable4").val(formulaData.variable4_id);
        }else{
            $("#modalFormula #variable4").val($("#modalFormula #variable4 option:first").val());
        }

        $("#modalFormula #operador5").val(formulaData.operador5);
        if(formulaData.variable5_id){
            $("#modalFormula #variable5").val(formulaData.variable5_id);
        }else{
            $("#modalFormula #variable5").val($("#modalFormula #variable5 option:first").val());
        }

        $("#modalFormula #operador6").val(formulaData.operador6);
        if(formulaData.variable6_id){
            $("#modalFormula #variable6").val(formulaData.variable6_id);
        }else{
            $("#modalFormula #variable6").val($("#modalFormula #variable6 option:first").val());
        }

        $("#modalFormula").modal('show');

    }//end function mostrarFormula


