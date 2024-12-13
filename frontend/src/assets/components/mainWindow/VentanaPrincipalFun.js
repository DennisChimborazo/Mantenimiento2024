import React, { useEffect } from "react";
import { useTokenVerification } from "../../Services/TokenVerification"; // Importa el hook
import ProcesoCompraView from "../compra/ProcesoCompraView";
import ActiveView from "../Actives/ActiveView";
import ReporteVista from "../Reporte/ReporteVista";
import MantenVista from "../Manten/MantenVista";

const VentanaPrincipalFun = ({ activeView, setActiveView }) => {
  const checkTokenAndRedirect = useTokenVerification(); // Usa el hook

  useEffect(() => {
    if (activeView === "cerrarsecion") {
      setActiveView(null);
      localStorage.removeItem("authToken"); // Elimina el token
    }
  }, [activeView, setActiveView]);

  useEffect(() => {
    checkTokenAndRedirect(); // Verifica el token al cargar el componente
  }, [activeView, checkTokenAndRedirect]);

  return (
    <section className="content">
      {activeView === "activo" && <ActiveView />}
      {activeView === "procesoCompra" && <ProcesoCompraView />}
      {activeView === "reportes" && <ReporteVista />}
      {activeView === "mantenimiento" && <MantenVista />}
    </section>
  );
};

export default VentanaPrincipalFun;
