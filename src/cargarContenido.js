import {formulario, llenarCategorias, agregarProducto, tabla, btnEditarProductos} from './menuDinamico';
import {obtenerFecha, registrarVenta, ventas } from './venta';
import { agregarCategorias } from './menuDinamico';


const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
const menuReportes = document.getElementById('reportes');
const contenido = document.getElementById('contenido');
let tickets = JSON.parse(localStorage.getItem('tickets')) || {};//Objeto vacio para almacenar tickets

document.addEventListener('DOMContentLoaded', () => {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || {};
    for (const index in tickets) {
        const event = new Event('click');
        document.querySelector(`.mesa[data-index="${index}"]`)?.dispatchEvent(event);
    }
});



// Verificar el rol del usuario al cargar la página
function actualizaVisualizador() {
    const userRole = sessionStorage.getItem("userRole");
    console.log('se ejecuta');
    // Si el rol es 'user' (mesero), ocultamos las secciones de administrador
    if (userRole === "user") {
        document.querySelectorAll('.admin-only').forEach((element) => {
            element.setAttribute('style', 'display: none !important;');  // Agregar el estilo en línea
        });
    }
}

/////////////////////////Inicio de sesion//////////////
// Obtener todas las cookies para que no se salten el login
const cookies = document.cookie;
// Verificar si la cookie "login" existe
if (!cookies.split("; ").some(cookie => cookie.startsWith("login="))) {
    window.location.replace("./index.html");
}

//////////////////////////////////////////7
function toggleMenu() {
    var menu = document.querySelector('.menu');
    menu.classList.toggle('active');
}
window.toggleMenu = toggleMenu;

