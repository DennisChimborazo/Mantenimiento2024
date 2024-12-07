<?php
include_once "connectionDB.php";
class LoadActives{
    public static function loadActives(){
        $sqlSelect = "SELECT * FROM activos";
        $conn = Conexion::getInstance()->getConnection();
        $result=$conn->prepare($sqlSelect);
        $result->execute();
        $data= $result->fetchAll(PDO::FETCH_ASSOC);
        $dataJson=json_encode($data);
        echo ($dataJson); 
    }
}
?>
