function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Validamos que los campos no estén vacíos
    if (username === "" || password === "") {
        document.getElementById("error-message").innerText = "Por favor, complete todos los campos.";
        return;
    }

    // Datos a enviar
    const datos = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);

    // Llamada a la función AJAX
    peticionAjax("POST", "../login.php", document.getElementById("error-message"), datos);
}
const peticionAjax = (metodo, recurso, dom, datos) => {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function(){
        if (this.readyState == 4 && this.status == 200) {
            respuestaAjax(this, dom);
        }
    };
    ajax.open(metodo, recurso, true);

    if (metodo === "POST") {
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.send(datos);
    } else {
        ajax.send();
    }
}

function respuestaAjax(ajax, dom) {
    // Procesar la respuesta del servidor
    let response = ajax.responseText.trim();

    if (response === "success") {
        // Redirigir si el login es exitoso
        window.location.href = "dashboard.html"; // Cambia esto por el nombre de tu página de destino
    } else {
        // Mostrar mensaje de error si el login falla
        dom.innerText = response; // El mensaje de error viene de login.php
    }
}
