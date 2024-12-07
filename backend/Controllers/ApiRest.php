<?php
// Configurar encabezados CORS
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambia según tu frontend
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Si es una solicitud OPTIONS, responde con un código 204 (sin contenido)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

// Incluye los modelos necesarios
include_once '../models/Login.php'; // Para el login
include_once '../models/cargarProvedores.php';
include_once '../models/compras.php'; // Para cargar los proveedores
include_once '../models/authMiddleware.php'; // Middleware para verificar JWT

// Detectar el método HTTP de la solicitud
$opc = $_SERVER['REQUEST_METHOD'];

switch ($opc) {
    case 'GET':
        // Ruta protegida que requiere token
       $decodedToken = verifyToken(); // Verificamos el token

        if (isset($_GET['proovedor'])) {
            Proovedores::cargarProveedor(); // Llamar la función para cargar los proveedores
        } elseif (isset($_GET['todocompras'])) {
            Compra::cargarCompra(); 

        }
        break;

    case 'POST':
        // Ruta para el login, no requiere token
        if (isset($_GET['login'])) {
        Login::login(); 
        }else {
             $decodedToken = verifyToken(); // Verificamos el token
            if ((isset($_GET['proccompra']))) {
            Compra::nuevoProcesoCompra(); 
                
            }

        }

        // Aquí se maneja el login y la creación del token
        break;

    default:
        http_response_code(405); // Método no permitido
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}
?>
