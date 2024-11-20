const menuVentas = document.getElementById('ventas');
const menuInventarios = document.getElementById('inventario');
const menuReportes = document.getElementById('reportes');
const contenido = document.getElementById('contenido');

menuVentas.addEventListener('click',()=>{
    const plantilla = `
    <button class="mesa" id='mesa1' style="left: 260px; top: 100px;"><img src="./img/mesa.png"></button>
        <button class="mesa" id='mesa2' style="left: 380px; top: 200px;"><img src="./img/mesa.png"></button>
        <button class="mesa" id='mesa3' style="left: 440px; top: 300px;"><img src="./img/mesa.png"></button>
        <button class="mesa" id ='mesa4' style="left: 480px; top: 400px;"><img src="./img/mesa.png"></button>
        <div>
            <button class="guardar-btn" onclick="guardarPosiciones()">Guardar Posiciones</button>
        </div>
    `;
    contenido.innerHTML = plantilla ;

    const mesa1 = document.getElementById('mesa1');
    mesa1.addEventListener('click',()=>{
        console.log('mesa1');
    })
})


menuInventarios.addEventListener('click',()=>{
    const plantilla = `<h1>Hola</h1>`;
    console.log('pl');
    contenido.innerHTML = plantilla;
})

document.querySelectorAll('.mesa').forEach(mesa => {
    mesa.addEventListener('mousedown', function(e) {
        let shiftX = e.clientX - mesa.getBoundingClientRect().left;
        let shiftY = e.clientY - mesa.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            mesa.style.left = pageX - shiftX + 'px';
            mesa.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // Mover la mesa al hacer clic
        document.addEventListener('mousemove', onMouseMove);

        // Soltar la mesa y quitar los eventos
        mesa.addEventListener('mouseup', function() {
            document.removeEventListener('mousemove', onMouseMove);
        });

        // Evitar que la mesa se arrastre en Firefox
        mesa.ondragstart = function() {
            return false;
        };
    });
});

// Función para guardar las posiciones de las mesas en localStorage
function guardarPosiciones() {
    let posiciones = {};
    document.querySelectorAll('.mesa').forEach(mesa => {
        posiciones[mesa.id] = {
            left: mesa.style.left,
            top: mesa.style.top
        };
    });
    localStorage.setItem('posicionesMesas', JSON.stringify(posiciones));
    alert('Posiciones guardadas');
}

// Función para cargar las posiciones de las mesas desde localStorage
function cargarPosiciones() {
    let posiciones = JSON.parse(localStorage.getItem('posicionesMesas'));
    if (posiciones) {
        for (let id in posiciones) {
            let mesa = document.getElementById(id);
            if (mesa) {
                mesa.style.left = posiciones[id].left;
                mesa.style.top = posiciones[id].top;
            }
        }
    }
}

// Cargar las posiciones al cargar la página
window.onload = cargarPosiciones;

