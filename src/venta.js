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

/////////////////PARA ANALIZAR LAS VENTAS/////////////////77
export const ventas = () =>{

}


//hacerlo sin async
export async function obtenerVentas(){
    try {
        const response = await fetch('./src/php/api.php?action=cargarVentas');
        const ventas = await response.json();

        // Esperar la resolución de la promesa de obtenerProductoMasVendido
        const productoMasVendido = await obtenerProductoMasVendido(ventas);
        const mejoresDias = obtenerMejoresDias(ventas);
        const totalGanancias = calcularTotalGanancias(ventas);

        // Mostrar resultados en la página
        mostrarResultados(productoMasVendido, mejoresDias, totalGanancias);

        // Graficar resultados
        graficarDatos(productoMasVendido, mejoresDias, totalGanancias);
    } catch (error) {
        console.log(error);
    }
}


function obtenerVentasAgrupadas(ventas) {
    return ventas.reduce((acc, venta) => {
        // Si no existe la clave 'venta_id', la creamos
        if (!acc[venta.venta_id]) {
            acc[venta.venta_id] = [];
        }
        // Agregamos la venta al grupo correspondiente
        acc[venta.venta_id].push(venta);
        return acc;
    }, {});
}

async function obtenerProductoMasVendido(ventas) {
    const contadorProductos = {}; // objeto

    ventas.forEach(venta => {
        const productoId = venta.producto_id;
        if (contadorProductos[productoId]) {
            contadorProductos[productoId] += venta.cantidad;
        } else {
            contadorProductos[productoId] = venta.cantidad;
        }
    });

    // Encontrar el producto más vendido
    let productoMasVendidoId = Object.keys(contadorProductos).reduce((a, b) => contadorProductos[a] > contadorProductos[b] ? a : b);

    let idjson = { id_producto: productoMasVendidoId };

    // Realizamos la petición asíncrona
    const response = await fetch('./src/php/api.php?action=obtenerProductosId', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(idjson),
    });

    // Esperamos la respuesta JSON
    const data = await response.json();

    // Retornamos el producto más vendido
    let productoMasVendido= data.producto
    return productoMasVendido;//Hay que agregarle cuantas ventas a hecho
}

function obtenerMejoresDias(ventas) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const contadorDias = {};
    const ventasContadas = new Set();

    console.log(ventas);
    ventas.forEach(venta => {
        const fecha = new Date(venta.fecha_venta);//Fecha venta
        const ventaId = venta.venta_id;

        //console.log(diaSemana);
        if (!ventasContadas.has(ventaId)) {//entonces si no se encuentra el id
            ventasContadas.add(ventaId)//Se cuenta o se registra

            const diaSemana = fecha.getDay();//Se inicializa el numero de dia
            if (contadorDias[diaSemana]) {
                contadorDias[diaSemana] += 1; // Aumentamos el contador para ese día
            } else {
                contadorDias[diaSemana] = 1; // Inicializamos el contador para ese día
            }
        }
    });

    const mejoresDias = Object.keys(contadorDias).map(dia => ({
        dia: diasSemana[dia],
        ventas: contadorDias[dia]
    }));

    return mejoresDias;//Aqui ya no se repiten ventas
}

function calcularTotalGanancias(ventas) {
    let total = 0;

    ventas.forEach(venta => {
        total += venta.precio * venta.cantidad;
    });

    return total;
}


function mostrarResultados(productoMasVendido, mejoresDias, totalGanancias) {

    document.getElementById('productoMasVendido').innerText = `Producto más venndido: ${productoMasVendido}`;
    let dias;
    let ventas;
    mejoresDias.forEach( dia=>{
        dias = dia.dia;
        ventas= dia.ventas;
    })
    document.getElementById('mejoresDias').innerText = `Mejores días: ${dias} con ${ventas} ventas`;
    document.getElementById('totalGanancias').innerText = `Tots al de ganancias: $${totalGanancias.toFixed(2)}`;
}

function graficarDatos(productoMasVendido, mejoresDias, totalGanancias) {
    const ctx = document.getElementById('grafica').getContext('2d');

    // Graficar las ventas por día
    const dias = mejoresDias.map(dia => dia.dia);
    const cantidades = mejoresDias.map(dia => dia.ventas);

    new Chart(ctx, {
        type: 'bar',  // Puedes cambiar el tipo de gráfico
        data: {
            labels: dias,
            datasets: [{
                label: 'Ventas por Día',
                data: cantidades,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Mostrar el producto más vendido
    const productoDiv = document.getElementById('productoMasVendido');
    console.log(productoMasVendido);
    if (productoMasVendido) {
        productoDiv.innerHTML = `<h3>Producto más vendido: ${productoMasVendido}</h3><p>Total ventas: ${productoMasVendido.cantidad_total}</p>`;
    } else {
        productoDiv.innerHTML = `<h3>No se encontró el producto más vendido.</h3>`;
    }

    // Mostrar los mejores días
    const diasDiv = document.getElementById('mejoresDias');
    if (mejoresDias && mejoresDias.length > 0) {
        diasDiv.innerHTML = `<h3>Mejores días para vender:</h3>`;
        mejoresDias.forEach(dia => {
            diasDiv.innerHTML += `<p>${dia.dia}: ${dia.cantidad} ventas</p>`;
        });
    } else {
        diasDiv.innerHTML = `<h3>No se encontraron días con ventas destacadas.</h3>`;
    }

    // Mostrar las ganancias totales
    const gananciasDiv = document.getElementById('totalGanancias');
    if (totalGanancias !== undefined) {
        gananciasDiv.innerHTML = `<h3>Ganancias totales: $${totalGanancias.toFixed(2)}</h3>`;
    } else {
        gananciasDiv.innerHTML = `<h3>No se encontraron datos de ganancias.</h3>`;
    }
}