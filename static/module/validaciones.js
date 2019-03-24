    
    /**
     * FUNCION DATETIME
     * Obtiene la fecha y hora actual del clientSide
     *  "2018-02-02 16:08:53"
     */    
    function datetimenow(){

       
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" +today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
      
      return dateTime;
    }


    /**
     * FUNCION DATETIME
     * Obtiene la fecha  actual del clientSide
     * Ejemplo de retorno: "2018-02-02"
     */    
    function datenow(){

      var today = new Date();
      var date = today.getFullYear()+'-'+(("0" + (today.getMonth() + 1)).slice(-2))+'-'+today.getDate();

     return date;

   }//end function datenow



    /**
     * FUNCION VALIDAR DOCUMENTO
     * Permite validar ruc, cedula, 
     * sociedades publicas, privadas
     * 
     */
    function validarDocumento(sender) {          

      numero = sender.value;
      //numero = document.getElementById('ruc').value;
      //console.log("data: "+numero);
    /* alert(numero); */
      var suma = 0;      
      var residuo = 0;      
      var pri = false;      
      var pub = false;            
      var nat = false;      
      var numeroProvincias = 22;                  
      var modulo = 11;
                  
      /* Verifico que el campo no contenga letras */                  
      var ok=1;
      for (i=0; i<numero.length && ok==1 ; i++){
         var n = parseInt(numero.charAt(i));
         if (isNaN(n)) ok=0;
      }
      if (ok==0){
         swal("No puede ingresar caracteres en el número", "", "info");         
         return false;
      }
                  
      if (numero.length < 10 ){    
        swal("El número ingresado no es válido ", "", "info");
        // alert('El número ingresado no es válido');                  
         return false;
      }
     
      /* Los primeros dos digitos corresponden al codigo de la provincia */
      provincia = numero.substr(0,2);      
      if (provincia < 1 || provincia > numeroProvincias){           
         swal('El código de la provincia (dos primeros dígitos) es inválido', "", "info");
     return false;       
      }
      /* Aqui almacenamos los digitos de la cedula en variables. */
      d1  = numero.substr(0,1);         
      d2  = numero.substr(1,1);         
      d3  = numero.substr(2,1);         
      d4  = numero.substr(3,1);         
      d5  = numero.substr(4,1);         
      d6  = numero.substr(5,1);         
      d7  = numero.substr(6,1);         
      d8  = numero.substr(7,1);         
      d9  = numero.substr(8,1);         
      d10 = numero.substr(9,1);                
         
      /* El tercer digito es: */                           
      /* 9 para sociedades privadas y extranjeros   */         
      /* 6 para sociedades publicas */         
      /* menor que 6 (0,1,2,3,4,5) para personas naturales */ 
      if (d3==7 || d3==8){           
         swal('El tercer dígito ingresado es inválido', "", "info");                     
         return false;
      }         
         
      /* Solo para personas naturales (modulo 10) */         
      if (d3 < 6){           
         nat = true;            
         p1 = d1 * 2;  if (p1 >= 10) p1 -= 9;
         p2 = d2 * 1;  if (p2 >= 10) p2 -= 9;
         p3 = d3 * 2;  if (p3 >= 10) p3 -= 9;
         p4 = d4 * 1;  if (p4 >= 10) p4 -= 9;
         p5 = d5 * 2;  if (p5 >= 10) p5 -= 9;
         p6 = d6 * 1;  if (p6 >= 10) p6 -= 9; 
         p7 = d7 * 2;  if (p7 >= 10) p7 -= 9;
         p8 = d8 * 1;  if (p8 >= 10) p8 -= 9;
         p9 = d9 * 2;  if (p9 >= 10) p9 -= 9;             
         modulo = 10;
      }         
      /* Solo para sociedades publicas (modulo 11) */                  
      /* Aqui el digito verficador esta en la posicion 9, en las otras 2 en la pos. 10 */
      else if(d3 == 6){           
         pub = true;             
         p1 = d1 * 3;
         p2 = d2 * 2;
         p3 = d3 * 7;
         p4 = d4 * 6;
         p5 = d5 * 5;
         p6 = d6 * 4;
         p7 = d7 * 3;
         p8 = d8 * 2;            
         p9 = 0;            
      }         
         
      /* Solo para entidades privadas (modulo 11) */         
      else if(d3 == 9) {           
         pri = true;                                   
         p1 = d1 * 4;
         p2 = d2 * 3;
         p3 = d3 * 2;
         p4 = d4 * 7;
         p5 = d5 * 6;
         p6 = d6 * 5;
         p7 = d7 * 4;
         p8 = d8 * 3;
         p9 = d9 * 2;            
      }
                
      suma = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;                
      residuo = suma % modulo;                                         
      /* Si residuo=0, dig.ver.=0, caso contrario 10 - residuo*/
      digitoVerificador = residuo==0 ? 0: modulo - residuo;                
      /* ahora comparamos el elemento de la posicion 10 con el dig. ver.*/                         
      if (pub==true){           
         if (digitoVerificador != d9){                          
            swal('El ruc de la empresa del sector público es incorrecto.', "", "info");            
            return false;
         }                  
         /* El ruc de las empresas del sector publico terminan con 0001*/         
         if ( numero.substr(9,4) != '0001' ){                    
            swal('El ruc de la empresa del sector público debe terminar con 0001', "", "info");
            return false;
         }
      }         
      else if(pri == true){         
         if (digitoVerificador != d10){                          
            swal('El ruc de la empresa del sector privado es incorrecto.', "", "info");
            return false;
         }         
         if ( numero.substr(10,3) != '001' ){                    
            swal('El ruc de la empresa del sector privado debe terminar con 001', "", "info");
            return false;
         }
      }      
      else if(nat == true){         
         if (digitoVerificador != d10){                          
            swal('El número de cédula de la persona natural es incorrecto.', "", "info");
            return false;
         }         
         if (numero.length >10 && numero.substr(10,3) != '001' ){                    
            swal('El ruc de la persona natural debe terminar con 001', "", "info");
            return false;
         }
      }      
      return true;   
   }//end function validarDocumento
   
   


   /**************************************************/
   /********FUNCION VALIDAR EMAIL*********************/
   /*************************************************/

    function validarEmail(email) {

      expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if ( !expr.test(email) )
          swal("Error: Correo Incorrecto", "", "info");

    }//end function validarEmail



    // Establece  campos requeridos class="value_required"
    $( '<span style="color:red;">*</span>' ).insertBefore( ".value_required" );



    /**
     * Permite obtener el token de django
     * 
     */
    function getCookie(name) {
      
      var cookieValue = null;
      if (document.cookie && document.cookie != '') {
          var cookies = document.cookie.split(';');
          for (var i = 0; i < cookies.length; i++) {
              var cookie = jQuery.trim(cookies[i]);
              
              if (cookie.substring(0, name.length + 1) == (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                  break;
              }
          }
      }
      //RETORNANDO EL TOKEN
      return cookieValue;

  }//end function getCookie


  function required_pdf(objFileControl){

     var file = objFileControl.value;
     var len = file.length;
     var ext = file.slice(len - 4, len);
     if(ext.toUpperCase() != ".PDF"){
       swal('Formato no admitido', 'Solo se permiten Documentos en formato PDF', 'info');
       $(objFileControl).val(null)
     }
  }//end function required_pdf


    function validar_fecha() {

        //input validado
        var input = document.getElementById("fecha");

        var today = new Date();
        // Set month and day to string to add leading 0
        var day = new String(today.getDate());
        var mon = new String(today.getMonth()+1); //January is 0!
        var yr = today.getFullYear();

          if(day.length < 2) { day = "0" + day; }
          if(mon.length < 2) { mon = "0" + mon; }

          var date = new String( yr + '-' + mon + '-' + day );

        input.disabled = false;
        input.setAttribute('min', date);

    }//end function validar_fecha
