'use strict';

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Evitar el envío predeterminado del formulario

    // Obtener los valores del formulario
    const username = document.querySelector('input[name="username"]').value;
    const password = document.querySelector('input[name="password"]').value;

    // Crear un objeto de datos para enviar al servidor
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    // Enviar los datos al servidor usando fetch
    fetch("../src/php/login.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log("Respuesta del servidor:", data);
        if (data === "success") {
            window.location.href = "../menu.html";
        } else {
            // Mostrar mensaje de error
            document.getElementById("error-message").textContent = "Usuario o contraseña incorrectos.";
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("error-message").textContent = "Ocurrió un error. Inténtalo de nuevo.";
    });
});

console.log('hola mundoo');
