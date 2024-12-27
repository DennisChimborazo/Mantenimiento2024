import React, { useEffect,useState } from "react";
import { useTokenVerification } from "../../Services/TokenVerification"; // Importa el hook
import ProcesoCompraView from "../compra/ProcesoCompraView";
import ActiveView from "../Actives/ActiveView";
import ReporteVista from "../Reporte/ReporteVista";
import MantenVista from "../Manten/MantenVista";
import CrearManten from "../Manten/CrearManten";
import MantenDetalle from "../Manten/MantenDetalle";


const VentanaPrincipalFun = ({ activeView, setActiveView }) => {
  const checkTokenAndRedirect = useTokenVerification(); // Usa el hook
  const [selectedMantenimiento, setSelectedMantenimiento] = useState(null);


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
      {activeView === "mantenimiento" && (<MantenVista setActiveView={setActiveView} />)}
      {activeView === "crearMantenimiento" && (<CrearManten setActiveView={setActiveView} setSelectedMantenimiento={setSelectedMantenimiento}/>)}
      {activeView === "detalleMantenimiento" && (<MantenDetalle setActiveView={setActiveView} mantenimiento={selectedMantenimiento}/>)}
    </section>
  );
};

export default VentanaPrincipalFun;
