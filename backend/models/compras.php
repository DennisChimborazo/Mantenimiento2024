<?php
include_once 'connectionDB.php';

class Compra {
    public static function nuevoProcesoCompra() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['proceso']) || !isset($data['fecha']) || !isset($data['proveedor'])) {
            http_response_code(400); // Solicitud incorrecta
            echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
            return;
        }
        $proceso = $data['proceso'];
        $fecha = $data['fecha'];
        $proveedor = $data['proveedor'];
        if (empty($proceso) || empty($fecha) || empty($proveedor)) {
            http_response_code(400); // Solicitud incorrecta
            echo json_encode(['success' => false, 'message' => 'Los campos no pueden estar vacíos']);
            return;
        }

        $conn = Conexion::getInstance()->getConnection();

        try {
            $query = "INSERT INTO procesocompra (idCompra, fechaCompra, idProveedor) VALUES (:proceso, :fecha, :proveedor)";
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':proceso' => $proceso,
                ':fecha' => $fecha,
                ':proveedor' => $proveedor,
            ]);
            echo json_encode(['success' => true, 'message' => 'Proceso de compra guardado']);
        } catch (PDOException $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode(['success' => false, 'message' => 'Error al guardar el proceso de compra: ' . $e->getMessage()]);
        }
    }
    
    public static function cargarCompra(){
        $sqlSelect = "SELECT 
                            pc.idCompra,
                            pc.fechaCompra,
                            p.nomProveedor,
                            COUNT(a.idCompra) AS TotalActivos
                        FROM  procesocompra pc
                        INNER JOIN 
                            proveedor p ON pc.idProveedor = p.idProveedor
                        LEFT JOIN 
                            activo a ON a.idCompra = pc.idCompra
                        GROUP BY 
                            pc.idCompra, pc.fechaCompra, p.nomProveedor";
        $conn = Conexion::getInstance()->getConnection();
        $result=$conn->prepare($sqlSelect);
        $result->execute();
        $data= $result->fetchAll(PDO::FETCH_ASSOC);
        $dataJson=json_encode($data);
        echo ($dataJson); 
    }
}   

?>
