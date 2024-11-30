const botonLogin = document.getElementById('botonLogin');
botonLogin.addEventListener('click',(e)=>{
    e.preventDefault();
    login();
})

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log("Username:", username);  // Verificar si los valores están correctos
    console.log("Password:", password);

    if (username === "" || password === "") {
        Swal.fire("Llena todos los campos")
        return
    }

    // Datos a enviar
    const datos = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    console.log('datos enviados: '+datos);
    peticionAjax("POST", "http://localhost:82/proyecto-tacos/src/login.php", document.getElementById("error-message"), datos);
}

const peticionAjax = (metodo, recurso, dom, datos) => {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
        console.log("Estado de la petición: ", this.readyState, " | Código de estado: ", this.status);
        if (this.readyState == 4) {
            if (this.status == 200) {
                respuestaAjax(this, dom);
            } else {
                console.log("Hubo un error al realizar la petición. Intenta nuevamente.")
            }
        }
    };
    ajax.open('POST', recurso, true);

    if (metodo === "POST") {
        ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        ajax.send(datos);
    } else {
        ajax.send();
    }
}

function respuestaAjax(ajax, dom) {
    let response = ajax.responseText.trim();
    console.log(response);
    if (response == "admin") {
        Swal.fire({
            icon: "success",
            title: "Iniciando sesión como adminstrador",
        });
        sessionStorage.setItem("isLoggedIn", "true");

        setTimeout(function() {
            window.location.replace("http://localhost:82/proyecto-tacos/menu.html");
        }, 2000);
    } else if(response == 'usuario') {
        Swal.fire({
            icon: "success",
            title: "Iniciando sesión",
        });
        sessionStorage.setItem("isLoggedIn", "true");

        setTimeout(() => {
            window.location.replace("http://localhost:82/proyecto-tacos/menu.html");
        }, 2000);
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o contraseña incorrectos",
        });
    }
}