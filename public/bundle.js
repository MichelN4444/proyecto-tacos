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

    <br><h1>Modificar productos</h1>
    <div class="table-contenedor">
        <table id="productosTabla" border='1'>
            <thead>
                <tr>
                    <th>Nombre del producto</th>
                    <th>Categoria</th>
                    <th>Precio</th>
                    <th>Modificar</th>
                    <th>Visible en el menú</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
    <button id="editarSeleccionados">Editar seleccionados</button>
`;
//Llenar tabla
const tabla = () => {
    fetch('./src/php/api.php?action=obtenerProductos')
    .then(response => response.json())
    .then(data => {
        const llenarTabla = document.querySelector('#productosTabla tbody');
        llenarTabla.innerHTML = ''; 

        data.forEach(producto => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>$${producto.precio}</td>
                <td><input class="seleccionar" type="checkbox" value="${producto.id}" data-info='${producto.nombre}'></td>
            `;
            llenarTabla.appendChild(fila);
        });
    })
    .catch(error => console.error('Error:', error));
   //Aqui va
};

const btnEditarProductos = (contenedorEditar) =>{
    document.getElementById('editarSeleccionados').addEventListener('click' ,()=>{
        const seleccionados = document.querySelectorAll('.seleccionar:checked');
        const ids = Array.from(seleccionados).map(checkbox => checkbox.value);
        const nombres = Array.from(seleccionados).map(checkbox => checkbox.dataset.info);

        if(seleccionados.length == 0){
            Swal.fire("Selecciona al menos un producto!");
            return;
        }
        //Aqui se crea un formulario para editar o elimar
        let html = '<form id="editarFormulario">';
        
        ids.forEach((id, i) => {
                html += `
                    <br><label>Producto: ${nombres[i]}</label>
                    <input type="text" name="nombre_${id}" placeholder="Nuevo nombre">
                    <input type="number" name="precio_${id}" placeholder="Nuevo precio">
                    <input type="text" name="categoria_${id}" placeholder="Nueva categoría">
                    <button type="button" class='btnEliminar' data-id="${id}">Eliminar producto</button></form>
                `;
        });
    html += `<button type="submit">Guardar cambios</button></form>`;
    contenedorEditar.innerHTML = html;
    // Manejar la edición y guardar en la BD

    document.querySelectorAll('.btnEliminar').forEach(btn =>{
        btn.addEventListener('click', (e)=>{
            const id = e.target.getAttribute('data-id'); // Obtener el ID del producto
    
            // Confirmar antes de eliminar
            Swal.fire({
                title: "¿Estás seguro?",
                text: "No podras revertirlo!",
                icon: "Atencion",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                cancelButtonText: 'Cancelar',
                confirmButtonText: "Sí, eliminarlo!"
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`http://localhost:82/proyecto-tacos/src/php/api.php?action=eliminarProducto&id=${id}`, {
                        method: 'POST'
                    })
                    .then(response => response.json())
                    .then(result => {
                    if (result.success) {
                        Swal.fire({
                            title: "Eliminado!",
                            text: "El producto fue eliminado.",
                            icon: "success"
                        });
                        location.reload(); // Recargar la tabla para reflejar los cambios
                    } else {
                        Swal.fire({
                            title: "Ha ocurrido un error",
                            showClass: {
                            popup: `
                                animate__animated
                                animate__fadeInUp
                                animate__faster
                            `
                            },
                            hideClass: {
                            popup: `
                                animate__animated
                                animate__fadeOutDown
                                animate__faster
                            `
                            }
                        });
                    }
                });
                }
            });
        });
    });
    document.querySelector('#editarFormulario').addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        fetch('http://localhost:82/proyecto-tacos/src/php/api.php?action=editarProductos', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    alert('Productos actualizados');
                    location.reload(); // Recargar la tabla
                } else {
                    alert('Error al actualizar los productos');
                }
            });
    });
    });
};
//En el html de arriba colocar la tabla en donde se verán los productos que tenemos, podemos tambien hacer las categorias dinamicas
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
    xhr.open("POST", "./src/php/api.php?action=insertarProductos", true);//?action=insertarProductos
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
                Swal.fire(xhr.responseText);
                // Limpiar campos si se agregó correctamente
                document.getElementById("formAgregarProducto").reset();
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                console.log("Error en la solicitud:", xhr.status, xhr.responseText);
                Swal.fire("Error al agregar el producto. Intenta nuevamente.");
            }
        }
    };
    xhr.send(datos);
};

