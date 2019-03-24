    //autocargar funcion
	window.onload = gridEstadoDocumentacion;


	//FUNCION MOSTRAR MODAL ESTADO DOCUMENTO
	function modalEstadoDocumento(id_revision, id_documento){


		//mostrar modalEstadoDocumento
		document.getElementById('form_estado_documento').reset();
		$("#div_observaciones").hide();
		$("#modalEstadoDocumento #id_revision").val(id_revision);
		$("#modalEstadoDocumento #id_documento").val(id_documento);
		$("#modalEstadoDocumento").modal('show');

	}//endfunction modalEstadoDocumento	


  	//mostrar div_personal
	function mostrarObservaciones(id_estado){

	    if(id_estado == 2){
	        $("#div_observaciones").show();
	    }else{
	        $("#div_observaciones").hide();
	    }//end if

	}//end function mostrarObservaciones

	//


	function gridEstadoDocumentacion(){

		 var csrftoken = getCookie('csrftoken');
        emptyMsgDiv = $("<div><span style='color:black;font-size:10x;'>No existen Registros !!</span></div>");
        $("#gridEstadoDocumentacion").jqGrid({
            url:'/griddocumentacion_lidernorma/',
            postData: {
                csrfmiddlewaretoken : csrftoken, 
            },
            datatype: "json",
            //data: mydata,
            loadonce: true, 
            viewrecords: true,
            width: 1100,
            height: 350,
            rowNum:30,
            colNames:['ID','NOMBRE','DESCRIPCIÓN', 'VERSION', 'PROCESO', 'PROCEDIMIENTO', 'id_procedimiento', 'ESTADO', 'ACCIÓN'],
            colModel: [
                { label: 'id_documento', name: 'id_documento', width: 15, key:true, sorttype:"integer", hidden:true},
                { label: 'nombre', name: 'nombre', width: 30, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterNombre},
                { label: 'descripcion', name: 'descripcion', width: 50, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterDescripcion},
                { label: 'version', name: 'version', width: 22, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterVersion},
                { label: 'proceso', name: 'proceso', width: 30, sorttype:"string", align:'center'},
                { label: 'procedimiento', name: 'procedimiento', width: 30, sorttype:"string", align:'center'},
                { label: 'procedimiento_id', name: 'procedimiento_id', width: 10, sorttype:"integer", align:'center', hidden:true},
                { label: 'estado', name: 'estado', width: 35, sorttype:"string", align:'center', formatter: gridEstadoDocumentacion_FormatterEstado},
                { label: 'btn_archivo', name: 'btn_archivo', width: 30, sorttype:"string", align:'center', formatter:gridEstadoDocumentacion_FormatterBoton },
            ],
            pager: '#pageGridEstadoDocumentacion',
            rownumbers: true,
            caption: "ESTADO DOCUMENTACION",
            shrinkToFit: true,

            //DOBLE CLICK OBTIENE LA DATA SELECCIONADA
            ondblClickRow: function (rowid,iRow,iCol,e) {
               
            },
            loadComplete: function () {

            },

            /**SUBGRID */
            subGrid: true,
            //subGridRowExpanded: showChildGrid,
            subGridRowExpanded:function(parentRowID,  row_id){
                //SELECCIONA LA DATA POR ROW_ID
                var dataFromTheRow = jQuery('#gridEstadoDocumentacion').jqGrid ('getRowData', row_id);
                //VARIABLES A CONSULTAR AREA/PROCESO
                var id_documento     = dataFromTheRow.id_documento;
        
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
                        { label: 'Observación', name: 'observacion_rev_director', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionDirector},
                        { label: 'Fec. revisión', name: 'fec_rev_director', width: 30, sorttype:"string", align:'center'},
                        { label: 'Líder', name: 'nombre_lider', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_lider', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoLider},
                        { label: 'Observación', name: 'observacion_rev_lider', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionLider},
                        { label: 'Fec. revisión', name: 'fec_rev_lider', width: 30, sorttype:"string", align:'center'},
                        { label: 'Admin.', name: 'nombre_admin', width: 40, sorttype:"string", align:'center'},
                        { label: 'Estado', name: 'estado_rev_admin', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterEstadoAdmin},
                        { label: 'Observación', name: 'observacion_rev_admin', width: 40, sorttype:"string", align:'center', formatter: subGridDocumentacionFormatterObservacionAdmin},
                        { label: 'Fec. revisión', name: 'fec_rev_admin', width: 30, sorttype:"string", align:'center'},
                    ] , 
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
                      {startColumnName: 'nombre_lider', numberOfColumns: 4, titleText: '<span class="badge bg-green">Líder de Norma</span>'},
                      {startColumnName: 'nombre_admin', numberOfColumns: 4, titleText: '<span class="badge bg-green">Administrador</span>'},
                    ]
                  });

                /* FORMATTER SUBGRID*/

                  function subGridDocumentacionFormatterObservacionDirector(cellvalue, options, rowObject){
                  	if(rowObject.observacion_rev_director){
						//new_formatter_observacionDirector = "<textarea rows='2' cols='12' readonly>"+rowObject.observacion_rev_director+"</textarea>";
						new_formatter_observacionDirector ='<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_rev_director+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                  	}else{
                        new_formatter_observacionDirector =""
                    }
                  	return new_formatter_observacionDirector
                  }//end function 

                  function subGridDocumentacionFormatterEstadoDirector(cellvalue, options, rowObject){

                    if(rowObject.estado_rev_director == 0){
                        new_formatter_estadoDirector = "<span class='badge bg-yellow'>Sin Archivo</span>";
                    }
                    if(rowObject.estado_rev_director == 1){
            
                        new_formatter_estadoDirector = "<i class='fa fa-clock-o' style='color:orange;'>En revision</i>";
                    }
                    if(rowObject.estado_rev_director == 2){
                    	new_formatter_estadoDirector ="<i class='fa fa-commenting-o' style='color:red'> Observaciones</i>"
                    }
                    if(rowObject.estado_rev_director == 3){
                        new_formatter_estadoDirector ="<i class='fa fa-check' style='color:green'> Aprobado</i>"
                    }
                    return new_formatter_estadoDirector;

                  }//end function subGridDocumentacionFormatterEstadoDirector

                  function subGridDocumentacionFormatterObservacionLider(cellvalue, options, rowObject){

                  	if(rowObject.observacion_rev_lider != null){
						//new_formatter_observacionLider = "<textarea rows='2' cols='12' readonly>"+rowObject.observacion_rev_lider+"</textarea>";
						new_formatter_observacionLider ='<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_rev_lider+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                  	}else{
                  		new_formatter_observacionLider = "";
                  	}
                  	return new_formatter_observacionLider;

                  }//end function subGridDocumentacionFormatterObservacionLider


                  function subGridDocumentacionFormatterEstadoLider(cellvalue, options, rowObject){

              	   	id_revision 	= rowObject.id;
                	id_documento 	= rowObject.id_documento;


                    if(rowObject.estado_rev_lider == 0){
                        new_formatter_estadoLider = "<span class='badge bg-yellow'>Sin Archivo</span>";
                    }
                    if(rowObject.estado_rev_lider == 1){
                       new_formatter_estadoLider = "<i class='fa fa-clock-o' style='color:orange;'>Pendiente</i>"
                    }
                    if(rowObject.estado_rev_director == 3 && rowObject.estado_rev_lider == 1){
                       new_formatter_estadoLider = "<a href='javascript:void(0)' onclick='modalEstadoDocumento("+id_revision+","+id_documento+");'><i class='fa fa-pencil' style='color:orange;'>Aprobar</i></a>"
                    }
                    if(rowObject.estado_rev_lider == 2){
						new_formatter_estadoLider = "<i class='fa fa-commenting-o' style='color:red;'>Observaciones</i>"
                    }
                    if(rowObject.estado_rev_lider == 3){
						new_formatter_estadoLider = "<i class='fa fa-check' style='color:green;'> Aprobado</i>"
                    }
                    return new_formatter_estadoLider;

                  }//end function subGridDocumentacionFormatterEstadoDirector

                  function subGridDocumentacionFormatterObservacionAdmin(cellvalue, options, rowObject){

                  	if(rowObject.observacion_rev_admin){
						//new_formatter_observacionAdmin = "<textarea rows='2' cols='12' readonly>"+rowObject.observacion_rev_admin+"</textarea>";
						new_formatter_observacionAdmin ='<a href="javascript:void(0)" onclick="mi_funcion(\''+rowObject.observacion_rev_admin+'\')"><i class="fa fa-envelope"></i> Abrir</a>';
                  	}else{
                  		new_formatter_observacionAdmin="";
                  	}
                  	return new_formatter_observacionAdmin

                  }//end function subGridDocumentacionFormatterObservacionAdmin

                  function subGridDocumentacionFormatterEstadoAdmin(cellvalue, options, rowObject){
                    if(rowObject.estado_rev_admin == 0){
                        new_formatter_estadoAdmin = "<span class='badge bg-yellow'>Sin Archivo</span>";
                    }
                    if(rowObject.estado_rev_admin == 1){
                        new_formatter_estadoAdmin = "<i class='fa fa-clock-o' style='color:orange;'>Pendiente</i>";
                    }
                    if(rowObject.estado_rev_admin == 2){
                        new_formatter_estadoAdmin = "<i class='fa fa-commenting-o' style='color:red;'> Observaciones</i>";
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

        function gridEstadoDocumentacion_FormatterEstado(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_estado = "<span class='badge bg-yellow'>Sin Archivo</span>"
            }
            if(rowObject.estado == 1){
                new_formatter_estado="<i class='fa fa-clock-o' style='color:red;'>Pendiente</i> ";
            }
            if(rowObject.estado == 2){
                new_formatter_estado="<i class='fa fa-commenting-o' style='color:red;'>Observaciones</i> ";
            }
            if(rowObject.estado == 3){
                new_formatter_estado="<i class='fa fa-clock-o' style='color:red;'> En Revision</i> ";
            }
            if(rowObject.estado == 4){
                new_formatter_estado="<i class='fa fa-check' style='color:green;'> Aprobado y Vigente</i> ";
            }
            if(rowObject.estado == 5){
                new_formatter_estado="<i class='fa fa-info-circle' style='color:red;'> No Vigente</i> ";
            }
            return new_formatter_estado

        }//end function gridEstadoDocumentacion_FormatterEstado


        function gridEstadoDocumentacion_FormatterBoton(cellvalue, options, rowObject){

            id_documento = rowObject.id;
            id_procedimiento = rowObject.procedimiento_id;
            parametros = id_documento+","+id_procedimiento;
            
            if(rowObject.estado == 0){
                new_formatter_boton = "<span class='badge bg-yellow' >Sin Archivo</span>"
            }
            if(rowObject.estado == 1 || rowObject.estado == 2 || rowObject.estado == 3){
                new_formatter_boton = "<i class='fa fa-check' style='color:green'>Subido</i>"
            }
            if(rowObject.estado == 4 || rowObject.estado == 5){
                new_formatter_boton = "<i class='fa fa-check' style='color:green'>Subido</i>"
            }
            return new_formatter_boton

        }//end function gridEstadoDocumentacion_FormatterBoton


        function gridEstadoDocumentacion_FormatterNombre(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_nombre = "<span class='badge bg-yellow'>Sin Archivo</span>"
            }else{
                new_formatter_nombre = rowObject.nombre
            }
            return new_formatter_nombre

        }//end function gridEstadoDocumentacion_FormatterNombre

        function gridEstadoDocumentacion_FormatterDescripcion(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_descripcion = "<span class='badge bg-yellow'>Sin Archivo</span>"
            }else{
                new_formatter_descripcion = rowObject.descripcion
            }
            return new_formatter_descripcion

        }//end function gridEstadoDocumentacion_FormatterDescripcion


        function gridEstadoDocumentacion_FormatterVersion(cellvalue, options, rowObject){

            if(rowObject.estado == 0){
                new_formatter_version = "<span class='badge bg-yellow'>Sin Archivo</span>"
            }else{
                new_formatter_version = rowObject.version
            }
            return new_formatter_version

        }//end function gridEstadoDocumentacion_FormatterDescripcion

	}//end function gridEstadoDocumentacion


    function mi_funcion(data){

       $("#modalHallazgo #descripcion").html(data.replace(/(<([^>]+)>)/ig,""));
       $("#modalHallazgo").modal('show');

    }//end funtion



 