export function obtenerFecha(periodo, fecha){

    fetch('./src/php/api.php?action=cargarVentas')
    .then(response => response.json())
    .then(ventas => {
        // mejorProducto(ventas)
        // mejoresDias(ventas)
        totalGanancias(ventas, fecha)
        mejorProducto(ventas, fecha)
        mejoresDias(ventas, periodo, fecha)
    })
}
//Arregglar la parte superior
export function registrarVenta(venta, tickets, form) {
    Swal.fire({
        title: "Estas seguro?",
        text: "No podras cancelar la venta despues!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancelar',
        confirmButtonText: "Sí, registrar!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch('./src/php/api.php?action=registrarVenta', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: venta // Aquí se pasa el JSON generado
            })
            .then(response => response.json()) // Procesar la respuesta JSON del servidor
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: "Registrada!",
                        text: "Venta registrada con exito!",
                        icon: "success"
                    });
                    form.querySelectorAll('input[type="number"]').forEach(input =>{
                        input.value = 0;
                    })
                    fetch('./src/php/api.php?action=generarTicket',{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: venta
                    })
                    .then(response => response.json())
                    .then(data =>{
                        if (data.success) {
                            //Nueva ventana
                            window.open(data.ticket_html, '_blank')
                        }
                    })
                    //checar esot//////////////////////////
                    // tickets[index] = '';
                    // minimizar(index);
                    return 'hecho';
                } else {
                    console.error('Error: ' + data.error);
                }
            })
            .catch(error => {
                console.error('Error al registrar la venta:', error);
            });
        }
    });
}

/////////////////PARA ANALIZAR LAS VENTAS/////////////////
export const ventas = () =>{
    //Obteniendo todas las ventas
    fetch('./src/php/api.php?action=cargarVentas')
    .then(response => response.json())
    .then(ventas => {
        mejorProducto(ventas)
        mejoresDias(ventas)
        totalGanancias(ventas)
    })
}

function obtenerRangoSemana(year, week) {
    const primeraSemana = new Date(year, 0, 1 + (week - 1) * 7); // Fecha aproximada al inicio de la semana
    const diaInicio = primeraSemana.getDate() - primeraSemana.getDay() + 1; // Ajuste para el lunes
    const inicioSemana = new Date(primeraSemana.setDate(diaInicio));
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6); // Finaliza el domingo

    // Formatear a YYYY-MM-DD
    const startDate = inicioSemana.toISOString().split('T')[0];
    const endDate = finSemana.toISOString().split('T')[0];
    return [startDate, endDate];
}


function mejorProducto(ventas, fechaFiltro){
    let contador = {};//objeto
    let valorMayor = 0;
    let idMayor;

    let ventasFiltradas
    if (fechaFiltro) {

        ventasFiltradas = ventas.filter(venta =>{
            const fechaSinHora = venta.fecha_venta.split(' ')[0];
            if (fechaFiltro.includes('W')) {
                const [año, semana] = fechaFiltro.split('-W') // Extraemos año y número de semana
                const [fechaInicio, fechaFin] = obtenerRangoSemana(año, semana);
                return fechaSinHora >= fechaInicio && fechaSinHora <= fechaFin;
            }else if(fechaFiltro.length === 7){
                return fechaSinHora.startsWith(fechaFiltro);
            }else{
                return fechaSinHora == fechaFiltro;
            }
        });
        ventasFiltradas.forEach(venta => {
            const idProducto = venta.producto_id;
            const cantidad = parseFloat(venta.cantidad);
    
            if (contador[idProducto]) {
                contador[idProducto].cantidad += cantidad;
            } else {
                contador[idProducto] = {cantidad: cantidad};;
            }
        });
    }else{
        ventas.forEach(venta=>{
            const idProducto = venta.producto_id;
            let cantidad = venta.cantidad;
            cantidad  = parseFloat(cantidad);
    
            if (contador[idProducto]) {
                contador[idProducto].cantidad += cantidad;
            }else{
                contador[idProducto] = {cantidad: cantidad};
            }
            
        })
    }

    // Opcional: Recorre y muestra las cantidades por producto
    for (const id in contador) {
        if (contador[id].cantidad > valorMayor) {
            idMayor = id;
            valorMayor = contador[id].cantidad;
        }
    }

    let idjson = { id_producto: idMayor };
    // Realizamos la petición asíncrona
    fetch('./src/php/api.php?action=obtenerProductosId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(idjson),
    })
    .then(response => response.json())
    .then(data=>{

        document.getElementById('productoMasVendido').innerHTML = `
        <h2>Producto estrella:</h2> <p>${data.producto} con ${valorMayor} ventas</p><br>`;
    })
}

