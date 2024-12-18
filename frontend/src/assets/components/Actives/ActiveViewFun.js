import { useState, useCallback } from "react";
import ApiService from "../../Services/ApiMetodos.js";

export const useVistaActivo = () => {
  const [form, setForm] = useState({ procesoCompra: "" });

  const nameChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  

  const cargarActivos = useCallback(async (id,nameSelect) => {
    try {
      if (nameSelect==="procesoCompra") {
        const activos = await ApiService.buscarDatos("busActProceso", id);
      return activos;
      }if (nameSelect==="tipoActivo") {
        const activos = await ApiService.buscarDatos("busActTipoBien", id);
      return activos;
      }if (nameSelect==="estado") {
        const activos = await ApiService.buscarDatos("busActEstado", id);
      return activos;
      }if (nameSelect==="ubicacion") {
        const activos = await ApiService.buscarDatos("busActUbicacion", id);
        return activos;
      }if (nameSelect==="serie") {
        const activos = await ApiService.buscarDatos("busActSerie", id);
        return activos;
      }
      
    } catch (error) {
      console.error("Error al cargar los activos:", error);
      throw error;
    }
  }, []);
  
  const cargarTodosActivos = useCallback(() => ApiService.traerDatos("activosTotales"), []);
  const cargarProcesosCompra = useCallback(() => ApiService.traerDatos("procompras"), []);
  const cargarTipoActivo = useCallback(() => ApiService.traerDatos("tipobien"), []);
  const cargarUbicacion = useCallback(() => ApiService.traerDatos("ubicacion"), []);
  const cargarEstado = useCallback(() => ApiService.traerDatos("estado"), []);

  return {
    form,
    setForm,
    nameChange,
    cargarProcesosCompra,
    cargarTipoActivo,
    cargarUbicacion,
    cargarEstado,
    cargarActivos,
    cargarTodosActivos,

  };
};
