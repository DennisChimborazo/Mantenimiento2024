import React, { useEffect } from "react";
import ActiveView from "../Actives/ActiveView";
import ActiveCreateView from "../Actives/ActiveCreateView";
import { useTokenVerification } from "../../Services/TokenVerification"; // Importa el hook
import ProcesoCompraView from "../compra/ProcesoCompraView";

const MainWindoFun = ({ activeView, setActiveView }) => {
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
      {activeView === "mantenimiento" && <ActiveCreateView />}
      {activeView === "procesoCompra" && <ProcesoCompraView />}
    </section>
  );
};

export default MainWindoFun;
