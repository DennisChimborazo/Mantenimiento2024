<?php 
include_once "connectionDB.php";

class TraerDatos {
    private static $conn;
    public static function init() {
        self::$conn = Conexion::getInstance()->getConnection();
    }

    public static function cargarProcesoCompra() {
        $sqlSelect = "SELECT * FROM procesoCompra";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }
          
    public static function cargarTipoBien() {
        $sqlSelect = "SELECT * FROM tipoBien";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }

    public static function cargarBien() {
        $sqlSelect = "SELECT * FROM bien";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }

    public static function cargarProveedor() {
        $sqlSelect = "SELECT * FROM proveedor";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }

    public static function cargarUbicacion() {
        $sqlSelect = "SELECT * FROM ubicacion";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }

    public static function cargarPersona() {
        $sqlSelect = "SELECT * FROM persona";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }

    public static function cargarEstado() {
        $sqlSelect = "SELECT * FROM estado";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }
    public static function cargarActivos() {
        $sqlSelect = "SELECT a.idActivo,a.idCompra,a.serieAct,a.marcaAct,a.modeloAct,
                            a.colorAct,a.codigoBarraAct,
                            a.idbien,tp.idtipBien,u.nomUbic,b.nombien
                        FROM activo a 
                        INNER JOIN ubicacion u ON u.idUbic=a.idUbic
                        INNER JOIN bien b ON b.idbien=a.idbien
                        INNER JOIN tipobien tp ON tp.idtipBien =b.idtipBien";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }
    public static function cargarComponen() {
        $sqlSelect = "SELECT * FROM componente";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }
    public static function cargarActividades() {
        $sqlSelect = "SELECT * FROM actividad";
        $stmt = self::$conn->prepare($sqlSelect); // Usar self::$conn en lugar de $conn
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($data); 
    }
}

TraerDatos::init();
?>
