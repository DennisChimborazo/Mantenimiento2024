<?php
class Mantenimiento{
    public static function guardarMantemiento(){
        $data = json_decode(file_get_contents('php://input'), true);
        $proceso = $data['proMant'];
        $fechaInicio = $data['fInicio'];
        $fechaFinal = "S/N";
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
        $sql="SELECT m.idManten, m.codManten, m.fechaInico, m.fechaFin, e.nomEstado,m.tipo,
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
            $sqlSelect = "SELECT md.idmanAct,md.idEstado,a.idActivo,a.idCompra,a.serieAct,a.codigoBarraAct,a.marcaAct,a.modeloAct,a.colorAct,u.nomUbic
                            FROM manten_activ md
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
        try {
            $sqlSelect = "SELECT tipoMD, idReferencia
                            FROM mantenientodetalle 
                            WHERE idmanAct = :manten";
            $conn = Conexion::getInstance()->getConnection();
            $result = $conn->prepare($sqlSelect);
            $result->bindParam(':manten', $idman, PDO::PARAM_INT);
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
            $sqlSelect = "SELECT  a.idCompra,a.serieAct, GROUP_CONCAT(CASE WHEN md.tipoMD = 'act' THEN act.nomActi END SEPARATOR ', ') AS actividad, GROUP_CONCAT(CASE WHEN md.tipoMD = 'com' THEN c.nomCompo END SEPARATOR ', ') AS componente, MAX(CASE WHEN md.tipoMD = 'obs' THEN o.campObvs END) AS observacion 
                            FROM manten_activ ma 
                            INNER JOIN mantenientodetalle md ON ma.idmanAct=md.idmanAct
                            INNER JOIN activo a ON a.idActivo = ma.idActivo
                            LEFT JOIN actividad act ON act.idActi = md.idReferencia AND md.tipoMD = 'act' 
                            LEFT JOIN componente c ON c.idCompo = md.idReferencia AND md.tipoMD = 'com' 
                            LEFT JOIN observacion o ON o.idObvs = md.idReferencia AND md.tipoMD = 'obs' 
                            WHERE ma.idManten = :manten GROUP BY a.serieAct, a.idCompra";
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
        $idMan=$data["idManAct"];
        if ($obs!=null) {
           $idObs= self::guardarObservacion($obs,$idMan);
            $datosFinales = "('" . $idMan . "','obs','" . $idObs . "'), " . $recopilacion;

        }else {
            $datosFinales=$recopilacion;
        }
        
        $sql ="INSERT INTO mantenientodetalle (	idmanAct , tipoMD, idReferencia) VALUES ".$datosFinales;
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        self::actualizarEstadoactivo($idMan);

    }
    static function guardarObservacion($obs,$idMan){

        $sql ="INSERT INTO observacion (campObvs,idmanAct) VALUES (:obs, :id)";
         $conn = Conexion::getInstance()->getConnection();
         $stmt = $conn->prepare($sql);
         $stmt->execute([':obs' => $obs,':id' => $idMan,]);
         $lastId = $conn->lastInsertId();
        return $lastId;
    }
    public static function actualizarEstado() {
        $data = json_decode(file_get_contents('php://input'), true);
        $id = $data["idManten"];
        $estado = $data["estado"];
        $fecha = $data["fecha"];

        $sql="UPDATE manteniento SET idEstado = :est,fechaFin = :fFin WHERE idManten = :id";
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute([':est' => $estado,':fFin' => $fecha,':id' => $id,]);
    }
    public static function borrarDatosManten() {
        $data = json_decode(file_get_contents('php://input'), true);
        $idMan = $data["idManten"]; 
        $edit = $data["edit"];

        $conn = Conexion::getInstance()->getConnection();
        try {
            $conn->beginTransaction();
            self::borrarMantenimientoDetalle($conn, $idMan);
            self::borrarObservacion($conn, $idMan);
            if ($edit!="si") {
            self::borrarMantenActiv($conn, $idMan);
            }
            $conn->commit();
            return json_encode(["success" => true]);
        } catch (Exception $e) {
            $conn->rollBack();
            return json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    static function borrarObservacion($conn, $idMan) {
        $sqldel = "DELETE FROM observacion WHERE idmanAct = :id";
        $pre = $conn->prepare($sqldel);
        $pre->execute([':id' => $idMan]);
    }
    
    static function borrarMantenActiv($conn, $idMan) {
        $sqldel = "DELETE FROM manten_activ WHERE idmanAct = :id";
        $pre = $conn->prepare($sqldel);
        $pre->execute([':id' => $idMan]);
    }
    
    static function borrarMantenimientoDetalle($conn, $idMan) {
        $sql = "DELETE FROM mantenientodetalle WHERE idmanAct = :id";
        $pre = $conn->prepare($sql);
        $pre->execute([':id' => $idMan]);
    }
    

    public static function actuInfMantemiento() {
        $data = json_decode(file_get_contents('php://input'), true);
    
        $id = $data['idManten'];
        $proceso = $data['proMant'];
        $fechaInicio = $data['fInicio'];
        $tipo = $data['tipo'];
        $idrespons = $data['responsable'];
    
        $conn = Conexion::getInstance()->getConnection();
    
        try {
            $query = "UPDATE manteniento 
                      SET codManten = :codMan, 
                          fechaInico = :fInc, 
                          tipo = :tip, 
                          idRespons = :res 
                      WHERE idManten = :id";
            $stmt = $conn->prepare($query);
            $stmt->execute([
                ':id' => $id,
                ':codMan' => $proceso,
                ':fInc' => $fechaInicio,
                ':tip' => $tipo,
                ':res' => $idrespons
            ]);
    
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Registro actualizado correctamente']);
            } else {
                echo json_encode(['success' => false, 'message' => 'No se encontró el registro o no hubo cambios']);
            }
        } catch (PDOException $e) {
            http_response_code(500); // Error interno del servidor
            echo json_encode(['success' => false, 'message' => 'Error al actualizar el registro: ' . $e->getMessage()]);
        }
    }

    public static function actualizarEstadoactivo($id) {
        $sql="UPDATE manten_activ SET idEstado = '4'  WHERE idmanAct = :id";
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute([':id' => $id,]);
    }
///////////////////////// Refractorizacion 
    public static function guardarMantenActiv(){
        $data = json_decode(file_get_contents('php://input'), true);
        $formEnv = $data['formEnv'];
        $sql = "INSERT INTO manten_activ (idManten, idActivo,idEstado) VALUES ".$formEnv;
        $conn = Conexion::getInstance()->getConnection();
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        return json_encode(true);
        }
    }

?>
