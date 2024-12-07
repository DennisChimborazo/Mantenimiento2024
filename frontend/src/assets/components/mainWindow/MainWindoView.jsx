import React, { useEffect, useState } from "react";
import "./MainWindowsBodyStyles.css";
import { MainContainer, Sidebar, SidebarList, SidebarItem, SidebarLink, Content, ContentTitle, ContentText } from "./MainWindoStyles";
import MainWindoFun from "./MainWindoFun";
import { useTokenVerification } from "../../Services/TokenVerification.js"; // Importa el hook
import { useNavigate } from "react-router-dom";

const MainWindoView = () => {
  const [activeView, setActiveView] = useState(null);
  const checkTokenAndRedirect = useTokenVerification(); // Usa el hook
  const navigate = useNavigate();

  useEffect(() => {
    const tokenValid = checkTokenAndRedirect(); // Verifica el token al montar
    if (!tokenValid) {
      navigate("/"); // Redirige al login si no es válido
    }
  }, [checkTokenAndRedirect, navigate]);

  return (
    <MainContainer>
      <Sidebar>
        <SidebarList>
          <SidebarItem>
            <SidebarLink
              href="#"
              onClick={() => setActiveView("activo")}
              className={activeView === "activo" ? "active" : ""}>
              Activos
            </SidebarLink>
          </SidebarItem>
          <SidebarItem>
            <SidebarLink href="#" onClick={() => setActiveView("procesoCompra")}>
              Procesos de compra
            </SidebarLink>
          </SidebarItem>
          <SidebarItem>
            <SidebarLink href="#" onClick={() => setActiveView("mantenimiento")}>
              Mantenimientos
            </SidebarLink>
          </SidebarItem>
          <SidebarItem>
            <SidebarLink href="#" onClick={() => setActiveView("reportes")}>
              Reportes
            </SidebarLink>
          </SidebarItem>
          <SidebarItem>
            <SidebarLink href="#" onClick={() => setActiveView("cerrarsecion")}>
              Cerrar Sesión
            </SidebarLink>
          </SidebarItem>
        </SidebarList>
      </Sidebar>
      <Content>
        {activeView === null && (
          <>
            <ContentTitle>Bienvenido a la vista principal</ContentTitle>
            <ContentText>
              Aquí puedes gestionar los activos, mantenimientos y reportes.
            </ContentText>
          </>
        )}
        <MainWindoFun activeView={activeView} setActiveView={setActiveView} />
      </Content>
    </MainContainer>
  );
};

export default MainWindoView;