//////////////////Crreacion dinamica de las mesas/////////////////////
menuVentas.addEventListener('click',()=>{

    contenido.innerHTML = ''
    const mesasGuardadas = JSON.parse(localStorage.getItem('mesas')) || [];
    const contenedorMesas = document.getElementById('contenedorMesas') || document.createElement('div');
    contenedorMesas.id = 'contenedorMesas';
    document.getElementById('contenido').appendChild(contenedorMesas);

    // Renderizar mesas guardadas
    mesasGuardadas.forEach(mesa => {
        contenedorMesas.innerHTML += `
            <button class="mesa" id='${mesa.id}'>
                <img src="./img/mesa.png">
                <span>Mesa ${mesa.numero}</span>
            </button>
        `;
    });

    contenido.appendChild(contenedorMesas);
    const contenedorBoton = document.createElement('div');
    contenedorBoton.innerHTML = "<button id='btn-agregarMesas'>Agregar mesa</button>";
    contenedorBoton.innerHTML += "<button id='btn-eliminarMesas'>Eliminar mesa</button>"
    contenido.appendChild(contenedorBoton);
    document.getElementById('btn-eliminarMesas').addEventListener('click',()=>{
        const mesas = document.querySelectorAll('.mesa');
        const mesasGuardadas = JSON.parse(localStorage.getItem('mesas')) || [];

        const ultimaMesa = mesas[mesas.length-1];
        const idEliminar = ultimaMesa.id;

        const elementoEliminar = document.getElementById(`${idEliminar}`)

        contenedorMesas.removeChild(elementoEliminar);

        const nuevasMesas = mesasGuardadas.filter(mesa => mesa.id !== idEliminar);
        localStorage.setItem('mesas', JSON.stringify(nuevasMesas));
    })

    document.getElementById('btn-agregarMesas').addEventListener('click',()=>{
        const mesas = document.querySelectorAll('.mesa')
        const mesasGuardadas = JSON.parse(localStorage.getItem('mesas')) || [];
        let numero = mesas.length > 0 
        ? parseInt(mesas[mesas.length - 1].id.match(/\d+$/)[0], 10) + 1 
        : 1;


        const nuevaMesa = {
            id: `mesa${numero}`,
            numero: numero,
        };
        mesasGuardadas.push(nuevaMesa);
    
        // Guardar en localStorage
        localStorage.setItem('mesas', JSON.stringify(mesasGuardadas));
    
        // Renderizar nueva mesa
        contenedorMesas.innerHTML += `
            <button class="mesa" id='${nuevaMesa.id}'>
                <img src="./img/mesa.png">
                <span>Mesa ${nuevaMesa.numero}</span>
            </button>
        `;
    })
});
///Contenido dinamico
document.getElementById('contenido').addEventListener('click',(e)=>{
    if (e.target.closest('.mesa')) {//delogacion de eventos
        const mesas = document.querySelectorAll('.mesa');
        
        fetch('./src/php/api.php?action=cargarProductos')
        .then(response => response.json())
        .then(productos => {
            
            mesas.forEach((mesa, i) => {
                mesa.addEventListener('click', () => {
                    if (!tickets[i]) { // Si el ticket no existe en `tickets`
                        tickets[i] = {};
                    }
                    
                    let ticket = document.querySelector(`.ticket[data-index="${i}"]`);
                    if (!ticket) { // Si no existe en el DOM
                        ticket = document.createElement('div');
                        ticket.classList.add('ticket');
                        ticket.dataset.index = i;
                        let html = `<h2>Orden de mesa ${i + 1}</h2>
                        <form data-index="${i}">`;
        
                        const categorias = [...new Set(productos.map(producto => producto.categoria_nombre))];
        
                        categorias.forEach(categoria=>{
                            html += `
                            <details>
                                <summary><b>${categoria}</b></summary>`;
        
                            const productosCategoria = productos.filter(producto => producto.categoria_nombre == categoria);
                            productosCategoria.forEach(producto => {
                                if (producto.producto_nombre) {
                                    const nombreProducto = producto.producto_nombre.toLowerCase();
                                    const valor = tickets[i][nombreProducto] || 0;
                                    html += `
                                    <label>${producto.producto_nombre}</label>
                                    <input type="number" class="inputPro" name="${nombreProducto}" value="${valor}" min="0"><br>
                                    `;
                                } else {
                                    console.warn(`Producto sin nombre encontrado: ${JSON.stringify(producto)}`);
                                }
                            });
        
                            html += "</details>"
                        });
                        html += `
                        <input type="button" value="Minimizar" onclick="minimizar(${i})">
                        <input type="button" value="Cerrar cuenta" onclick="cerrarCuenta(${i})">
                        </form>`;
                        ticket.innerHTML = html;     
        
                        ticket.querySelectorAll('input[type=number]').forEach(input => {
                            input.addEventListener('input', () => {
                                    tickets[i][input.name] = input.value;
                                    localStorage.setItem('tickets', JSON.stringify(tickets)); // Guardar en localStorage
                            });
                        });
                        contenido.appendChild(ticket);
                        }
                        if (ticket.classList.contains('hidden')) {
                            ticket.classList.remove('hidden')
                        }
                        
                    });
                });
                function cerrarCuenta(index){
                    const ticket = document.querySelector(`.ticket[data-index="${index}"]`);//Los editados
                    const form = ticket.querySelector('form')
                    let venta;
                    const productosVenta = [];
                    
                    form.querySelectorAll('input[type="number"]').forEach(input => {
                        const productoNombre = input.name;
                        const cantidad = parseInt(input.value, 10);
                
                        const producto = productos.find(p => p.producto_nombre && p.producto_nombre.toLowerCase() === productoNombre.toLowerCase());
                
                        if (producto && cantidad != 0) {
                            productosVenta.push({
                                producto_id: producto.id, // Producto id
                                nombre: productoNombre,
                                cantidad: cantidad, // Cantidad modificada
                                precio: producto.precio // Precio del producto
                            });
                        }
                    });
                    venta = JSON.stringify(productosVenta);
                    const registroVenta = registrarVenta(venta, tickets[index], form);
                    if (registrarVenta == 'hecho') {
                        tickets[index] = '';
                        localStorage.setItem('tickets', JSON.stringify(tickets));
                        minimizar(index);
                    }
        
                    minimizar(index);
                }
                window.cerrarCuenta = cerrarCuenta;
            });
    }
})
    
    function minimizar(index) {
        const ticket = document.querySelector(`.ticket[data-index="${index}"]`);
        if (ticket) {
            ticket.classList.add('hidden');
        }
    }
    window.minimizar = minimizar;//Hacerlo visible

///////////////////Inventarios////////////////////
menuInventarios.addEventListener('click',()=>{
    recargar();
    actualizaVisualizador();
})

function recargar (){
    contenido.innerHTML = ''
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.classList.add('admin-only')
    contenedorNuevo.innerHTML = formulario;
    contenido.appendChild(contenedorNuevo);
    llenarCategorias();
    tabla();
    const btnAgregar = document.getElementById('btnAgregarProducto');
    btnAgregar.addEventListener('click', ()=>agregarProducto(recargar))
    const contenedorEditar= document.createElement('div');
    btnEditarProductos(contenedorEditar, recargar);
    agregarCategorias(recargar);
    
    contenido.appendChild(contenedorEditar);
}


