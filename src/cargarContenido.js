import {formulario, llenarCategorias, agregarProducto, tabla, btnEditarProductos} from './menuDinamico';
import { obtenerVentas, registrarVenta } from './venta';
import { agregarCategorias } from './menuDinamico';

const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
const menuReportes = document.getElementById('reportes');
const contenido = document.getElementById('contenido');
const tickets = {};//Objeto vacio para almacenar tickets

/////////////////////////Inicio de sesion//////////////
// Obtener todas las cookies para que no se salten el login
const cookies = document.cookie;
// Verificar si la cookie "login" existe
if (!cookies.split("; ").some(cookie => cookie.startsWith("login="))) {
    window.location.replace("./index.html");
}


//////////////////Crreacion dinamica de las mesas/////////////////////
menuVentas.addEventListener('click',()=>{
    contenido.innerHTML = ''
    console.log ('click en menu');
    //////////////////////Tickets por mesa//////////////////////////////////
    const plantilla = ` 
    <button class="mesa" id='mesa1' ><img src="./img/mesa.png"></button>
    <button class="mesa" id='mesa2' style="left: 380px; top: 200px;"><img src="./img/mesa.png"></button>
    <button class="mesa" id='mesa3' style="left: 440px; top: 300px;"><img src="./img/mesa.png"></button>
    <button class="mesa" id ='mesa4' style="left: 480px; top: 400px;"><img src="./img/mesa.png"></button>
    `;
    // <div>
    // </div>
    // <button class="guardar-btn" onclick="guardarPosiciones()">Guardar Posiciones</button>
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.innerHTML = plantilla;
    contenido.appendChild(contenedorNuevo);
    
    ///Contenido dinamico
    const mesas = document.querySelectorAll('.mesa');
    
    fetch('./src/php/api.php?action=cargarProductos')
    .then(response => response.json())
    .then(productos => {
        console.log(productos);
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
                            <summary>${categoria}</summary>`;

                        const productosCategoria = productos.filter(producto => producto.categoria_nombre == categoria);
                        productosCategoria.forEach(producto => {
                            if (producto.producto_nombre) {
                                const nombreProducto = producto.producto_nombre.toLowerCase();
                                const valor = tickets[i][nombreProducto] || 0;
                                html += `
                                <label>${producto.producto_nombre}</label>
                                <input type="number" name="${nombreProducto}" value="${valor}" min="0"><br>`;
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
                console.log('3');
                const ticket = document.querySelector(`.ticket[data-index="${index}"]`);//Los editados
                const form = ticket.querySelector('form')

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
                const venta = JSON.stringify(productosVenta);
                
                registrarVenta(venta);
                form.querySelectorAll('input[type="number"]').forEach(input =>{
                    input.value = 0;
                })
                minimizar(index);
            }
            window.cerrarCuenta = cerrarCuenta;
        });
    });
    
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
})

function recargar (){
    contenido.innerHTML = ''
    const contenedorNuevo = document.createElement('div');
    // contenedorNuevo.id = 'contenedorInventarios';
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

menuReportes.addEventListener('click', () => {
    contenido.innerHTML = ''
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.setAttribute('id', 'resultados');

    // Crear el contenido HTML para el informe
    const plantilla = `
    <h2>Informe de ventas</h2>
    <p id="productoMasVendido"></p>
    <p id="mejoresDias"></p>
    <p id="totalGanancias"></p>`;
    contenedorNuevo.innerHTML = plantilla;

    // Crear el elemento canvas
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'grafica');
    canvas.setAttribute('width', '784');
    canvas.setAttribute('height', '331');

    // Agregar el canvas al contenedorNuevo
    contenedorNuevo.appendChild(canvas);

    // Agregar el contenedor al body o a otro elemento
    contenido.appendChild(contenedorNuevo);

    obtenerVentas();

});



function cerrarSesion(){
    console.log('cerrando');
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

