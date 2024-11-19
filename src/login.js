// import * as Swal from 'sweetalert2';

// document.getElementById('loginForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     const username = document.getElementById('username').value;
//     const password = document.getElementById('password').value;

//     fetch('./php/login.php', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//             username: username,a
//             password: password
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             // Usar SweetAlert para el mensaje de éxito
//             Swal.fire({
//                 title: 'Login exitoso',
//                 text: 'Redirigiendo...',
//                 icon: 'success',
//                 confirmButtonText: 'Aceptar'
//             }).then(() => {
//                 window.location.href = 'menu.html'; // Redirigir a la página de menú
//             });
//         } else {
//             // Usar SweetAlert para el mensaje de error
//             Swal.fire({
//                 title: 'Credenciales incorrectas',
//                 text: 'Por favor, verifica tu usuario y contraseña.',
//                 icon: 'error',
//                 confirmButtonText: 'Intentar de nuevo'
//             });
//         }
//     })
//     .catch(error => {
//         // Usar SweetAlert para el error de solicitud
//         Swal.fire({
//             title: 'Error',
//             text: 'Hubo un error al procesar la solicitud',
//             icon: 'error',
//             confirmButtonText: 'Aceptar'
//         });
//     });
// });