function exportarPdf() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const contenido = document.getElementById('resultados'); // Obtenemos el contenido a imprimir

    html2canvas(contenido, {
        scale: 3,
        useCORS: true,
        backgroundColor: "#ffffff",
        imageSmoothingEnabled: false,
    }).then(canvas => {
        const imgData = canvas.toDataURL('image/png'); // Convertir a imagen PNG

        // Agregar la imagen generada por html2canvas al PDF
        const imgWidth = 190; // Ancho en mm
        const pageHeight = 297; // Altura en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;

        if (heightLeft > pageHeight) {
            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, pageHeight);
                heightLeft -= pageHeight;
                position += pageHeight; // Mover hacia abajo para la siguiente página
                if (heightLeft > 0) {
                    pdf.addPage(); // Agregar nueva página
                }
            }
        } else {
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        }

        // Aquí empezamos a dibujar la tabla manualmente
        const tabla = document.getElementById('tablaVentas'); // Obtener la tabla HTML

        // Definir las posiciones de la tabla
        let startX = 10;
        let startY = position + imgHeight + 10; // Ajustar la posición para que no quede encima de la imagen
        const rowHeight = 10; // Altura de cada fila
        const colWidths = [50, 50, 50]; // Anchos de las columnas
        const margin = 5; // Márgenes dentro de las celdas

        const pageHeightForTable = pageHeight - startY - 10; // Espacio disponible para la tabla en la página actual
        let currentY = startY;

        // Dibujar las filas de la tabla
        Array.from(tabla.rows).forEach((row, rowIndex) => {
            // Verificar si la fila se ajusta a la página actual
            if (currentY + rowHeight > pageHeight) {
                pdf.addPage(); // Si no cabe, agregamos una nueva página
                currentY = 10; // Reiniciar la posición en la nueva página
            }

            // Dibujar celdas de la fila
            Array.from(row.cells).forEach((cell, colIndex) => {
                // Dibujar el rectángulo para cada celda
                pdf.rect(startX + colWidths[colIndex] * colIndex, currentY, colWidths[colIndex], rowHeight);

                // Escribir el texto en la celda
                pdf.text(cell.textContent, startX + colWidths[colIndex] * colIndex + margin, currentY + 7); // +7 para centrar el texto verticalmente
            });

            currentY += rowHeight; // Mover hacia abajo para la siguiente fila
        });

        // Descargar el PDF con el nombre "Resumen_Ventas.pdf"
        pdf.save('Resumen_Ventas.pdf');
    });
}

window.exportarPdf = exportarPdf;

