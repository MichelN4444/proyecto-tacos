<?php
// Conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "admin";
$dbname = "taqueria";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Consultar los productos
$sql = "SELECT nombre, categoria, precio FROM productos";
$result = $conn->query($sql);

// Almacenar los productos en un array
$productos = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }
}

// Devolver los productos como JSON
echo json_encode($productos);

$conn->close();
?>
