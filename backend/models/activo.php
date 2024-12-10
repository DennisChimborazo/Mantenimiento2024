<?php 
include_once "connectionDB.php";

class Activo {
    public static function nuevoActivo() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!isset($data['procesoCompra']) || !isset($data['bien']) || !isset($data['serie'])||
        !isset($data['marca']) || !isset($data['modelo']) || !isset($data['color'])||
        !isset($data['codigoBarra']) || !isset($data['responsable']) || !isset($data['estado'])|| !isset($data['ubicacion'])) {
       
            http_response_code(400); // Solicitud incorrecta
            echo json_encode(['success' => false, 'message' => 'Faltan datos en la solicitud']);
            return;
        }
        $serie = $data['serie'];
        $marca = $data['marca'];
        $modelo = $data['modelo'];
        $color = $data['color'];
        $codBarras = $data['codigoBarra'];
        $idCompra = $data['procesoCompra'];
        $idUbic = $data['ubicacion'];
        $idPers = $data['responsable'];
        $idbien = $data['bien'];
        $idEstado = $data['estado'];
    //    echo "Serie: $serie\nMarca: $marca\nModelo: $modelo\nColor: $color\nCódigo de Barras: $codBarras\n" .
   // "Proceso de Compra: $idCompra\nUbicación: $idUbic\nResponsable: $idPers\nBien: $idbien\nEstado: $idEstado\n";


        if (empty($serie) || empty($marca) || empty($modelo)||
            empty($color) || empty($codBarras) || empty($idCompra)||
            empty($idUbic) || empty($idPers) || empty($idbien)||empty($idEstado)) {
            http_response_code(400); // Solicitud incorrecta
            echo json_encode(['success' => false, 'message' => 'Los campos no pueden estar vacíos']);
            return;
        }
        try {
            $query = "INSERT INTO activo
                     (serieAct, marcaAct, modeloAct,colorAct,codigoBarraAct,idCompra,idUbic,idPers,idbien,idEstado)
                      VALUES (:serie, :marca, :modelo, :color, :codBarras,:idCompra, :idUbic, :idPers, :idbien, :idEstado )";
            $conn = Conexion::getInstance()->getConnection();
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':serie' => $serie,
                ':marca' => $marca,
                ':modelo' => $modelo,
                ':color' => $color,
                ':codBarras' => $codBarras,
                ':idCompra' => $idCompra,
                ':idUbic' => $idUbic,
                ':idPers' => $idPers,
                ':idbien' => $idbien,
                ':idEstado' => $idEstado,
            ]);
            echo json_encode(['success' => true, 'message' => 'Proceso de compra guardado']);
        } catch (PDOException $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode(['success' => false, 'message' => 'Error al guardar el proceso de compra: ' . $e->getMessage()]);
        }
            
    }
}

?>
