import ApiService from "../../Services/ApiMetodos.js"; // Asegúrate de que la URL esté correcta
import mostrarMensaje from "../Mensajes/Mensaje.js";

export const cargarProveedores = async () => {
        const data = await ApiService.traerDatos("proovedor");
        return data;
};

export const guardarProcesoCompra = async (form) => {
    try {
        const resultado = await ApiService.enviarDatos("proccompra", form);
        if (resultado) {
          mostrarMensaje({
            title: "Se guardo",
            text: "Se creo un nuevo proceso de compra",
            icon: "success",
            timer: 2500
          });
          console.log("Proceso de compra guardado con éxito:", resultado);
        } else {
          console.log("Hubo un problema al guardar el proceso de compra.");
        }
      } catch (error) {
        console.error("Error al guardar el proceso de compra:", error);
      }
    
    };