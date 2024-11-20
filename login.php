<?php
// login.php

// Simulación de una base de datos de usuarios
$usuarios = [
    "usuario1" => "contraseña1",
    "usuario2" => "contraseña2"
];

// Obtener los datos enviados por POST
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Verificar si las credenciales son correctas
if (isset($usuarios[$username]) && $usuarios[$username] === $password) {
    echo "success";  // Si el login es correcto
} else {
    echo "Usuario o contraseña incorrectos";  // Si el login falla
}
?>
