const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
const menuReportes = document.getElementById('reportes');
const contenido = document.getElementById('contenido');
const tickets = {};//Objeto vacio para almacenar tickets

//////////////////Crreacion dinamica de las mesas/////////////////////
menuVentas.addEventListener('click',()=>{
    contenido.innerHTML = ''
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
    const mesas = document.querySelectorAll('.mesa');

    mesas.forEach((mesa, i) => {
        mesa.addEventListener('click',()=>{
            if (!tickets[i]) {//Si no existe; es decir como no tenemos nada guardado
                tickets[i] = {};
                const ticket = document.createElement('div');
                ticket.classList.add('ticket');
                //El data del form ahora no sirve para nada
                ticket.innerHTML = `<h2>Orden de mesa ${i+1}</h2>
                <form data-index="${i}">
                    <details>
                        <summary>Tacos</summary>
                        <label>Pastor</label>
                        <input type="number" name="pastor" value="${tickets[i].pastor || 0}"><br>
                        <label>Suadero</label>
                        <input type="number" name="suadero" value="${tickets[i].suadero || 0}"><br>
                        <label>Campechanos</label>
                        <input type="number" name="campechanos" value="${tickets[i].campechanos || 0}"><br>
                    </details>
                    <details>
                        <summary>Bebidas</summary>
                        <label>Jamaica</label>
                        <input type="number" name="jamaica" value="${tickets[i].jamaica || 0}"><br>
                        <label>Horchata</label>
                        <input type="number" name="horchata" value="${tickets[i].horchata || 0}"><br>
                        <label>Limon</label>
                        <input type="number" name="limon" value="${tickets[i].limon || 0}"><br>
                    </details>
                    <details>
                        <summary>Postres</summary>
                        <label>Cheesecake</label>
                        <input type="number" name="cheesecake" value="${tickets[i].cheesecake || 0}"><br>
                        <label>Flan</label>
                        <input type="number" name="flan" value="${tickets[i].flan || 0}"><br>
                        <label>Fresas</label>
                        <input type="number" name="fresas" value="${tickets[i].fresas || 0}"><br>
                    </details>
                    <input type="button" value="Minimizar" onclick="minimizar(${i})">
                    <input type="button" value="Cerrar cuenta" onclick="cerrarCuenta(${i})">
                </form>
                `;

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
                contenido.appendChild(ticket)
            }else{//Si ya existe
                //Los [] permiten buscar elementos por atributos
                const ticket = document.querySelector(`.ticket[data-index="${i}"]`);
                ticket.classList.toggle('hidden'); //añade o remueve .toggle
            }
        });
    });
})
function minimizar(index){
    const ticket = document.querySelector(`.ticket[data-index="${index}"]`);
    if (ticket) {
        ticket.classList.add('hidden');
    }
}

function cerrarCuenta(index){
    const ticket = tickets[index];
    console.log(ticket);
    //Logica para cerrar la cuenta y generar un ticket
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