function mejoresDias(ventas, periodo, fechaFiltro){
    let diasDeLaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    // Crear un objeto Date a partir de la cadena
    let obtenerTotalVentas = {};
    let ventasPorDia = {};
    let ventasFiltradas;

    if (fechaFiltro && fechaFiltro.length < 9) {
        periodo = periodo.charAt(0).toUpperCase() + periodo.slice(1);

        ventasFiltradas = ventas.filter(venta =>{
            const fechaSinHora = venta.fecha_venta.split(' ')[0];
            if (fechaFiltro.includes('W')) {
                const [año, semana] = fechaFiltro.split('-W') // Extraemos año y número de semana
                const [fechaInicio, fechaFin] = obtenerRangoSemana(año, semana);
                return fechaSinHora >= fechaInicio && fechaSinHora <= fechaFin;
            }else if(fechaFiltro.length === 7){
                return fechaSinHora.startsWith(fechaFiltro);
            }
        });
        ventasFiltradas.forEach(venta =>{
            let fechaVenta = venta.fecha_venta;
            let ventaId = venta.venta_id;
    
            let fecha = new Date(fechaVenta);
            let diaDeLaSemana = diasDeLaSemana[fecha.getDay()];
    
            if(!obtenerTotalVentas[ventaId]){
                obtenerTotalVentas[ventaId] = diaDeLaSemana;
                if (!ventasPorDia[diaDeLaSemana]) {
                    ventasPorDia[diaDeLaSemana] = 0;
                }
                ventasPorDia[diaDeLaSemana]++;
            }
        })
    }else{
        ventas.forEach(venta =>{
            let fechaVenta = venta.fecha_venta;
            let ventaId = venta.venta_id;
    
            let fecha = new Date(fechaVenta);
            let diaDeLaSemana = diasDeLaSemana[fecha.getDay()];
    
            if(!obtenerTotalVentas[ventaId]){
                obtenerTotalVentas[ventaId] = diaDeLaSemana;
                if (!ventasPorDia[diaDeLaSemana]) {
                    ventasPorDia[diaDeLaSemana] = 0;
                }
                ventasPorDia[diaDeLaSemana]++;
            }
        })
    }


    const totalVentas = Object.keys(obtenerTotalVentas).length;//Devuelve las claves en string

    //Ordenar 
    let ventasOrdenadas = Object.entries(ventasPorDia);//Convertimos en string el objeto
    //.sort Ordena automaticamente el arreglo

    ventasOrdenadas.sort((a,b)=>b[1] - a[1])

    /*
        [["Lunes", 5], ["Martes", 3], ["Miércoles", 7]]
        .sort((a,b)) = nos dice que tendremos 2 valeres uno a y otro b, ya que vamos a comparar
        b[1] = A NUESTRA VARIABLE B EN LA POSICION 1 ES DECIR COMPARAMOS VALORES NO CLAVES
        a[1] = De igual forma comparamos la primer variable que seria MARTES pero en la pos 1 QUE ES 3
        AL HACER LA RESTA SI ES NEGATIVO VA A IR DESPUES POR LO QUE EL MAYOR QUEDA AL INICIO 
    */
    let html;
    if (fechaFiltro && fechaFiltro.length < 9) {
        html = `<h2>Dias con más ventas en ${fechaFiltro}:</h2>`
    }else{
        html = `<h2>Días con más ventas:</h2>`;
    }
    ventasOrdenadas.forEach((venta, i)=>{
        let operacion = (venta[1] / totalVentas) * 100; 
        html+=`    
            <p>${i+1})<b>${venta[0]}</b> con ${Math.round(operacion.toFixed(2))}% de las ventas totales</p>
        `;
    })
    html += `<p>De <b>${totalVentas}</b> ventas totales</p>`
    document.getElementById('mejoresDias').innerHTML = html;
    let dias = Object.keys(ventasPorDia);
    let ventasTo = Object.values(ventasPorDia);
    console.log(dias);
    console.log(ventasTo);
    graficarVentas(dias,ventasTo,periodo);  
}

function totalGanancias(ventas, fechaFiltro){
    let total = 0;

    const formatoMoneda = new Intl.NumberFormat('es-MX', {style: 'currency', currency: 'MXN'});
    if (fechaFiltro) {
        const ventasFiltradas = ventas.filter(venta => {
            const fechaSinHora = venta.fecha_venta.split(' ')[0];
            if (fechaFiltro.includes('W')) {
                const [año, semana] = fechaFiltro.split('-W') // Extraemos año y número de semana
                const [fechaInicio, fechaFin] = obtenerRangoSemana(año, semana);
                return fechaSinHora >= fechaInicio && fechaSinHora <= fechaFin;
            }else if (fechaFiltro.length === 7) {
                return fechaFiltro.startsWith(fechaFiltro);
            }else{
                return fechaSinHora === fechaFiltro;
            }
        });
        ventasFiltradas.forEach(venta =>{
            total+=parseFloat(venta.precio) * parseInt(venta.cantidad)
        })
        
        document.getElementById('totalGanancias').innerHTML=`
            <br><h2>El total de ganancias en la fecha ${fechaFiltro} es: </h2>
            <p>${formatoMoneda.format(total)}</p>
        `
    }else{

        ventas.forEach(venta => {
            total += venta.precio * venta.cantidad;
        }); 
    
        document.getElementById('totalGanancias').innerHTML=`
            <br><h2>El total de ganancias de las ventas globales es: </h2>
            <p>${formatoMoneda.format(total)}</p>
        `
    }
}

let ventasChart;
function graficarVentas(dias, ventasTo, periodo){

    if (!periodo) {
        periodo = 'día (global)'
    }
    console.log(periodo);

    const ctx = document.getElementById('grafica').getContext('2d');
     // Verificar si ya existe un gráfico, y destruirlo si es necesario
    if (ventasChart) {
        ventasChart.destroy();
    }

    ventasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dias, //eje X
            datasets: [{
                label: `Ventas por ${periodo}`, // Título de la línea
                data: ventasTo, // Datos de ventas en el eje Y
                borderColor: '#042286',//Color de la linea
                backgroundColor: '$870469', // Color de los puntos
                tension: 0, 
                fill: false // Rellenar debajo de la línea
            }]
        },
        options: {
            responsive: true, // Hace que el gráfico sea responsivo
            scales: {
                x: { // Configuración del eje X
                    title: {
                        display: true,
                        text: 'Días'
                    }
                },
                y: { // Configuración del eje Y
                    title: {
                        display: true,
                        text: 'Ventas'
                    },
                    //beginAtZero: true // Asegura que el eje Y empiece desde cero
                }
            }
        }
    });
}