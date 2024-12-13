import { useState } from "react";
import ApiService from "../../Services/ApiMetodos.js";
import mostrarMensaje from "../Mensajes/Mensaje.js";

export const useGuardarActivo = () => {
  const [form, setForm] = useState({
    procesoCompra: "",
    tipoBien: "",
    bien: "",
    serie: "",
    marca: "",
    modelo: "",
    color: "",
    codigoBarra: "",
    responsable: "",
    estado: "",
    ubicacion: "",
  });

  const nameChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const cargarBienesPorTipo = async (idTipoBien) => {
    try {
      const bienes = await ApiService.buscarDatos("busBines",idTipoBien);
      return bienes;
    } catch (error) {
      console.error("Error al cargar bienes:", error);
      throw error;
    }
  };

  const cargarProcesosCompra = async () => ApiService.traerDatos("procompras");
  const cargarTipoBiem = async () => ApiService.traerDatos("tipobien");
  const cargarUbicacion = async () => ApiService.traerDatos("ubicacion");
  const cargarResponsable = async () => ApiService.traerDatos("responsable");
  const cargarEstado = async () => ApiService.traerDatos("estado");

  const actionButtonGuardar = async (form, onClose) => {
    try {
      await ApiService.enviarDatos("nuevoActivo", form);
      mostrarMensaje({
        title: "Exito",
        text:"Se ha creado un nuevo activo",
        icon: "success",
        timer:"3500",
      });
      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  return {
    form,
    setForm, // Asegúrate de exportar setForm
    nameChange,
    actionButtonGuardar,
    cargarProcesosCompra,
    cargarTipoBiem,
    cargarBienesPorTipo,
    cargarUbicacion,
    cargarResponsable,
    cargarEstado,
  };
};
