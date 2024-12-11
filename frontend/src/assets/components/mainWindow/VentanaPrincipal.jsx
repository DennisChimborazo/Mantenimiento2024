import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VentanaPrincipalEstilos.module.css";
import VentanaPrincipalFun from "./VentanaPrincipalFun.js";
import { useTokenVerification } from "../../Services/TokenVerification";

function VentanaPrincipal() {
  const [activeView, setActiveView] = useState(null); // Estado para la vista activa
  const checkTokenAndRedirect = useTokenVerification(); // Verificar token
  const navigate = useNavigate();

  // Validar token al cargar
  useEffect(() => {
    const tokenValid = checkTokenAndRedirect();
    if (!tokenValid) {
      navigate("/"); // Redirigir si no hay token válido
    }
  }, [checkTokenAndRedirect, navigate]);

  return (
    <div className={styles.VentanaPrinc}>
      <aside className={styles.Sidebar}>
        <ul className={styles.SidebarList}>
          <li className={styles.SidebarItem}>
            <a
              href="#"
              className={`${styles.SidebarLink} ${
                activeView === "activo" ? styles.active : ""
              }`}
              onClick={() => setActiveView("activo")}
            >
              Activos
            </a>
          </li>
          <li className={styles.SidebarItem}>
            <a
              href="#"
              className={styles.SidebarLink}
              onClick={() => setActiveView("procesoCompra")}
            >
              Procesos de compra
            </a>
          </li>
          <li className={styles.SidebarItem}>
            <a
              href="#"
              className={styles.SidebarLink}
              onClick={() => setActiveView("mantenimiento")}
            >
              Mantenimientos
            </a>
          </li>
          <li className={styles.SidebarItem}>
            <a
              href="#"
              className={styles.SidebarLink}
              onClick={() => setActiveView("reportes")}
            >
              Reportes
            </a>
          </li>
          <li className={styles.SidebarItem}>
            <a
              href="#"
              className={styles.SidebarLink}
              onClick={() => setActiveView("cerrarsecion")}
            >
              Cerrar Sesión
            </a>
          </li>
        </ul>
      </aside>
      <main className={styles.Content}>
        {activeView === null && (
          <>
            <h1 className={styles.ContentTitle}>
              Bienvenido a la vista principal
            </h1>
            <p className={styles.ContentText}>
              Aquí puedes gestionar los activos, mantenimientos y reportes.
            </p>
          </>
        )}
        <VentanaPrincipalFun activeView={activeView} setActiveView={setActiveView} />
      </main>
    </div>
  );
}

export default VentanaPrincipal;
