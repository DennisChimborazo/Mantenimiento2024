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

                $lastId = $conn->lastInsertId();
                echo($lastId);
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

    static function buscarActivosManten($idmanten){
        try {
            $sqlSelect = "SELECT a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,a.marcaAct,a.modeloAct,a.colorAct,u.nomUbic
                            FROM mantenientodetalle md
                            INNER JOIN activo a ON md.idActivo=a.idActivo
                            INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                            WHERE md.idManten = :manten 
                            GROUP by a.idActivo";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':manten', $idmanten, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }
    static function buscarActivosMantenEditar(){
        $data = json_decode(file_get_contents('php://input'), true);
        $idman = $data['idman'];
        $idact = $data['idact'];
        try {
            $sqlSelect = "SELECT tipoMD, idReferencia
                            FROM mantenientodetalle 
                            WHERE idManten = :manten AND idActivo= :idac";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':manten', $idman, PDO::PARAM_INT);
            $result->bindParam(':idac', $idact, PDO::PARAM_INT);

            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    static function buscarHistorialManten($idmanten){
        try {
            $sqlSelect = "SELECT a.idCompra,a.serieAct, GROUP_CONCAT(CASE WHEN md.tipoMD = 'act' THEN act.nomActi END SEPARATOR ', ') AS actividad, GROUP_CONCAT(CASE WHEN md.tipoMD = 'com' THEN c.nomCompo END SEPARATOR ', ') AS componente, MAX(CASE WHEN md.tipoMD = 'obs' THEN o.campObvs END) AS observacion 
                            FROM mantenientodetalle md 
                            INNER JOIN activo a ON a.idActivo = md.idActivo 
                            LEFT JOIN actividad act ON act.idActi = md.idReferencia AND md.tipoMD = 'act' 
                            LEFT JOIN componente c ON c.idCompo = md.idReferencia AND md.tipoMD = 'com' 
                            LEFT JOIN observacion o ON o.idObvs = md.idReferencia AND md.tipoMD = 'obs' 
                            WHERE md.idManten = :manten GROUP BY a.serieAct, a.idCompra";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':manten', $idmanten, PDO::PARAM_INT);
            $result->execute();
            $data = $result->fetchAll(PDO::FETCH_ASSOC);
            $dataJson = json_encode($data);
            echo ($dataJson); 
        } catch (PDOException $e) {
            echo json_encode(["error" => $e->getMessage()]);
        }
    }

    public static function guardarDetalleManteniento(){
        $data = json_decode(file_get_contents('php://input'), true);
        $recopilacion=$data["datos"];
        $obs=$data["obs"];
        $datosFinales="";
        if ($obs!=null) {
           $idObs= self::guardarObservacion($obs);
            $idAct=$data["idAct"];
            $idMan=$data["idMan"];
            $datosFinales = "('" . $idMan . "','" . $idAct . "','obs','" . $idObs . "'), " . $recopilacion;

        }else {
            $datosFinales=$recopilacion;
        }
        
        $sql ="INSERT INTO mantenientodetalle (idManten, idActivo, tipoMD, idReferencia) VALUES ".$datosFinales;
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute();
    }
    static function guardarObservacion($obs){

        $sql ="INSERT INTO observacion (campObvs) VALUES (:obs)";
         $conn = Conexion::getInstance()->getConnection();
         $stmt = $conn->prepare($sql);
         $stmt->execute([':obs' => $obs,]);
         $lastId = $conn->lastInsertId();
        return $lastId;
    }
    public static function actualizarEstado() {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data["idManten"];
        $sql="UPDATE manteniento SET idEstado = '4' WHERE idManten = :id";
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id,]);
    }
    public static function borrarDatosManten() {
        $data = json_decode(file_get_contents('php://input'), true);
        $idMan = $data[0]["idManten"];
        $idActv = $data[0]["idAct"];
        $d=self::borrarObservacion($idMan,$idActv);
        $sql="DELETE m FROM mantenientodetalle  m WHERE m.idManten= :idMan AND m.idActivo = :idAct";
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute([':idMan' => $idMan,':idAct' => $idActv,]);
    }

    static function borrarObservacion($idMan,$idActv){
        $sql ="SELECT m.idReferencia FROM mantenientodetalle m WHERE m.idManten= :idMan AND m.idActivo= :idAct AND m.tipoMD='obs'";
         $conn = Conexion::getInstance()->getConnection();
         $stmt = $conn->prepare($sql);
        $stmt->execute([':idMan' => $idMan,':idAct' => $idActv,]);
        $result= $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($result) {
            $dato=$result[0];
            $id=$dato["idReferencia"];
            $sqldel="DELETE FROM observacion WHERE idObvs= :id";
            $pre = $conn->prepare($sqldel);
            $pre->execute([':id' =>$id]);
        }
    
    }
}
// SELECT a.serieAct,a.marcaAct,
// CASE WHEN md.tipoMD='act' THEN act.nomActi END AS actividad,
// CASE WHEN md.tipoMD='com' THEN c.nomCompo END AS componente
// FROM mantenientodetalle md
// INNER JOIN activo a on a.idActivo=md.idActivo
// LEFT JOIN actividad act ON act.idActi = md.idReferencia AND md.tipoMD='act'
// LEFT JOIN componente c ON c.idCompo = md.idReferencia AND md.tipoMD='com'
// WHERE md.idManten='2'
?>
