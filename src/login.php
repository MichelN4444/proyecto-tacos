<?php
$usuario_correcto = "123";
$contrasena_correcta = "123";

if (isset($_POST['username']) && isset($_POST['password'])) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if ($username == $usuario_correcto && $password == $contrasena_correcta) {
        echo "success";
    } else {
        echo "error";
    }
} else {
    echo "No se recibieron los datos.";
}
?>
