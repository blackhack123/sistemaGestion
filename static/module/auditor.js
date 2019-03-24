
    
    //autocargar funcion
    window.onload = gridAuditoriasDesignadas;


    /*********************************************/
    /**FUNCION PARA OBTENER EL TOKEN DJANGO*******/
    /*********************************************/

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        //RETORNANDO EL TOKEN
        return cookieValue;

    }//end function getCookie

    
    
    
    /**
     * EVITAR GENERAR REPORTES EN CASO 
     * NO EXISTIRDATA 
     */
    function desabilitarReportes(){

        $("#excel").attr("href", "javascript:void(0)");
        $("#excel").attr("disabled", "disabled");
        $("#excel").click( function() {
            swal("No se puede Generar Reporte", "No existen datos !", "info");
            return false;
        });

        $("#pdf").attr("href", "javascript:void(0)");
        $("#pdf").attr("disabled", "disabled");
        $("#pdf").click( function() {
            swal("No se puede Generar Reporte", "No existen datos !", "info");
            return false;
        });

    }//end function desabilitarReportes



    /**
     * GRID AUDITORIAS
     */
    function gridAuditoriasDesignadas(){
        //$.jgrid.defaults.width = 900;
        var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Auditorias  !!</span></div>");
        $("#gridAuditoriasDesignadas").jqGrid({
            url:'/audDesignadas/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            caption:'Auditorias Designadas',
            loadonce: true, 
            viewrecords: true,
            width: 980,
            height: 400,
            rowNum:1000,
            colNames:['ID', 'AUDITORIA', 'LUGAR', 'FEC. INICIO', 'H. INICIO', 'FEC. FINAL', 'H. FINAL','NORMA', 'CLÁUSULA', 'IDNORMA', 'PROCESO', 'IDAREA','PROCEDIMIENTO', 'IDPROCESO','AUDITOR','IDAUDITOR'],
            colModel: [
                { label: 'id_auditoria', name: 'id_auditoria', width: 15, key:true, sorttype:"integer", hidden:true},
                { label: 'numero_auditoria', name: 'numero_auditoria', width: 35, sorttype:"integer", align:'center'},
                { label: 'lugar', name: 'lugar', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'fec_inicio', name: 'fec_inicio', width: 30, sorttype:"string", align:'center'},
                { label: 'hora_inicio', name: 'hora_inicio', width: 25, sorttype:"string", align:'center'},
                { label: 'fec_fin', name: 'fec_fin', width: 30, sorttype:"string", align:'center'},
                { label: 'hora_fin', name: 'hora_fin', width: 25, sorttype:"string", align:'center'},
                { label: 'nombre_norma', name: 'nombre_norma', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'clausula', name: 'clausula', width: 25, sorttype:"string", align:'center'},
                { label: 'id_norma_id', name: 'id_norma_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'nombre_area', name: 'nombre_area', width: 40, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'id_area_id', name: 'id_area_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'nombre_proceso', name: 'nombre_proceso', width: 50, sorttype:"string", align:'center', cellattr: function (rowId, tv, rawObject, cm, rdata) { return 'style="white-space: normal;"' }},
                { label: 'id_proceso_id', name: 'id_proceso_id', width: 40, sorttype:"integer", align:'center', hidden:true},
                { label: 'nombre_auditor', name: 'nombre_auditor', width: 50, sorttype:"string", align:'center'},
                { label: 'id_auditor_id', name: 'id_auditor_id', width: 40, sorttype:"integer", align:'center', hidden:true},
            ],
            pager: '#pagerAuditoriasDesignadas',
            rownumbers: true,
            shrinkToFit: true,
            grouping: true,
            groupingView: {
                groupField: ["numero_auditoria"],
                groupColumnShow: [false],
                groupText: ["<strong>Auditoría: </strong>  <span class='badge bg-blue'>{0}</span>"],
                groupOrder: ["desc"],
                groupCollapse: true,
            },
            loadComplete: function () {
                var ts = this;
                if (ts.p.reccount === 0) {
                    $(this).hide();
                    emptyMsgDiv.show();
                    //desabilitarReportes();
                } else {
                    $(this).show();
                    emptyMsgDiv.hide();
                }//END IF
            },
                
        });
        //MUESTRA COMPONENTES DE LA RECETA AL HACER CLICK SOBRE EL HEADER GROUP
        var groupingView = $("#gridAuditoriasDesignadas").jqGrid("getGridParam", "groupingView"),
        plusIcon = groupingView.plusicon,
        minusIcon = groupingView.minusicon;
        $("#gridAuditoriasDesignadas").click(function (e) {
            var $target = $(e.target),
                $groupHeader = $target.closest("tr.jqgroup");
            if ($groupHeader.length > 0) {
                if (e.target.nodeName.toLowerCase() !== "span" ||
                        (!$target.hasClass(plusIcon) && !$target.hasClass(minusIcon))) {
                    $(this).jqGrid("groupingToggle", $groupHeader.attr("id"));
                    return false;
                }//end if
            }//end if
        });
        //muestra el mensaje luego de cargar la grilla 
        emptyMsgDiv.insertAfter($("#gridAuditoriasDesignadas").parent());

        //funcion Buscar
        var timer;
        $("#search_cells").on("keyup", function() {
            var self = this;
            if(timer) { clearTimeout(timer); }
            timer = setTimeout(function(){
                //timer = null;
                $("#gridAuditoriasDesignadas").jqGrid('filterInput', self.value);
            },0);
        });


    }//end function grid auditoriasdesignadas




    /**
     * OBTIENE PDF DE LA NORMA RESPECTIVA
     */
    function normaPdf(){

        //token
        var csrftoken   = getCookie('csrftoken');
        $.ajax({
            type: "POST",
            url: "/selNorAud/",
            data:{
                csrfmiddlewaretoken : csrftoken, 
            },
            dataType: "json",
            success: function(data) {
                var codigo = data.resultado;
                if (codigo=="ok_select"){

                    //data retornante
                    var normUrl= data.normaUrl;
                    //url documento
                    var urlDocumento    = normUrl[0]['docfile'];
                    
                    //ARMANDO URL DOC
                    var hostName=window.location.host+"/"
                    var linkDoc="http://"+hostName+urlDocumento;
                    //MOSTRAR VENTAN CON DOCUMENTO
                    window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
                }//end if
            },
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
        
    }//consultar normaPdf