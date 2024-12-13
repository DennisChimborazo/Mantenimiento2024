import React, { useEffect } from "react";
import { useTokenVerification } from "../../Services/TokenVerification"; // Importa el hook
import ProcesoCompraView from "../compra/ProcesoCompraView";
import ActiveView from "../Actives/ActiveView";
import ActivoEditarVista from "../Actives/ActivoEditarVista";

const VentanaPrincipalFun = ({ activeView, setActiveView }) => {
  const checkTokenAndRedirect = useTokenVerification(); // Usa el hook

  useEffect(() => {
    checkTokenAndRedirect(); // Verifica el token al cargar el componente
  }, [activeView, checkTokenAndRedirect]);

  useEffect(() => {
    if (activeView === "cerrarsecion") {
      localStorage.removeItem("authToken"); // Elimina el token
      setActiveView(null);
    }
  }, [activeView, setActiveView]);

  return (
    <section className="content">
      {activeView === "activo" && <ActiveView />}
      {activeView === "procesoCompra" && <ProcesoCompraView />}
      {activeView === "reportes" && <ActivoEditarVista />}

    </section>
  );
};

export default VentanaPrincipalFun;
