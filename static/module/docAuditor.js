    
  /**
  *CREA ANIMACION TITLE HTML
  */
 var rev = "fwd";
 function titlebar(val){
     var msg  = "RG-ManagementCorp";
     var res = " ";
     var speed = 100;
     var pos = val;
     //msg = "   "+msg+"| "+"Routing GEAR";
     var le = msg.length;
     if(rev == "fwd"){
         if(pos < le){
             pos = pos+1;
             scroll = msg.substr(0,pos);
             document.title = scroll;
             timer = window.setTimeout("titlebar("+pos+")",speed);
         }
         else {
             rev = "bwd";
             timer = window.setTimeout("titlebar("+pos+")",speed);
         }
     }
     else {
         if(pos > 0) {
             pos = pos-1;
             var ale = le-pos;
             scrol = msg.substr(ale,le);
             document.title = scrol;
             timer = window.setTimeout("titlebar("+pos+")",speed);
         }
         else {
             rev = "fwd";
             timer = window.setTimeout("titlebar("+pos+")",speed);
         }
     }
 }
 titlebar(0);



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


/*
    function listaVerificacionPdf(){
        
        //ARMANDO URL DOC
        var hostName=window.location.host+"/"
        var linkDoc="http://"+hostName+"media/auditor/listaVerificacion.pdf";
        //MOSTRAR VENTAN CON DOCUMENTO
        window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');
        
    }//end function 
*/



    /**
     * DOUCMENTO PARA REDACTAR INFORME DE AUDITORIA
     */
    function informeAuditoriaDoc(){

        //ARMANDO URL DOC
        var hostName=window.location.host+"/"
        var linkDoc="http://"+hostName+"media/auditor/informeAuditoria.doc";
        //MOSTRAR VENTAN CON DOCUMENTO
        window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');

    }//end function informeAuditoriaDoc



    /**
     * DOCUMENTO PARA ACCION CORRECTIVA
     */
    function solicitudAccionDoc(){

        //ARMANDO URL DOC
        var hostName=window.location.host+"/"
        var linkDoc="http://"+hostName+"media/auditor/solicitudAccion.docx";
        //MOSTRAR VENTAN CON DOCUMENTO
        window.open(linkDoc, '_blank', 'location=yes,height=600,width=900,scrollbars=yes,status=yes');

    }//end function

