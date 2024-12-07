import axios from "axios";
import { apiUrl } from "./ApiRest.js"; // Asegúrate de que apiUrl esté correctamente configurado

class ApiService {
  static async traerDatos(getApi) {
    try {
      const token = localStorage.getItem("authToken"); // Obtener el token del localStorage
      if (!token) {
        throw new Error("No se encontró un token. Por favor, inicia sesión.");
      }

      const response = await axios.get(apiUrl + `?${getApi}=true`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión.");
      }

      return response.data; 
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      throw error;
    }
  }

  static async enviarDatos(postApi, form) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("No estás autenticado. Por favor, inicia sesión.");
        return;
      }

      const response = await axios.post(
        apiUrl + `?${postApi}=true`, // Dynamic endpoint (postApi)
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar token de autenticación
            "Content-Type": "application/json", // Especificar el tipo de contenido
          },
        }
      );

      console.log("Respuesta del servidor:", response.data);
      return response.data; // Retornamos los datos de la respuesta para su uso posterior
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      alert("Error al guardar los datos. Revisa los datos y vuelve a intentar.");
      return null; // Retorna null en caso de error
    }
  }
}

export default ApiService;
