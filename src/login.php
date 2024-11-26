<?php
header('Access-Control-Allow-Origin: *');  

$admin = [
    "123" => "123",
];
$usuario = [
    "usuario2" => "contraseña2"
];

$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

if (isset($admin[$username]) && $admin[$username] === $password) {
    setcookie("login", "true", time() + 3600, "/"); 
    echo "admin";
} else if (isset($usuario[$username]) && $usuario[$username] === $password) {
        setcookie("login", "true", time() + 3600, "/"); 
        echo "usuario";
}else{
        echo "Usuario o contraseña incorrectos"; 
}

?>
