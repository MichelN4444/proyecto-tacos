<?php
header('Access-Control-Allow-Origin: *');  

$usuarios = [
    "123" => "123",
    "usuario2" => "contraseña2"
];

// Obtener los datos enviados por POST
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';
// Verificar si las credenciales son correctas
if (isset($usuarios[$username]) && $usuarios[$username] === $password) {
    setcookie("isLoggedIn", "true", time() + 10, "/"); 
    echo "success";
} else {
    echo "Usuario o contraseña incorrectos"; 
}
?>
