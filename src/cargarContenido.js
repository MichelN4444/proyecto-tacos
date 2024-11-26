const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
const menuReportes = document.getElementById('reportes');
const contenido = document.getElementById('contenido');
const ticket = document.createElement('div');

menuVentas.addEventListener('click',()=>{
    contenido.innerHTML = ''
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

    const mesas = document.querySelectorAll('.mesa');
    console.log(mesas);
    mesas.forEach(mesa => {
        mesa.addEventListener('click',()=>{
            ticket.classList.add('ticket');
            ticket.innerHTML = `<h2>Orden</h2>
            <form>
                <label>Tacos</label><br>
                <label>Pastor</label>
                <input type="number"><br>
                <label>Suadero</label>
                <input type="number"><br>
                <label>Campechanos</label>
                <input type="number"><br>
                <label>Tacos</label><br>
                <label>Pastor</label>
                <input type="number"><br>
                <label>Suadero</label>
                <input type="number"><br>
                <label>Campechanos</label>
                <input type="number"><br>
                <label>Tacos</label><br>
                <label>Pastor</label>
                <input type="number"><br>
                <label>Suadero</label>
                <input type="number"><br>
                <label>Campechanos</label>
                <input type="number"><br>
                <input type="button" value="Minimizar" onclick="minimizar()">
                <input type='button' value="Cerrar cuenta">
            </form>`;
            contenido.appendChild(ticket);
        });
    });
})
function minimizar(){
    ticket.classList.add('menu-ticket')
    ticket.classList.remove('ticket')
}


menuInventarios.addEventListener('click',()=>{
    contenido.innerHTML = ''
    const plantilla = `<h1>Hola</h1>`;
    const contenedorNuevo = document.createElement('div');
    contenedorNuevo.innerHTML = plantilla;
    contenido.appendChild(contenedorNuevo);
})

function cerrarSesion(){
    document.cookie = "login=true;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("./index.html");  
}

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

