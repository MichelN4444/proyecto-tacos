import * as Swal from 'sweetalert2';


document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'usuario' && password === 'contraseña') {
        window.location.href = 'menu.html';
    } else {
        Swal.fire('Error','Usuario o contraseña incorrectos','error');
    }
});