const registrarVenta = (venta) =>{
    venta = JSON.stringify(venta);
    console.log(venta);

    fetch('./src/php/api.php?action=registrarVenta',{
        method: 'POST',
        headers:{
            'Content-type': 'application/json'
        },
        body: venta
    })
    .then(response => response.json())
    .then(result => {
        console.log('respuesta del server', result);
    })
    .catch(error => console.log('error:', error));
};

const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
document.getElementById('reportes');
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
    contenido.innerHTML = '';
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
                    <form data-index="${i}">
                    <details>
                    <summary>Tacos</summary>`;
                    const tacos = productos.filter(producto => producto.categoria === 'Tacos');
                    tacos.forEach(taco => {
                        html += `<label>${taco.nombre}</label>
                        <input type="number" name="${taco.nombre.toLowerCase()}" value="${tickets[i][taco.nombre.toLowerCase()] || 0}" min='0'><br>`;
                    });
                    
                    html += `</details>
                    <details>
                    <summary>Alambres</summary>`;
                    
                    const alambres = productos.filter(producto => producto.categoria === 'Alambres');
                    alambres.forEach(alambre => {
                        html += `<label>${alambre.nombre}</label>
                                <input type="number" name="${alambre.nombre.toLowerCase()}" value="${tickets[i][alambre.nombre.toLowerCase()] || 0}" min='0'><br>`;
                            });
                            
                            html += `</details>
                            <details>
                            <summary>Bebidas</summary>`;
                            
                            const bebidas = productos.filter(producto => producto.categoria === 'Bebidas');
                            bebidas.forEach(bebida => {
                                html += `<label>${bebida.nombre}</label>
                                <input type='number' name='${bebida.nombre.toLowerCase()}' value='${tickets[i][bebida.nombre.toLowerCase()] || 0}' min='0'><br>`;
                            });
                            
                            html += `</details>
                            <details>
                            <summary>Postres</summary>`;
                            
                            const postres = productos.filter(producto => producto.categoria === 'Postres');
                            postres.forEach(postre => {
                                html += `<label>${postre.nombre}</label>
                                <input type="number" name="${postre.nombre.toLowerCase()}" value="${tickets[i][postre.nombre.toLowerCase()] || 0}" min='0'><br>`;
                            });
                            
                            html += `</details>
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
                        ticket.classList.remove('hidden');
                    }
                    
                });
            });
        });
    });
    
    function minimizar(index) {
        const ticket = document.querySelector(`.ticket[data-index="${index}"]`);
        if (ticket) {
            ticket.classList.add('hidden');
        }
    }
    window.minimizar = minimizar;//Hacerlo visible
    
    function cerrarCuenta(index){
        const venta = tickets[index];
        registrarVenta(venta);
        
    }
    window.cerrarCuenta = cerrarCuenta;

///////////////////Inventarios////////////////////
menuInventarios.addEventListener('click',()=>{
    console.log('hola');
    contenido.innerHTML = '';
    const contenedorNuevo = document.createElement('div');
    // contenedorNuevo.id = 'contenedorInventarios';
    contenedorNuevo.innerHTML = formulario;
    contenido.appendChild(contenedorNuevo);
    tabla();
    const btnAgregar = document.getElementById('btnAgregarProducto');
    btnAgregar.addEventListener('click', agregarProducto);
    const contenedorEditar= document.createElement('div');
    btnEditarProductos(contenedorEditar);
    
    contenido.appendChild(contenedorEditar);
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
