import { useState } from "react";
import ApiService from "../../Services/ApiMetodos.js";

export const useGuardarActivo = () => {
  const [form, setForm] = useState({
    tipoBien: "",
    bien: "",
  });

  const nameChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cargarBienesPorTipo = async (idTipoBien) => {
    try {
      // Verificar que idTipoBien es válido antes de hacer la solicitud
      if (!idTipoBien) {
        throw new Error("El idTipoBien no es válido.");
      }

      const bienes = await ApiService.buscarDatos("busBines",idTipoBien);
      return bienes;
    } catch (error) {
      console.error("Error al cargar bienes:", error);
      return []; // Retorna un arreglo vacío en caso de error
    }
  };

  const cargarTipoBiem = async () => {
    try {
      return await ApiService.traerDatos("tipobien");
    } catch (error) {
      console.error("Error al cargar tipos de bienes:", error);
      throw error;
    }
  };

  return {
    form,
    setForm,
    nameChange,
    cargarTipoBiem,
    cargarBienesPorTipo,
  };
};
