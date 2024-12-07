import styled from "styled-components";

// Estilos para la vista principal
export const MainContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Arial", sans-serif;
`;

export const Sidebar = styled.nav`
  width: 250px;
  background-color: #343a40;
  color: #fff;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

export const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const SidebarItem = styled.li`
  margin: 15px 0;
`;

export const SidebarLink = styled.a`
  text-decoration: none;
  color: #fff;
  font-size: 16px;
  padding: 10px 20px;
  display: block;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #495057;
  }

  &.active {
    background-color: #495057;
  }
`;

export const Content = styled.section`
  flex: 1;
  padding: 40px;
  background-color: #f4f4f9;
  color: #333;
`;

export const ContentTitle = styled.h2`
  font-size: 24px;
  color: #343a40;
`;

export const ContentText = styled.p`
  font-size: 16px;
  line-height: 1.6;
  margin-top: 10px;
`;
