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
    public static function buscActPorCompra($compra) {
        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN procesocompra pc ON pc.idCompra = a.idCompra
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE pc.idCompra = :compras";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':compras', $compra, PDO::PARAM_STR);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function buscActTipoBien($tipoBien) {
        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            INNER JOIN tipobien tb ON b.idtipBien=tb.idtipBien
                            WHERE tb.idtipBien= :tipobn";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':tipobn', $tipoBien, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscActUbicacion($idUbicacion) {
        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE u.idUbic= :ubi";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':ubi', $idUbicacion, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscActEstado($idEstado) {
        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE e.idEstado = :est";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':est', $idEstado, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
        
    }
    public static function buscActSerie($idSerie) {
        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct,a.codigoBarraAct,b.nombien,a.marcaAct,
                                a.modeloAct,a.colorAct,p.nomPers,u.nomUbic,e.nomEstado
                            FROM activo a
                            INNER JOIN bien b ON b.idbien=a.idbien
                            INNER JOIN persona p ON p.idPers=a.idPers
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            INNER JOIN estado e ON e.idEstado =a.idEstado
                            WHERE a.serieAct = :serie";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':serie', $idSerie, PDO::PARAM_STR);
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
