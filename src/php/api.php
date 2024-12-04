<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'conexion.php';

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
    case 'registrarVenta':
        registrarVenta();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

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
    $sql = "SELECT nombre, categoria, precio, id FROM productos";
    $result = $conn->query($sql);

    $productos = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $productos[] = $row;
        }
    }

    echo json_encode($productos);

    $conn->close();
}

function insertarProductos(){
    global $conn;
    $nombre = $_POST['nombre'] ?? '';
    $precio = $_POST['precio'] ?? 0;
    $categoria = $_POST['categoria'] ?? '';

    if (empty($nombre) || empty($precio) || empty($categoria)) {
        echo "Por favor, completa todos los campos obligatorios.";
            exit;
    }

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
            $campo = strtok($key, '_'); 
            $valor = $value;

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

function registrarVenta() {
    global $conn;
    
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if ($data === null) {
        echo json_encode(['error' => 'JSON mal formado']);
        exit;
    }
    
    // Obtener el último `venta_id` insertado
    $consulta = $conn->prepare("SELECT MAX(venta_id) AS max_venta_id FROM ventas");
    $consulta->execute();
    $resultado = $consulta->get_result();
    $row = $resultado->fetch_assoc();

    $venta_id = $row['max_venta_id'] ? $row['max_venta_id'] + 1 : 1;
    
    // Iniciar una transacción para asegurar la consistencia
    $conn->begin_transaction();

    try {
        $consulta = $conn->prepare("INSERT INTO ventas (producto_id, cantidad, precio, venta_id) VALUES (?, ?, ?, ?)");

        foreach ($data as $venta) {
            $producto_id = $venta['producto_id'];
            $cantidad = $venta['cantidad'];
            $precio = $venta['precio'];
            
            $consulta->bind_param("iiid", $producto_id, $cantidad, $precio, $venta_id);
            if (!$consulta->execute()) {
                throw new Exception("Error al insertar la venta para el producto_id: " . $producto_id);
            }
        }

        $conn->commit();
        echo json_encode(['success' => 'Ventas registradas correctamente']);
    } catch (Exception $e) {

        $conn->rollback();
        echo json_encode(['error' => $e->getMessage()]);
    }
    
    $consulta->close();
    $conn->close();
}
?>
