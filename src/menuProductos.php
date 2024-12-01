<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Conexión a la base de datos
$servername = "localhost";
$username_db = "root";
$password_db = "admin";
$dbname = "taqueria";

$conn = new mysqli($servername, $username_db, $password_db, $dbname);
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}

// Obtener datos del formulario
$nombre = $_POST['nombre'] ?? '';
$precio = $_POST['precio'] ?? 0;
$categoria = $_POST['categoria'] ?? '';

// Validar datos
if (empty($nombre) || empty($precio) || empty($categoria)) {
    echo "Por favor, completa todos los campos obligatorios.";
    exit;
}

// Insertar el producto en la base de datos
$sql = "INSERT INTO productos (nombre, precio, categoria) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sds", $nombre, $precio, $categoria);

if ($stmt->execute()) {
    echo "Producto agregado exitosamente.";
} else {
    echo "Error al agregar el producto: " . $conn->error;
}

$stmt->close();
$conn->close();
?>