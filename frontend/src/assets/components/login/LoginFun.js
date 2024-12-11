import { useState } from "react";
import axios from "axios";
//import Cookies from "js-cookie"; // Importar js-cookie
import { apiUrl } from "../../Services/ApiRest.js"; // Asegúrate de que la URL esté correcta
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [form, setForm] = useState({ username: "", pass: "" });
  const [error, setError] = useState(false);
  const [smserror, setSmserror] = useState("");
  const navigate = useNavigate();

  const nameChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const actionButtonLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiUrl+"?login=true", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Respuesta del servidor:", response.data);

      if (response.data.success) {
        const token = response.data.token;
        if (token) {
          localStorage.setItem("authToken", token); 
        
        navigate("/main"); // Redirigir al usuario a la página principal
        } else {
          console.error("No se recibió un token válido.");
        }
      } else {
        console.error("Error de autenticación:", response.data.message);
        setError(true);
        setSmserror(response.data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      const errorMessage =
        error.response?.data?.message || "Ocurrió un error inesperado.";
      setError(true);
      setSmserror(errorMessage);
    }
  };

  return { form, nameChange, actionButtonLogin, error, smserror };
};
