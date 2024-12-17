// // Variables
// const boton = document.getElementById('boton');
// const opciones = document.getElementById('opciones');
// const periodoSelector = document.getElementById('periodo-selector');

// // Mostrar/ocultar opciones del dropdown
// boton.addEventListener('click', () => {
//     opciones.classList.toggle('show');
// });

// // Función para actualizar el selector de periodo
// function actualizarSelector(periodo) {
//     let html = '';
//     if (periodo === 'diario') {
//         html = `
//             <label for="dia">Seleccionar día:</label>
//             <input type="date" id="dia">
//         `;
//     } else if (periodo === 'semanal') {
//         html = `
//             <label for="semana">Seleccionar semana:</label>
//             <input type="week" id="semana">
//         `;
//     } else if (periodo === 'mensual') {
//         html = `
//             <label for="mes">Seleccionar mes:</label>
//             <input type="month" id="mes">
//         `;
//     }
//     periodoSelector.innerHTML = html;
// }

// document.getElementById('diario').addEventListener('click', () => {
//     document.getElementById('boton-text').textContent = 'Diario';
    
//     actualizarSelector('diario');
//     opciones.classList.remove('show');  // Ocultar el dropdown
// });

// document.getElementById('semanal').addEventListener('click', () => {
//     document.getElementById('boton-text').textContent = 'Semanal';
//     actualizarSelector('semanal');
//     opciones.classList.remove('show');  // Ocultar el dropdown
// });

// document.getElementById('mensual').addEventListener('click', () => {
//     document.getElementById('boton-text').textContent = 'Mensual';
//     actualizarSelector('mensual');
//     opciones.classList.remove('show');  // Ocultar el dropdown
// });

// export const darFecha = () => {
//     const dia = document.getElementById('dia');
//     const mes = document.getElementById('mes');
//     const semana = document.getElementById('semana');
//     console.log(dia);
// }