<?php
$usuario_correcto = "admin";
$contrasena_correcta = "12345";

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username === $usuario_correcto && $password === $contrasena_correcta) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    echo "No se recibieron los datos.";
}
?>
