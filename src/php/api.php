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
    case 'obtenerProductosId':
        obtenerProductosId();
        break;
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
    case 'registrarCategoria':
        registrarCategoria();
        break;
    case 'obtenerCategorias':
        obtenerCategorias();
        break;
    case 'cargarVentas':
        cargarVentas();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function obtenerProductos(){
    global $conn;
    
    // Realizamos el JOIN con la tabla categorias
    $query = "SELECT productos.id, productos.nombre, productos.precio, productos.creado_en, categorias.nombre AS categoria_nombre
            FROM productos
            INNER JOIN categorias ON productos.categoria_id = categorias.id";

    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $productos = [];
        while ($row = $result->fetch_assoc()) {
            $productos[] = [
                'id' => $row['id'],
                'nombre' => $row['nombre'],
                'precio' => $row['precio'],
                'creado_en' => $row['creado_en'],
                'categoria' => $row['categoria_nombre']  // Aquí agregamos el nombre de la categoria
            ];
        }
        echo json_encode($productos);
    } else {
        echo json_encode([]);
    }
}


function cargarProductos(){
    global $conn;
    $sql = "SELECT 
    p.nombre AS producto_nombre, 
    c.nombre AS categoria_nombre, 
    p.precio, 
    p.id 
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id";

    $result = $conn->query($sql);

    $productos = [];
    if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
    $productos[] = $row;
    }
    }

    // Devolvemos los datos en formato JSON
    echo json_encode($productos);

    $conn->close();
}

function insertarProductos(){
    global $conn;
    $nombre = $_POST['nombre'] ?? '';
    $precio = $_POST['precio'] ?? 0;
    $categoria_id = $_POST['categoria_id'] ?? '';

    if (empty($nombre) || empty($precio) || empty($categoria_id)) {
        echo "Por favor, completa todos los campos obligatorios.";
            exit;
    }

    $sql = "INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sds", $nombre, $precio, $categoria_id);

    if ($stmt->execute()) {
        echo "Producto agregado exitosamente.";
    } else {
        echo "Error al agregar el producto: " . $conn->error;
    }

    $stmt->close();
    $conn->close();                
}

function editarProductos() {
    $data = json_decode(file_get_contents("php://input"), true);
    if ($data) {
        global $conn;
        $errores = [];
        $exitos = [];

        foreach ($data as $id => $producto) {
            foreach ($producto as $campo => $valor) {
                // Procesar la categoría
                if ($campo == 'categoria') {
                    $nombreCategoria = $valor;

                    // Buscar el ID de la categoría en la base de datos
                    $sqlCategoria = "SELECT id FROM categorias WHERE nombre = ?";
                    $stmtCategoria = $conn->prepare($sqlCategoria);
                    $stmtCategoria->bind_param("s", $nombreCategoria);
                    $stmtCategoria->execute();
                    $resultCategoria = $stmtCategoria->get_result();

                    if ($resultCategoria->num_rows > 0) {
                        $categoria = $resultCategoria->fetch_assoc();
                        $categoria_id = $categoria['id'];
                        $campo = 'categoria_id';
                        $valor = $categoria_id;
                    } else {
                        $errores[] = "Categoría '$nombreCategoria' no encontrada para producto ID $id.";
                        continue; // Saltar a la siguiente iteración
                    }
                }

                // Construir la consulta para actualizar el campo
                $sql = "UPDATE productos SET $campo = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);

                // Configurar los tipos de datos según el campo
                if ($campo == 'precio') {
                    $stmt->bind_param("di", $valor, $id);
                } elseif ($campo == 'nombre' || $campo == 'categoria_id') {
                    $stmt->bind_param("si", $valor, $id);
                } else {
                    $errores[] = "Campo '$campo' no reconocido para producto ID $id.";
                    continue;
                }

                // Ejecutar la consulta
                if ($stmt->execute()) {
                    $exitos[] = "Producto ID $id actualizado correctamente (campo '$campo').";
                } else {
                    $errores[] = "Error al actualizar el campo '$campo' para producto ID $id.";
                }
            }
        }

        // Respuesta final
        echo json_encode([
            'success' => $exitos,
            'errors' => $errores
        ]);
    } else {
        echo json_encode(['error' => 'Datos no válidos']);
    }
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


function registrarCategoria(){
    global $conn;
    $json = file_get_contents('php://input');
    $dato = json_decode($json, true);

    try{
        $consulta = $conn -> prepare("INSERT INTO categorias (nombre) VALUES (?)");//se prepara
        $consulta -> bind_param("s", $dato['nombre']);//lo inserta en ?
        if ($consulta ->execute()) {
            echo json_encode(['success' => "Categoria registrada"]);
        }else{
            throw new Exception("Error al registrar");
        }
    } catch (Exception $e){
        echo json_encode(['error'=> $e->getMessage()]);
    }
    $consulta->close();
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

function obtenerCategorias(){
    global $conn;
    $consulta = "SELECT * FROM categorias";
    $resultado = $conn -> query($consulta);
    if ($resultado->num_rows>0) {
        $categorias = [];
        while($row = $resultado->fetch_assoc()){ //fecth recorre todas las filas
            $categorias[] = ['id' => $row['id'], 'nombre' => $row['nombre']];
        }
        echo json_encode($categorias);
    }else{
        echo json_encode([]);
    }
}

function cargarVentas() {
    global $conn;
    $sql = "SELECT producto_id, cantidad, precio, fecha_venta, venta_id FROM ventas";
    $result = $conn->query($sql);

    $ventas = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $ventas[] = $row;
        }
    }

    echo json_encode($ventas);
    $conn->close();
}

function obtenerProductosId() {
    global $conn;

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!isset($data['id_producto']) || !is_numeric($data['id_producto'])) {
        echo json_encode(['error' => 'ID de producto inválido']);
        return;
    }

    $id_producto = $data['id_producto'];

    try {
        // Cambiar el marcador de posición a ?
        $stmt = $conn->prepare("
            SELECT p.nombre 
            FROM productos p
            WHERE p.id = ?
        ");

        // Usar bind_param para enlazar el parámetro
        $stmt->bind_param('i', $id_producto); // 'i' indica que es un entero

        $stmt->execute();

        // Obtener el resultado de la consulta
        $result = $stmt->get_result();
        $producto = $result->fetch_assoc();

        // Responder con el producto o un error si no se encuentra
        if ($producto) {
            echo json_encode(['producto' => $producto['nombre']]);
        } else {
            echo json_encode(['error' => 'Producto no encontrado']);
        }
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['error' => 'Error en la consulta: ' . $e->getMessage()]);
    }
}


?>
