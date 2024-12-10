<?php 
include_once "connectionDB.php";

class BuscarDatos {
    public static function buscarBienes($idTipoBien) {
        try {
            $sqlSelect = "SELECT * FROM bien WHERE idtipBien = :idTipoBien";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':idTipoBien', $idTipoBien, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
}
?>
