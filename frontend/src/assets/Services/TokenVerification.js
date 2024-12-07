import { useNavigate } from "react-router-dom";
import { jwtDecode as jwt_decode } from 'jwt-decode';


export const useTokenVerification = () => {
  const navigate = useNavigate();

  const checkTokenAndRedirect = () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No se encontró un token.");
      navigate("/"); // Redirige al login si no hay token
      return false;
    }

    try {
      const decoded = jwt_decode(token);

      if (decoded.exp * 1000 < Date.now()) {
        console.error("El token ha expirado.");
        localStorage.removeItem("authToken"); // Limpia el token expirado
        navigate("/"); // Redirige al login
        return false;
      }

      return true; // El token es válido
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      localStorage.removeItem("authToken"); // Limpia cualquier token corrupto
      navigate("/"); // Redirige al login
      return false;
    }
  };

  return checkTokenAndRedirect;
};
