<?php
class Mantenimiento{
    public static function guardarMantemiento(){
        $data = json_decode(file_get_contents('php://input'), true);
        $proceso = $data['proMant'];
        $fechaInicio = $data['fInicio'];
        $fechaFinal = $data['fFinal'];
        $tipo = $data['tipo'];
        $idrespons = $data['responsable'];
        $estado="3"; 
        //echo ("Datos rebidos en el backend ".$proceso." ".$fechaInicio." ".$fechaFinal." ".$tipo." ".$idrespons." ".$estado." ");
        $conn = Conexion::getInstance()->getConnection();

       try {
            $query = "INSERT INTO manteniento 
            (codManten, fechaInico, fechaFin, idEstado, tipo, idRespons) 
            VALUES (:codManten, :fechaInico, :fechaFin, :idEstado, :tipo, :idRespons)";
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':codManten' => $proceso,
                ':fechaInico' => $fechaInicio,
                ':fechaFin' => $fechaFinal,
                ':idEstado' => $estado,
                ':tipo' => $tipo,
                ':idRespons' => $idrespons,]);
            echo json_encode(['success' => true, 'message' => 'Proceso de compra guardado']);
        } catch (PDOException $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode(['success' => false, 'message' => 'Error al guardar el proceso de compra: ' . $e->getMessage()]);
        }
    }
    public static function cargarMantenimientos(){
        $sql="SELECT m.idManten, m.codManten, m.fechaInico, m.fechaFin, e.nomEstado,
                    CASE 
                        WHEN m.tipo = 'ex' THEN p.nomProveedor
                        WHEN m.tipo = 'in' THEN per.nomPers
                    END AS nombreResponsable
                FROM 
                    manteniento m
                INNER JOIN 
                    estado e ON e.idEstado = m.idEstado
                LEFT JOIN 
                    proveedor p ON m.idRespons = p.idProveedor AND m.tipo = 'ex'
                LEFT JOIN 
                    persona per ON m.idRespons = per.idPers AND m.tipo = 'in'";
          $conn = Conexion::getInstance()->getConnection();
          $result=$conn->prepare($sql);
          $result->execute();
          $data= $result->fetchAll(PDO::FETCH_ASSOC);
          $dataJson=json_encode($data);
          echo ($dataJson); 
    }
}


?>