'use strict';

const formulario = ` 
    <form id='formAgregarProducto'>
        <h1>Agregar productos</h1>
        <label>Categoria:</label>
        <select name='categoria' id="categoriaProducto">
            <option>Tacos</option>
            <option>Alambres</option>
            <option>Bebidas</option>
            <option>Postres</option>
        </select><br>
        <label>Introduce el nombre:</label>
        <input type='text' id="nombreProducto" name="nombre" placeholder='Nombre del producto' required><br>
        <label for="precioProducto">Precio:</label>
        <input type="number" id="precioProducto" name="precio" placeholder="Precio del producto" min="0" required><br>
        <button type="button" id="btnAgregarProducto">Agregar producto</button>
    </form>
    <form>
        <br><h1>Modificar productos</h1>
        <label>Introduce el nombre:</label>
        <input type='text' id="buscarProducto" name="nombre" placeholder='Nombre del producto' required><br>
        <button type="button" id="btnBuscarProducto">Agregar producto</button>
    </form>
`;

const agregarProducto = () =>{
    const categoria = document.getElementById("categoriaProducto").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const precio = document.getElementById("precioProducto").value.trim();

    // Validar que todos los campos estén completos
    if (!nombre || !precio || !categoria) {
        Swal.fire("Por favor, completa todos los campos obligatorios.");
        return;
    }

    // Crear el objeto 
    const datos = `nombre=${encodeURIComponent(nombre)}&precio=${encodeURIComponent(precio)}&categoria=${encodeURIComponent(categoria)}`;

    // Enviar los datos por AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:82/proyecto-tacos/src/menuProductos.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                Swal.fire(xhr.responseText);
                // Limpiar campos si se agregó correctamente
                document.getElementById("formAgregarProducto").reset();
            } else {
                console.log("Error en la solicitud:", xhr.status, xhr.responseText);
                Swal.fire("Error al agregar el producto. Intenta nuevamente.");
            }
        }
    };
    xhr.send(datos);
};

const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
document.getElementById('reportes');
const contenido = document.getElementById('contenido');
const tickets = {};//Objeto vacio para almacenar tickets

//////////////////Crreacion dinamica de las mesas/////////////////////
menuVentas.addEventListener('click',()=>{
    contenido.innerHTML = '';
    //////////////////////Tickets por mesa//////////////////////////////////
    const plantilla = ` 
    <button class="mesa" id='mesa1' ><img src="./img/mesa.png"></button>
        <button class="mesa" id='mesa2' style="left: 380px; top: 200px;"><img src="./img/mesa.png"></button>
        <button class="mesa" id='mesa3' style="left: 440px; top: 300px;"><img src="./img/mesa.png"></button>
        <button class="mesa" id ='mesa4' style="left: 480px; top: 400px;"><img src="./img/mesa.png"></button>
        <div>
            <button class="guardar-btn" onclick="guardarPosiciones()">Guardar Posiciones</button>
        </div>
    `;
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.innerHTML = plantilla;
    contenido.appendChild(contenedorNuevo);

    ///Contenido dinamico
    const mesas = document.querySelectorAll('.mesa');
    fetch('http://localhost:82/proyecto-tacos/src/cargarProductosBd.php')
    .then(response => response.json())
    .then(productos => {
        console.log(productos);
        console.log(mesas);
        mesas.forEach((mesa, i) => {
            console.log(mesa);
            mesa.addEventListener('click',()=>{
                console.log('click');
                if (!tickets[i]) {//Si no existe; es decir como no tenemos nada guardado
                    tickets[i] = {};
                    const ticket = document.createElement('div');
                    ticket.classList.add('ticket');
                    
                    let html = `<h2>Orden de mesa ${i + 1}</h2>
                        <form data-index="${i}">
                            <details>
                                <summary>Tacos</summary>`;

                     // Filtrar productos por categoría "Tacos"
                    const tacos = productos.filter(producto => producto.categoria === 'Tacos');
                    tacos.forEach(taco => {
                        html += `<label>${taco.nombre}</label>
                            <input type="number" name="${taco.nombre.toLowerCase()}" value="${tickets[i][taco.nombre.toLowerCase()] || 0}"><br>`;
                    });
 
                    html += `</details>
                    <details>
                        <summary>Alambres</summary>`;

                    const alambres = productos.filter(producto => producto.categoria === 'Alambres');
                    alambres.forEach(alambre => {
                        html += `<label>${alambre.nombre}</label>
                            <input type="number" name="${alambre.nombre.toLowerCase()}" value="${tickets[i][alambre.nombre.toLowerCase()] || 0}"><br>`;
                    });

                    html += `</details>
                        <details>
                            <summary>Bebidas</summary>`;

                    const Bebidas = productos.filter(producto => producto.categoria === 'Bebidas');
                    Bebidas.forEach(bebida =>{
                        html += `<label>${bebida.nombre}</label>
                                <input type='number' name='${bebida.nombre.toLowerCase()}' value='${tickets[i][bebida.nombre.toLowerCase()] || 0}'><br>`;
                    });

                    html += `</details>
                    <details>
                        <summary>Postres</summary>`;
                
                    // Filtrar productos por categoría "Postres"
                    const postres = productos.filter(producto => producto.categoria === 'Postres');
                    postres.forEach(postre => {
                        html += `<label>${postre.nombre}</label>
                            <input type="number" name="${postre.nombre.toLowerCase()}" value="${tickets[i][postre.nombre.toLowerCase()] || 0}"><br>`;
                    });

                    html += `</details>
                            <input type="button" value="Minimizar" onclick="minimizar(${i})">
                            <input type="button" value="Cerrar cuenta" onclick="cerrarCuenta(${i})">
                        </form>`;
                
                ticket.innerHTML = html;
                    
                ticket.querySelectorAll('input[type=number]').forEach(input =>{
                    input.addEventListener('input',()=>{
                        tickets[i][input.name] = input.value;
                        /*
                            tickets = { esto es un objeto
                                0: {
                                    pastor: "3"...
                                    lon: "2"
                                }
                            }
                        */
                    });
                });
                ticket.dataset.index = i;
                contenido.appendChild(ticket);
            }else {//Si ya existe
                //Los [] permiten buscar elementos por atributos
                const ticket = document.querySelector(`.ticket[data-index="${i}"]`);
                ticket.classList.toggle('hidden'); //añade o remueve .toggle
            }
            });
        });
    });
});
function minimizar(index){
    const ticket = document.querySelector(`.ticket[data-index="${index}"]`);
    if (ticket) {
        ticket.classList.add('hidden');
    }
}
window.minimizar = minimizar;//Hacerlo visible

///////////////////Inventarios
menuInventarios.addEventListener('click',()=>{
    contenido.innerHTML = '';
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.innerHTML = formulario;
    contenido.appendChild(contenedorNuevo);

    const btnAgregar = document.getElementById('btnAgregarProducto');
    btnAgregar.addEventListener('click', agregarProducto);
});


/////////////////////////Inicio de sesion//////////////
// Obtener todas las cookies
const cookies = document.cookie;
// Verificar si la cookie "login" existe
if (!cookies.split("; ").some(cookie => cookie.startsWith("login="))) {
    window.location.replace("../index.html");
}

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

console.log('hola mundoo');
