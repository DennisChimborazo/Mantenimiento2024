<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cambia según tu frontend
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include_once '../models/Login.php'; 
include_once '../models/cargarDatos.php';
include_once '../models/compras.php'; 
include_once '../models/activo.php'; 
include_once '../models/buscarDatos.php'; 
include_once '../models/mantenimiento.php'; 
include_once '../models/authMiddleware.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit(0);
}

$opc = $_SERVER['REQUEST_METHOD'];

switch ($opc) {
    case 'GET':

       $decodedToken = verifyToken(); // Verificamos el token

        if (isset($_GET['proovedor'])) {
            TraerDatos::cargarProveedor(); 

        }  elseif (isset($_GET['tipobien'])) {
            TraerDatos::cargarTipoBien(); 

        } elseif (isset($_GET['bien'])) {
            TraerDatos::cargarBien(); 

        } elseif (isset($_GET['ubicacion'])) {
            TraerDatos::cargarUbicacion(); 

        } elseif (isset($_GET['responsable'])) {
            TraerDatos::cargarPersona(); 

        } elseif (isset($_GET['estado'])) {
            TraerDatos::cargarEstado(); 

        }elseif (isset($_GET['componen'])) {
            TraerDatos::cargarComponen(); 

        }elseif (isset($_GET['actividad'])) {
            TraerDatos::cargarActividades(); 

        } elseif (isset($_GET['procompras'])) {
            Compra::cargarCompra(); 

        }elseif (isset($_GET['datosManten'])) {
            Mantenimiento::cargarMantenimientos();

        } elseif (isset($_GET['busBines'])) {
            $idTipoBien =  $_GET['busBines'];
            BuscarDatos::buscarBienes($idTipoBien); 

        }elseif (isset($_GET['busActProceso'])) {
            $compra =  $_GET['busActProceso'];
            BuscarDatos::buscActPorCompra($compra); 

        }elseif (isset($_GET['busActTipoBien'])) {
            $tipobn =  $_GET['busActTipoBien'];
            BuscarDatos::buscActTipoBien($tipobn); 

        }elseif (isset($_GET['busActUbicacion'])) {
            $ubi =  $_GET['busActUbicacion'];
            BuscarDatos::buscActUbicacion($ubi);

        }elseif (isset($_GET['busActEstado'])) {
            $est =  $_GET['busActEstado'];
            BuscarDatos::buscActEstado($est); 
            
        }elseif (isset($_GET['busActSerie'])) {
            $serie =  $_GET['busActSerie'];
            BuscarDatos::buscActSerie($serie); 
        }elseif (isset($_GET['activosTotales'])) {
            $serie =  $_GET['activosTotales'];
            BuscarDatos::cargarActivos($serie); 
        }
        
        break;

    case 'POST':

        if (isset($_GET['login'])) {
        Login::login(); 

        }else {
             //$decodedToken = verifyToken(); // Verificamos el token
            if (isset($_GET['proccompra'])) {
            Compra::nuevoProcesoCompra(); 
            }elseif (isset($_GET['nuevoActivo'])) {
                Activo::nuevoActivo();
            }elseif (isset($_GET['nuevoMantenimiento'])) {
                Mantenimiento::guardarMantemiento();
            }
        }
        break;

    default:
        http_response_code(405); // Método no permitido
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        break;
}
?>
