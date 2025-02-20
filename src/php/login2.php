<?php
header('Access-Control-Allow-Origin: *');  
require_once 'conexion.php'; // Incluye el archivo de conexión

// Obtener datos del formulario
$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

// Consultar si el usuario existe
$sql = "SELECT username, password_u, role FROM usuarios WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // Verificar contraseña encriptada
    if ($password === $user['password_u']) {
        if ($user['role'] == 'admin') {
            setcookie("login", "true", time() + (7 * 24 * 60 * 60), "/");// Una semana
            echo "admin";
        }else if ($user['role'] == 'user') {
            setcookie("login", "true", time() + (24 * 60 * 60), "/"); // Cookie de sesión válida por 1 día
            echo "user";
        }
    } else {
        echo "Usuario o contraseña incorrectos";
    }
} else {
    echo "Usuario o contraseña incorrectos";
}
// Cerrar la conexión
$stmt->close();
$conn->close();
?>
