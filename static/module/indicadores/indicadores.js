/**
 * INDICADOR LINEA
 */
new Chart(document.getElementById("line-chart"), {
  type: 'line',
  data: {
      labels: [1500,1600,1700,1750,1800,1850,1900,1950,1999,2050],
      datasets: [{ 
          data: [86,114,106,106,107,111,133,221,783,2478],
          label: "Enero",
          borderColor: "#3e95cd",
          fill: true
      }, { 
          data: [282,350,411,502,635,809,947,1402,3700,5267],
          label: "Febrero",
          borderColor: "#8e5ea2",
          fill: false
      }, { 
          data: [168,170,178,190,203,276,408,547,675,734],
          label: "Marzo",
          borderColor: "#3cba9f",
          fill: false
      }, { 
          data: [40,20,10,16,24,38,74,167,508,784],
          label: "Abril",
          borderColor: "#e8c3b9",
          fill: false
      }, { 
          data: [6,3,2,2,7,26,82,172,312,433],
          label: "Mayo",
          borderColor: "#c45850",
          fill: false
      }
      ]
  },
  options: {
      title: {
      display: false,
      text: 'Indicador General Tipo Lineal'
      }
  }
  });



/**
* INDICADOR BARRAS
*/
new Chart(document.getElementById("bar-chart"), {
  type: 'bar',
  data: {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Marzo"],
    datasets: [
      {
        label: "Datos",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [100,5267,734,784,433]
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: false,
      text: 'INDICADOR BARRAS'
    }
  }
});



/**
* INDICADOR TIPO PIE
*/
new Chart(document.getElementById("pie-chart"), {
  type: 'pie',
  data: {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [{
      label: "",
      backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
      data: [2478,5267,734,784,433]
    }]
  },
  options: {
    title: {
      display: false,
      text: 'Predicted world population (millions) in 2050'
    }
  }
});

/**
* indicador polar
*/
new Chart(document.getElementById("polar-chart"), {
  type: 'polarArea',
  data: {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
      }
    ]
  },
  options: {
    title: {
      display: false,
      text: ''
    }
  }
});


/**
* INDICADOR MIXTO
* 
*/
new Chart(document.getElementById("mixed-chart"), {
  type: 'bar',
  data: {
    labels: ["Enero", "Febrero", "Marzo", "Abril"],
    datasets: [{
        label: "",
        type: "line",
        borderColor: "#8e5ea2",
        data: [408,547,675,734],
        fill: false
      }, {
        label: "",
        type: "line",
        borderColor: "#3e95cd",
        data: [133,221,783,2478],
        fill: false
      }, {
        label: "",
        type: "bar",
        backgroundColor: "rgba(0,0,0,0.2)",
        data: [408,547,675,734],
      }, {
        label: "",
        type: "bar",
        backgroundColor: "rgba(0,0,0,0.2)",
        backgroundColorHover: "#3e95cd",
        data: [133,221,783,2478]
      }
    ]
  },
  options: {
    title: {
      display: false,
      text: 'Population growth (millions): Europe & Africa'
    },
    legend: { display: false }
  }
});

/**
* INDICADOR DE BARRAS HORIZONTAL
*/
new Chart(document.getElementById("bar-chart-horizontal"), {
  type: 'horizontalBar',
  data: {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo"],
    datasets: [
      {
        label: "Dato",
        backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"],
        data: [2478,5267,734,784,433]
      }
    ]
  },
  options: {
    legend: { display: false },
    title: {
      display: false,
      text: 'Predicted world population (millions) in 2050'
    }
  }
});





/**
* FUNCION MOSTRAR MODAL INDICADORES
*/
function modalIndicadores(){

//MOSTRAR MODAL
$("#modalIndicador").modal('show');

}//end function modalIndicadores

