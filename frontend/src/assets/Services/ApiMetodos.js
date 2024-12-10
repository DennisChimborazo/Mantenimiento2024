import axios from "axios";
import { apiUrl } from "./ApiRest.js"; // Asegúrate de que apiUrl esté correctamente configurado

class ApiService {

  static async traerDatos(getApi) {
    try {
      const token = localStorage.getItem("authToken"); // Obtener el token del localStorage
      if (!token) {
        throw new Error("No se encontró un token. Por favor, inicia sesión.");
      }
 console.log(apiUrl + `?${getApi}=true`);
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
        apiUrl + `?${postApi}=true`, 
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar token de autenticación
            "Content-Type": "application/json", // Especificar el tipo de contenido
          },
        }
      );

      return response.data; // Retornamos los datos de la respuesta para su uso posterior
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      return null; // Retorna null en caso de error
    }
  }

  static async buscarDatos(getApi, id) {
    try {
      const token = localStorage.getItem("authToken"); // Obtener el token del localStorage
      if (!token) {
        throw new Error("No se encontró un token. Por favor, inicia sesión.");
      }

      console.log(apiUrl + `?${getApi}=${id}`); // Aquí se construye correctamente la URL

      const response = await axios.get(apiUrl + `?${getApi}=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("No autorizado. Por favor, inicia sesión.");
      }

      return Array.isArray(response.data) ? response.data : []; // Asegurarse de que siempre sea un arreglo
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      return []; // Retornar un arreglo vacío en caso de error
    }
  }
  
}

  

export default ApiService;
