const botonLogin = document.getElementById('botonLogin');
botonLogin.addEventListener('click',(e)=>{
    e.preventDefault();
    login();
})
const cookies = document.cookie;
if (cookies.split("; ").some(cookie => cookie.startsWith("login="))) {
    window.location.replace("./menu.html");
} 

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === "" || password === "") {
        Swal.fire("Llena todos los campos")
        return
    }

    // Datos a enviar
    const datos = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
    peticionAjax("POST", "./src/php/login2.php", document.getElementById("error-message"), datos);
}

const peticionAjax = (metodo, recurso, dom, datos) => {
    let ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
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
    if (response == "admin") {
        Swal.fire({
            icon: "success",
            title: "Iniciando sesión como adminstrador",
        });
        sessionStorage.setItem("userRole", "admin");

        setTimeout(function() {
            window.location.replace("./menu.html");
        }, 2000);
    } else if(response == 'user') {
        Swal.fire({
            icon: "success",
            title: "Iniciando sesión como mesero",
        });
        sessionStorage.setItem("userRole", "user");

        setTimeout(() => {
            window.location.replace("./menu.html");//se creara otro
        }, 1000);
    }else{
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Usuario o contraseña incorrectos",
        });
    }
}