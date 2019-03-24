    
    //autocargar funcion grilla principal
    window.onload = gridEstadoDocumentacion;


    function modalMostrarEstado(id_documento, id_revision){


        //reset form
        document.getElementById('form_estado_documento').reset();

        //colocar id_documento/id_revision en input oculto
        $("#modalEstadoDocumento #id_documento").val(id_documento);
        $("#modalEstadoDocumento #id_revision").val(id_revision);

        //mostrar modal
        $("#modalEstadoDocumento").modal('show');
    }//end function modalMostrarEstado


    function mostrarDivObservaciones(estado_documento){
        if(estado_documento ==2){
            
            //mostrar div observaciones
            $("#div_observaciones").show();
            //establecer campo requerido
            $("#observaciones").prop('required',true);

        }else{
            
            //ocultar div observaciones
            $("#div_observaciones").hide();
            //establecer campo requerido
            $("#observaciones").prop('required',false);

        }//end if
    }//end function mostrarDivObservaciones


    function gridEstadoDocumentacion(){

        var csrftoken = getCookie('csrftoken');
        $("#gridEstadoDocumentacion").jqGrid({
            url:'/gridEstadoDocumentacion/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            //data: mydata,
            loadonce: true, 
            viewrecords: true,
            width: 1100,
            height: 350,
            rowNum:100,
            colNames:['ID','NOMBRE','DETALLE', 'VERSIÓN',  'PROCESO', 'PROCEDIMIENTO', 'RESPONSABLE', 'id_procedimiento', 'FEC. SUBIDO', 'ESTADO', 'VIGENTE'],
            colModel: [
                { label: 'id', name: 'id', width: 20, key:true, sorttype:"integer", hidden:true},
                { label: 'nombre', name: 'nombre', width: 40, sorttype:"string", align:'center', formatter: gridDocumentacion_FormatterNombre, cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'descripcion', name: 'descripcion', width: 17, sorttype:"string", align:'center', formatter: gridDocumentacion_FormatterDescripcion},
                { label: 'version', name: 'version', width: 15, sorttype:"string", align:'center', formatter: gridDocumentacion_FormatterVersion},
                { label: 'proceso', name: 'proceso', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'procedimiento', name: 'procedimiento', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' } },
                { label: 'nombre_responsable', name: 'nombre_responsable', width: 30, sorttype:"string", align:'center'},
                { label: 'procedimiento_id', name: 'procedimiento_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'fec_subido', name: 'fec_subido', width: 20, sorttype:"string", align:'center'},
                { label: 'estado', name: 'estado', width: 40, sorttype:"string", align:'center', formatter: gridDocumentacion_FormatterEstado},
                { label: 'btn_vigencia', name: 'btn_vigencia', width: 20, sorttype:"string", align:'center', formatter: gridDocumentacion_FormatterBtnVigencia},
            ],
            pager: '#pagerEstadoDocumentacion',
            rownumbers: true,
            caption: "ESTADO DOCUMENTACION",
            shrinkToFit: true,
             
            /**SUBGRID */
            subGrid: true,
            //subGridRowExpanded: showChildGrid,
            subGridRowExpanded:function(parentRowID,  row_id){
                //SELECCIONA LA DATA POR ROW_ID
                var dataFromTheRow = jQuery('#gridEstadoDocumentacion').jqGrid ('getRowData', row_id);
                //VARIABLES A CONSULTAR AREA/PROCESO
                var id_documento     = dataFromTheRow.id;
        
                // CREA UNA UNICA TABLA Y PAGINACION
                var childGridID = parentRowID + "_table";
                var childGridPagerID = parentRowID + "_pager";
                $('#' + parentRowID).append('<table id=' + childGridID + '></table><div id=' + childGridPagerID + '></div>');
                $("#" + childGridID).jqGrid({
                    url: /gridRevisionDocumentacion/,
                    mtype: "GET",
                    datatype: "json",
                    page: 1,
                    colModel: [
                        { label: 'id', name: 'id', width: 10, sorttype:"integer", align:'center', hidden:true},
                        { label: 'id_documento', name: 'id_documento', width: 10, sorttype:"integer", align:'center', hidden:true},
                        { label: 'Director', name: 'nombre_director', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_director', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoDirector},
                        { label: 'Observación', name: 'observacion_rev_director', width: 25, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionDirector},
                        { label: 'Fec. Revisión', name: 'fec_rev_director', width: 30, sorttype:"string", align:'center'},
                        { label: 'Lider', name: 'nombre_lider', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_lider', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoLider},
                        { label: 'Observación', name: 'observacion_rev_lider', width: 25, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionLider},
                        { label: 'Fec. Revisión', name: 'fec_rev_lider', width: 30, sorttype:"string", align:'center'},
                        { label: 'Admin.', name: 'nombre_admin', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_admin', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoAdmin},
                        { label: 'Observación', name: 'observacion_rev_admin', width: 25, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionAdmin},
                        { label: 'Fec. Revisión', name: 'fec_rev_admin', width: 30, sorttype:"string", align:'center'}
                    ],
                    loadComplete: function() {
                        if ($("#" + childGridID).getGridParam('records') === 0) {
                            //oldGrid = $('#GridIdb2 tbody').html();
                            $("#" + childGridID).html("<span class='badge bg-red'>Sin  Revisiones !!</span>");
                        }
                    },
                    postData: {id_documento: id_documento},
                    loadonce: true, 
                    rownumbers: true,
                    rowNum:30,
                    width: 1200,
                    height:'100%',
                    pager: "#" + childGridPagerID,
             
                    
                });
                jQuery("#" + childGridID).jqGrid('setGroupHeaders', {
                    useColSpanStyle: false, 
                    groupHeaders:[
                      {startColumnName: 'nombre_director', numberOfColumns: 4, titleText: '<span class="badge bg-green">Director de Área</span>'},
                      {startColumnName: 'nombre_lider', numberOfColumns: 4, titleText: '<span class="badge bg-green">Lider de Norma</span>'},
                      {startColumnName: 'nombre_admin', numberOfColumns: 4, titleText: '<span class="badge bg-green">Administrador</span>'},
                    ]
                  });

                /* FORMATTER SUBGRID*/

                    function subGridDocumentacionFormatterObservacionDirector(cellvalue, options, rowObject){

                        if (rowObject.observacion_rev_director != null){
                            data = encode(rowObject.observacion_rev_director);
                            new_formatter_observacionDirector = '<a href="javascript:void(0)" onclick="mi_funcion(\''+data+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                        }else{
                            new_formatter_observacionDirector= "";
                        }
                        return new_formatter_observacionDirector

                    }//end function subGridDocumentacionFormatterObservacionDirector

                    function subGridDocumentacionFormatterEstadoDirector(cellvalue, options, rowObject){
                        if(rowObject.estado_rev_director == 0){
                            new_formatter_estadoDirector = "<i class='fa fa-info-circle' style='color:red'> Sin Archivo</i>";
                        }
                        if(rowObject.estado_rev_director == 1){
                            new_formatter_estadoDirector = "<i class='fa fa-clock-o' style='color:red;'>En revision</i>";
                        }
                        if(rowObject.estado_rev_director == 2){
                            new_formatter_estadoDirector = "<a><i class='fa fa-commenting-o' style='color:red;'></i> Observaciones</a>";
                        }
                        if(rowObject.estado_rev_director == 3){
                            new_formatter_estadoDirector = "<i class='fa fa-check' style='color:green;'>Aprobado</i>";
                        }
                        return new_formatter_estadoDirector;
                    }//end function subGridDocumentacionFormatterEstadoDirector

                    function subGridDocumentacionFormatterObservacionLider(cellvalue, options, rowObject){

                        if (rowObject.observacion_rev_lider != null){
                            data = encode(rowObject.observacion_rev_lider);
                            new_formatter_observacionLider = '<a href="javascript:void(0)" onclick="mi_funcion(\''+data+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                        }else{
                            new_formatter_observacionLider= "";
                        }
                        return new_formatter_observacionLider

                    }//end function subGridDocumentacionFormatterObservacionLider

                    function subGridDocumentacionFormatterEstadoLider(cellvalue, options, rowObject){
                        if(rowObject.estado_rev_lider == 0){
                            new_formatter_estadoLider = "<i class='fa fa-info-circle' style='color:red'> Sin Archivo</i>";
                        }
                        if(rowObject.estado_rev_lider == 1){
                           new_formatter_estadoLider ="<a><i class='fa fa-clock-o' style='color:red;'></i> Pendiente</a>"
                        }
                        if(rowObject.estado_rev_lider == 2){
                           new_formatter_estadoLider ="<a><i class='fa fa-commenting-o' style='color:red;'></i> Observaciones</a>"
                        }
                        if(rowObject.estado_rev_lider == 3){
                            new_formatter_estadoLider = "<i class='fa fa-check' style='color:green;'>Aprobado</i>";
                        }
                        return new_formatter_estadoLider;
                    }//end function subGridDocumentacionFormatterEstadoDirector

                    function subGridDocumentacionFormatterObservacionAdmin(cellvalue, options, rowObject){
                        
                        if (rowObject.observacion_rev_admin != null){
                            data = encode(rowObject.observacion_rev_admin);
                            new_formatter_observacionAdmin = '<a href="javascript:void(0)" onclick="mi_funcion(\''+data+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';
                        }else{
                            new_formatter_observacionAdmin= "";
                        }
                        return new_formatter_observacionAdmin

                    }//end function subGridDocumentacionFormatterObservacionLider

                    function subGridDocumentacionFormatterEstadoAdmin(cellvalue, options, rowObject){

                        id_documento    = rowObject.id_documento;
                        id_revision     = rowObject.id;

                        if(rowObject.estado_rev_admin == 0){
                            new_formatter_estadoAdmin = "<i class='fa fa-info-circle' style='color:red'> Sin Archivo</i>";
                        }
                        if(rowObject.estado_rev_admin == 1){
                            new_formatter_estadoAdmin = "<a><i class='fa fa-clock-o' style='color:red;'></i> Pendiente</a>";
                        }
                        if(rowObject.estado_rev_admin == 1 && rowObject.estado_rev_lider == 3){
                            new_formatter_estadoAdmin = "<a href='javascript:void(0)' onclick='modalMostrarEstado("+id_documento+","+id_revision+");'><i class='fa fa-pencil' style='color:orange;'></i> Aprobar</a>";
                        }
                        if(rowObject.estado_rev_admin == 2){
                            new_formatter_estadoAdmin = "<a><i class='fa fa-commenting-o' style='color:red;'></i> Observaciones</a>";
                        }
                        if(rowObject.estado_rev_admin == 3){
                            new_formatter_estadoAdmin = "<i class='fa fa-check' style='color:green;'> Aprobado</i>";
                        }
                        return new_formatter_estadoAdmin;
                    }//end function subGridDocumentacionFormatterEstadoDirector

            },
            subGridOptions : {
                // expande todas las filas al cargar
                    expandOnLoad: false
            },
            /**ENDSUBGRID */   
        });
        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridEstadoDocumentacion").jqGrid('filterInput', self.value);
            },0);
        });
        function gridDocumentacion_FormatterEstado(cellvalue, options, rowObject){

            if (rowObject.estado == 0){
                new_formatter_estado = "<i class='fa fa-info-circle' style='color:red'>Sin Archivo</i>"
            }
            if(rowObject.estado == 1){
                new_formatter_estado="<i class='fa fa-clock-o' style='color:red;'>En revision</i> ";
            }
            if(rowObject.estado == 2){
                new_formatter_estado = "<i class='fa fa-commenting-o' style='color:red;'> Observaciones</i>";
            }
            if(rowObject.estado == 3){
                new_formatter_estado = "<i class='fa fa-clock-o' style='color:red;'>En revision</i>";
            }
            if(rowObject.estado == 4){
                new_formatter_estado = "<i class='fa fa-check' style='color:green;'>Aprobado y Vigente</i>";
            }
            if(rowObject.estado == 5){
                new_formatter_estado = "<i class='fa fa-info-circle' style='color:red;'> No Vigente</i>";
            }
            return new_formatter_estado

        }//end function gridDocumentacion_FormatterEstado


        function gridDocumentacion_FormatterBtnVigencia(cellvalue, options, rowObject){

            switch(rowObject.estado) {
                case 4:
                    new_formatter_btn_vigencia="<a href='javascript:void(0)' onclick='noVigente("+rowObject.id+")'><i class='fa fa-pencil' style='color:red'> No</i></a>";
                    return new_formatter_btn_vigencia
                case 5:
                    new_formatter_btn_vigencia="<a href='javascript:void(0)' onclick='establecerVigente("+rowObject.id+")'><i class='fa fa-pencil' style='color:green'> Si</i></a>";
                    return new_formatter_btn_vigencia
                default:
                new_formatter_btn_vigencia = '';
                return new_formatter_btn_vigencia
            }
            

        }// end function gridDocumentacion_FormatterBtnVigencia

        function gridDocumentacion_FormatterNombre(cellvalue, options, rowObject){

            if (rowObject.estado == 0){
                new_formatter_nombre = "<i class='fa fa-info-circle' style='color:red'>Sin Archivo</i>"
            }else{
                new_formatter_nombre = rowObject.nombre;
            }
            return new_formatter_nombre

        }//end function gridDocumentacion_FormatterEstado

        function gridDocumentacion_FormatterDescripcion(cellvalue, options, rowObject){

            if (rowObject.estado == 0){
                new_formatter_descripcion = ""
            }else{
                data = encode(rowObject.descripcion);
                new_formatter_descripcion = '<a href="javascript:void(0)" onclick="mi_funcion(\''+data+'\')"><i class="fa fa-envelope text-orange"></i> Abrir</a>';

            }
            return new_formatter_descripcion

        }//end function gridDocumentacion_FormatterEstado

        function gridDocumentacion_FormatterVersion(cellvalue, options, rowObject){

            if (rowObject.estado == 0){
                 new_formatter_version = ""
            }else{
                new_formatter_version = rowObject.version;
            }
            return new_formatter_version

        }//end function gridDocumentacion_FormatterEstado



    }//end function gridEstadoDocumentacion


    function mi_funcion(data){

       var div = document.createElement("div");
       div.innerHTML = data;
       textarea = document.getElementById('descripcion');
       textarea.value = div.innerText;
       //$("#modalHallazgo #descripcion").html(data);
       $("#modalHallazgo").modal('show');
    }//end funtion

    function encode(r){
        return r.replace(/[\x26\x0A\<>'"]/g,function(r){return"&#"+r.charCodeAt(0)+";"})
    }//end function encode

    function establecerVigente(id_documento){

        swal({
          title: "Desea establecer vigente al Documento ?",
          text: '',
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: "POST",
                url: "/establecer_vigente/",
                data:{
                    csrfmiddlewaretoken : csrftoken, 
                    id_documento:id_documento,
                },
                dataType: "json",
                success: function(data) {
                    codigo = data.resultado;
                   
                    if(codigo=='ok_update'){
                         //mensaje exitoso
                        swal('Documento No Vigente','', 'success');
                        //reiniciar
                        location.reload();
                    }
                     
                },//end success
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
          } else {
            return false;
          }
        });
    }//end function 


    function noVigente(id_documento){

        swal({
          title: "Desea establecer no vigente al Documento ?",
          text: '',
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            var csrftoken = getCookie('csrftoken');
            $.ajax({
                type: "POST",
                url: "/establecer_noVigente/",
                data:{
                    csrfmiddlewaretoken : csrftoken, 
                    id_documento:id_documento,
                },
                dataType: "json",
                success: function(data) {
                    codigo = data.resultado;
                   
                    if(codigo=='ok_update'){
                         //mensaje exitoso
                        swal('Documento No Vigente','', 'success');
                        //reiniciar
                        location.reload();
                    }
                     
                },//end success
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
          } else {
            return false;
          }
        });
    }//end function



    function confirmar_firma(){

        var id_documento = $("#modalDocumento #documento").val();
        if(id_documento =="" || id_documento == null){
            swal("Seleccione un Documento !!", "", "info");
            return false;
        }
        var documento = $("#modalDocumento #documento option:selected").text();
        //confirmacion
        swal({
          title: "Desea Firmar el Documento: "+documento,
          text: "",
          icon: "warning",
          buttons: ['No', 'Si'],
          dangerMode: true,
        })
        .then((willDelete) => {
          if (willDelete) {
            firmar_documento(id_documento);
          } else {
            //mensaje
            swal("El documento no ha sido Firmado..!!");
            //ocultar modal
            $("#modalDocumento").modal('hide');
          }
        });


    }//end function confirmar_firma


    function firmar_documento(id_documento){

        //firmar
        var csrftoken = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/firmar_documento/",
            data:{
                csrfmiddlewaretoken : csrftoken,
                id_documento:id_documento,
            },
            dataType: "json",
            success: function(data) {
                codigo = data.resultado;
                //no existe firma colaborador
                if(codigo == 'no_ok_colaborador'){
                    swal(data.mensaje, '', 'info');
                    $("#modalDocumento").modal('hide');
                }
                //no existe firma administrador
                if(codigo == 'no_ok_admin'){
                    swal(data.mensaje, '', 'info');
                    $("#modalDocumento").modal('hide');
                }
                //no existe firma director de area
                if(codigo == 'no_ok_director'){
                    swal(data.mensaje, '', 'info');
                    $("#modalDocumento").modal('hide');
                }
                //no existe firma lider de norma
                if(codigo == 'no_ok_lider'){
                    swal(data.mensaje, '', 'info');
                    $("#modalDocumento").modal('hide');
                }
                if(codigo == 'ok_firma'){
                    swal(data.mensaje, '', 'success');
                    $("#modalDocumento").modal('hide');
                }
            },//end success
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

    }// end function firmar_documento