menuReportes.addEventListener('click', () => {
    contenido.innerHTML = ''
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.setAttribute('id', 'resultados');
    contenedorNuevo.classList.add('admin-only')

    
    // Crear el elemento canvas
    const titulo = `
        <div class='cabecera'>
            <h2>Informe de ventas</h2>
            <div class="botonesVentas">
                <button id="botonPdf" onclick="exportarPdf()">Exportar pdf
                    <i class="fi fi-rs-file-pdf" id="icono-pdf"></i>
                </button>
                <div class="dropdown">
                    <button class="btn-dropdown" id="boton">
                        <i class="fi fi-br-calendar-day" id="icono-calendario"></i>
                        <span id="boton-text">Diario</span>
                        <i class="fi fi-rr-angle-small-down" id="icono-flechaAbajo"></i>
                    </button>
                    <div class="dropdown-content" id="opciones">
                        <a href="#" id="diario">Diario</a>
                        <a href="#" id="semanal">Semanal</a>
                        <a href="#" id="mensual">Mensual</a>
                    </div>
                </div>
            </div>
            <div id="periodo-selector">
                <!-- Formulario dinámico aparecerá aquí -->
            </div>
        </div>
    `;

    contenedorNuevo.innerHTML = titulo
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'grafica');
    canvas.setAttribute('width', '784');
    canvas.setAttribute('height', '331');
    
    contenedorNuevo.appendChild(canvas);
    
    const plantilla = `
    <p id="productoMasVendido"></p>
    <p id="mejoresDias"></p>
    <p id="totalGanancias"></p><br>
    <div class="table-contenedor">
        <table id="tablaVentas" border="1" class="tabla-productos">
            <thead class="thead-productos">
                <tr class="fila-encabezado">
                    <th class="columna-nombre">Nombre del producto</th>
                    <th class="columna-modificar">Ventas</th>
                    <th class="columna-modificar">Ganancias</th>
                </tr>
            </thead>
            <tbody class="tbody-productos">
            </tbody>
        </table>
    </div>
    `;


    // Agregar el canvas al contenedorNuevo
    contenedorNuevo.innerHTML += plantilla;

    // Agregar el contenedor al body o a otro elemento
    contenido.appendChild(contenedorNuevo);


    // Variables
    const boton = document.getElementById('boton');
    const opciones = document.getElementById('opciones');
    const periodoSelector = document.getElementById('periodo-selector');

    // Mostrar/ocultar opciones del dropdown
    boton.addEventListener('click', () => {
        opciones.classList.toggle('show');
    });

    // Función para actualizar el selector de periodo
    let valorSeleccionado;
    function actualizarSelector(periodo) {
        let html = '';
        if (periodo === 'diario') {
            html = `
                <label for="dia">Seleccionar día:</label>
                <input type="date" id="dia">
            `;
        } else if (periodo === 'semanal') {
            html = `
                <label for="semana">Seleccionar semana:</label>
                <input type="week" id="semana">
            `;
        } else if (periodo === 'mensual') {
            html = `
                <label for="mes">Seleccionar mes:</label>
                <input type="month" id="mes">
            `;
        }
        periodoSelector.innerHTML = html;
         // Agregar evento de cambio al nuevo campo de entrada
        const inputFecha = periodoSelector.querySelector('input');
        inputFecha.addEventListener('change', () => {
            valorSeleccionado = inputFecha.value; // Obtener el valor seleccionado
            obtenerFecha(periodo, valorSeleccionado) // Pasar el valor a una función
        });
    }

    document.getElementById('diario').addEventListener('click', () => {
        document.getElementById('boton-text').textContent = 'Diario';
        
        actualizarSelector('diario');
        opciones.classList.remove('show');  // Ocultar el dropdown
    });

    document.getElementById('semanal').addEventListener('click', () => {
        document.getElementById('boton-text').textContent = 'Semanal';
        actualizarSelector('semanal');
        opciones.classList.remove('show'); 
    });

    document.getElementById('mensual').addEventListener('click', () => {
        document.getElementById('boton-text').textContent = 'Mensual';
        actualizarSelector('mensual');
        opciones.classList.remove('show'); 
    });

    ventas();
    actualizaVisualizador();
});



function cerrarSesion(){
    document.cookie = "login=true;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("./index.html");  
}
window.cerrarSesion = cerrarSesion;

// document.querySelectorAll('.mesa').forEach(mesa => {
//     mesa.addEventListener('mousedown', function(e) {
//         let shiftX = e.clientX - mesa.getBoundingClientRect().left;
//         let shiftY = e.clientY - mesa.getBoundingClientRect().top;

//         function moveAt(pageX, pageY) {
//             mesa.style.left = pageX - shiftX + 'px';
//             mesa.style.top = pageY - shiftY + 'px';
//         }

//         function onMouseMove(event) {
//             moveAt(event.pageX, event.pageY);
//         }

//         // Mover la mesa al hacer clic
//         document.addEventListener('mousemove', onMouseMove);

//         // Soltar la mesa y quitar los eventos
//         mesa.addEventListener('mouseup', function() {
//             document.removeEventListener('mousemove', onMouseMove);
//         });

//         // Evitar que la mesa se arrastre en Firefox
//         mesa.ondragstart = function() {
//             return false;
//         };
//     });
// });

// // Función para guardar las posiciones de las mesas en localStorage
// function guardarPosiciones() {
//     let posiciones = {};
//     document.querySelectorAll('.mesa').forEach(mesa => {
//         posiciones[mesa.id] = {
//             left: mesa.style.left,
//             top: mesa.style.top
//         };
//     });
//     localStorage.setItem('posicionesMesas', JSON.stringify(posiciones));
//     alert('Posiciones guardadas');
// }

// // Función para cargar las posiciones de las mesas desde localStorage
// function cargarPosiciones() {
//     let posiciones = JSON.parse(localStorage.getItem('posicionesMesas'));
//     if (posiciones) {
//         for (let id in posiciones) {
//             let mesa = document.getElementById(id);
//             if (mesa) {
//                 mesa.style.left = posiciones[id].left;
//                 mesa.style.top = posiciones[id].top;
//             }
//         }
//     }
// }

// // Cargar las posiciones al cargar la página
// window.onload = cargarPosiciones;

