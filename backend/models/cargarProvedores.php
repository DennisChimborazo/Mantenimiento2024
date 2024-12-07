<?php
include_once "connectionDB.php";
class Proovedores{
    public static function cargarProveedor(){
        header('Content-Type: application/json');

        $sqlSelect = "SELECT * FROM proveedor";
        $conn = Conexion::getInstance()->getConnection();
        $result=$conn->prepare($sqlSelect);
        $result->execute();
        $data= $result->fetchAll(PDO::FETCH_ASSOC);
        $dataJson=json_encode($data);
        echo ($dataJson); 
    }
}
?>
