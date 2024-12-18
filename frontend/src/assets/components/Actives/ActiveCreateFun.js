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
    // Validar que todos los campos del formulario tengan valores
    const validarFormulario = (form) => {
      const camposRequeridos = [
        "procesoCompra",
        "tipoBien",
        "bien",
        "serie",
        "marca",
        "modelo",
        "color",
        "codigoBarra",
        "responsable",
        "estado",
        "ubicacion",
      ];
  
      for (const campo of camposRequeridos) {
        if (!form[campo] || form[campo].trim() === "") {
          return `Todos los campos son obligatorio.`;
        }
      }
  
      return null; 
    };
  
    const error = validarFormulario(form);
  
    if (error) {
      mostrarMensaje({
        title: "Campos faltantes",
        text: error,
        icon: "info",
        timer: 3500,
      });
      return; // Detener la ejecución
    }
  
    try {
      await ApiService.enviarDatos("nuevoActivo", form);
      mostrarMensaje({
        title: "Éxito",
        text: "Se ha creado un nuevo activo",
        icon: "success",
        timer: 3500,
      });
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.error("Error al guardar:", error);
      mostrarMensaje({
        title: "Error",
        text: "Hubo un problema al guardar el activo. Por favor, inténtalo nuevamente.",
        icon: "error",
        timer: 3500,
      });
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
