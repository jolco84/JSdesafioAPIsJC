const inputCLP = document.querySelector(".valorClp");
const selectMoneda = document.querySelector(".convertirMoneda");
const spanResultado = document.querySelector(".resultado");
let chart;
const monedas = [
    {
        codigo: "inicial",
        nombre: "Seleccione una Moneda"
    },
    {
        codigo: "dolar",
        nombre: "Dolar"
    },
    {
        codigo: "euro",
        nombre: "Euro"

    },
    {
        codigo: "bitcoin",
        nombre: "Bitcoin"

    }
];



//Funcion para obtener valores de las monedas (API https://mindicador.cl/api/)
async function getValueCurrency() {
    try {

        if (inputCLP.value == 0 || selectMoneda.value == 'inicial') {
            alert("Debe introdurcir valor en pesos a convertir, o seleccionar moneda");
        } else {
            const res = await fetch("https://mindicador.cl/api/");
            const currency = await res.json();
            const moneda = selectMoneda.value;
        
            spanResultado.innerHTML = 'Resultado: ' + (inputCLP.value / currency[moneda].valor).toFixed(4) + " " + moneda;
            renderGrafica(moneda);

        }

    } catch (e) {
        alert("Error: " + e.message);
    }

}

// funcion obtener datos de api y prpepararlos para graficas
async function getAndCreateDataToChart(monedaConsulta) {
    // consume el endpoint y convierte respuesta, devuelve un arreglo
    const res = await fetch("https://mindicador.cl/api/" + monedaConsulta);
    const moneda = await res.json();

    // CONSTRUIR LAS LABELS Y DATA A GRAFICAR

    // PARA LAS LABELS OBTIENES LAS FECHA DE CADA SISMO
    const labelsAll = moneda.serie.map((currency) => {
        
        return currency.fecha.split("T")[0];
    });
    //limitar historial a 10
    const labels = labelsAll.slice(0, 10)

    //obtiene valor por fecha de la moneda seleccionada
    const data = moneda.serie.map((currency) => {
        
        return Number(currency.valor);
    });

    // valores del datasets usa la data construida
    const datasets = [
        {
            label: "Historial de ultimos 10 dias",
            borderColor: "blue",
            data
        }
    ];

    // devuelve la etiqueta y el datasets, retorna un objeto
    return { labels, datasets };
}

//Llenar select con monedas que maneja la API
function cargaMonedas() {
    let html = ``
    for (let moneda of monedas) {
        //Interpolacion
        html += `
        <option value=${moneda.codigo}>${moneda.nombre}</option>
        `;

    }
    selectMoneda.innerHTML = html;

}

// funcion que renderiza los datos
async function renderGrafica(moneda) {
    
    // llama a la funcion anterior
    const data = await getAndCreateDataToChart(moneda); // objeto retornado
    // tipo grafico a usar
    const config = {
        type: "line",
        data
    };
    
    
    const myChart = document.getElementById("myChart");
    myChart.style.backgroundColor = "white";
    if (chart){
        chart.destroy();
    }
    chart = new Chart(myChart, config);
}

cargaMonedas();

