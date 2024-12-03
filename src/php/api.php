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
        obtenerProductos();
        break;
    case 'cargarProductos':
        cargarProductos();
        break;
    case 'insertarProductos':
        insertarProductos();
        break;
    case 'editarProductos':
        editarProductos();
        break;
    case 'eliminarProducto':
        eliminarProducto();
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
    global $conn;
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
    global $conn;
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

function editarProductos(){
    $productos = $_POST;
    foreach ($productos as $key => $value) {
        global $conn;
        // Extraer ID del nombre del campo (e.g., "nombre_1" -> ID: 1)
        preg_match('/_(\d+)$/', $key, $matches);
        if (isset($matches[1])) {
            $id = $matches[1];
            $campo = strtok($key, '_'); // Campo: nombre, precio, categoría
            $valor = $value;
        // Si el valor está vacío, no actualizamos el campo
        if (!empty($valor)) {
            $sql = "UPDATE productos SET $campo = ? WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("si", $valor, $id);
            $stmt->execute();
            }
        }
    }
    
    echo json_encode(['success' => 'Productos actualizados correctamente']);
}

function eliminarProducto() {
    global $conn;

    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode(['error' => 'ID del producto no proporcionado']);
        exit;
    }

    // Preparar la consulta para eliminar el producto
    $sql = "DELETE FROM productos WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(['success' => 'Producto eliminado correctamente']);
    } else {
        echo json_encode(['error' => 'Error al eliminar el producto']);
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
