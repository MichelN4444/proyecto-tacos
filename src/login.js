
//Hola
const botonLogin = document.getElementById('botonLogin');
botonLogin.addEventListener('click',()=>{
    login();
})

function login() {
    console.log('logueado');
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username === "" || password === "") {
        Swal.fire("Llena todos los campos")
        return
    }
// hola
    // Datos a enviar
    const datos = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
<<<<<<< HEAD
    peticionAjax("POST", "http://localhost/php/proyecto-tacos/src/login.php", document.getElementById("error-message"), datos);
=======
    peticionAjax("POST", "http://localhost:82/proyecto-tacos/src/login.php", document.getElementById("error-message"), datos);
>>>>>>> b5f2851879592366f1b56f14146c52acc9c8da3f
}

const peticionAjax = (metodo, recurso, dom, datos) => {
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

    let response = ajax.responseText.trim();
    if (response == "admin") {
        Swal.fire({
            icon: "success",
            title: "Iniciando sesión",
        });
        sessionStorage.setItem("isLoggedIn", "true");

        setTimeout(function() {
<<<<<<< HEAD
            window.location.replace("http://localhost/php/proyecto-tacos/menu.html");
=======
            window.location.replace("http://localhost:82/proyecto-tacos/menu.html");
>>>>>>> b5f2851879592366f1b56f14146c52acc9c8da3f
        }, 2000);
    } else if(response == 'usuario') {
        console.log('usuario');
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o contraseña incorrectos",
        });
    }
}