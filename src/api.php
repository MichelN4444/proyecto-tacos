<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conexion.php'; // Colocar link de conexion

$action = $_GET['action'] ?? null; // Detecta la acción

if (!$action) {
    echo json_encode(['error' => 'No action provided']);
    exit;
}

switch ($action) {
    case 'obtenerProductos':
        getProducts();
        break;
    case 'cargarProductos':
        cargarProductos();
        break;
    case 'insertarProductos':
        insertarProductos();
        break;
    case 'updateInventory':
        updateInventory();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

// Función para obtener productos
function obtenerProductos() {
    global $conn;
    $query = "SELECT * FROM productos";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $productos = [];
        while ($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
        echo json_encode($productos);
    } else {
        echo json_encode([]);
    }
}

function cargarProductos(){
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
}

function insertarProductos(){
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
}

/* Función para generar un reporte de ventas
function obtenerReporteVentas() {
    global $conn;
    $query = "SELECT producto, SUM(cantidad) as total_vendido FROM ventas GROUP BY producto";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $report = [];
        while ($row = $result->fetch_assoc()) {
            $report[] = $row;
        }
        echo json_encode($report);
    } else {
        echo json_encode([]);
    }
}
*/

/* Función para actualizar el inventario
function updateInventory() {
    global $conn;
    $data = json_decode(file_get_contents("php://input"), true);
    
    foreach ($data as $item) {
        $id = $conn->real_escape_string($item['id']);
        $cantidad = $conn->real_escape_string($item['cantidad']);
        $query = "UPDATE inventario SET cantidad = '$cantidad' WHERE id = '$id'";
        $conn->query($query);
    }

    echo json_encode(['success' => true]);
}
*/
?>
