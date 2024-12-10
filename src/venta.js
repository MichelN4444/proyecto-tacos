export function registrarVenta(venta) {
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
export function obtenerVentas(){
    fetch('./src/php/api.php?action=cargarVentas') 
        .then(response => response.json())
        .then(ventas => {
            console.log(ventas);

            const productoMasVendido = obtenerProductoMasVendido(ventas);
            const mejoresDias = obtenerMejoresDias(ventas);
            const totalGanancias = calcularTotalGanancias(ventas);

            // Mostrar resultados en la página
            mostrarResultados(productoMasVendido, mejoresDias, totalGanancias);

            // Graficar resultados
            graficarDatos(productoMasVendido, mejoresDias, totalGanancias);
        })
        .catch(error => console.log(error));
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

function obtenerProductoMasVendido(ventas) {
    const contadorProductos = {};//objeto

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
    //console.log(productoMasVendidoId);
    let idjson = {id_producto: productoMasVendidoId}

    fetch('./src/php/api.php?action=obtenerProductosId',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(idjson),
    })
    .then(response => response.json())
    .then(data =>{
        productoMasVendidoId = data
        console.log(data);
    })
    return productoMasVendidoId;
}

function obtenerMejoresDias(ventas) {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const contadorDias = {};

    ventas.forEach(venta => {
        const fecha = new Date(venta.fecha_venta);
        const diaSemana = fecha.getDay();

        if (contadorDias[diaSemana]) {
            contadorDias[diaSemana] += 1;
        } else {
            contadorDias[diaSemana] = 1;
        }
    });

    const mejoresDias = Object.keys(contadorDias).map(dia => ({
        dia: diasSemana[dia],
        ventas: contadorDias[dia]
    }));

    return mejoresDias;
}

function calcularTotalGanancias(ventas) {
    let total = 0;

    ventas.forEach(venta => {
        total += venta.precio * venta.cantidad;
    });

    return total;
}


function mostrarResultados(productoMasVendidoId, mejoresDias, totalGanancias) {

    document.getElementById('productoMasVendido').innerText = `Producto más venndido: ${productoMasVendidoId}`;
    console.log(productoMasVendidoId);
    let dias;
    let ventas;
    mejoresDias.forEach( dia=>{
        dias = dia.dia;
        ventas= dia.ventas;
    })
    document.getElementById('mejoresDias').innerText = `Mejores días: ${dias} con ${ventas} ventas`;
    document.getElementById('totalGanancias').innerText = `Tots al de ganancias: $${totalGanancias.toFixed(2)}`;
}

function graficarDatos(productoMasVendidoId, mejoresDias, totalGanancias) {
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
    if (productoMasVendidoId) {
        productoDiv.innerHTML = `<h3>Producto más vendido: ${productoMasVendidoId}</h3><p>Total ventas: ${productoMasVendidoId.cantidad_total}</p>`;
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