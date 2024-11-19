<?php
session_start();

$user = '123';
$contrasenia = '123';

if (isset($_POST['username']) && isset($_POST['password'])) {
    $usuario = $_POST['username'];
    $contra = $_POST['password'];

    if ($usuario == $user && $contra == $contrasenia) {
        $_SESSION['usuario'] = $usuario;
        include "..//proyecto-tacos/menu.html";
        exit;
    } else {
        include "..//proyecto-tacos/menu.html";
        exit;
    }
} else {
    header("Location: ../../index.html");
    exit;
}
?>
