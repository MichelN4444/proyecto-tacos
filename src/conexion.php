<?php
header('Access-Control-Allow-Origin: *');

// Configuración de la base de datos
$servername = "localhost";
$username_db = "root";
$password_db = "admin";
$dbname = "taqueria";

// Crear la conexión
$conn = new mysqli($servername, $username_db, $password_db, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(['error' => 'Error en la conexión: ' . $conn->connect_error]));
}
?>
