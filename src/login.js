const botonLogin = document.getElementById('botonLogin');
botonLogin.addEventListener('click',()=>{
    login();
})

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
    console.log("Datos a enviar: ", datos);
    
    
    peticionAjax("POST", "http://localhost/clase2/proyecto-tacos/src/login.php", document.getElementById("error-message"), datos);
}

const peticionAjax = (metodo, recurso, dom, datos) => {
    console.log("Método: ", metodo);
    console.log("Recurso: ", recurso);
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        console.log("Estado de la petición: ", this.readyState, " | Código de estado: ", this.status);
        if (this.readyState == 4) {
            if (this.status == 200) {
                respuestaAjax(this, dom);
            } else {
                dom.innerText = "Hubo un error al realizar la petición. Intenta nuevamente.";
            }
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
    console.log('Respuesta del servidor:', response);

    if (response == "success") {
        sessionStorage.setItem("isLoggedIn", "true");
        window.location.replace("menu.html");
        window.location.replace("http://localhost/clase2/proyecto-tacos/menu.html");
    } else {
        dom.innerText = response;
    }
}