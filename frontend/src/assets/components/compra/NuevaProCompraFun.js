import ApiService from "../../Services/ApiMetodos.js"; // Asegúrate de que la URL esté correcta

export const cargarProveedores = async () => {
        const data = await ApiService.traerDatos("proovedor");
        return data;
};

export const guardarProcesoCompra = async (form) => {
    try {
        const resultado = await ApiService.enviarDatos("proccompra", form);
        if (resultado) {
          console.log("Proceso de compra guardado con éxito:", resultado);
        } else {
          console.log("Hubo un problema al guardar el proceso de compra.");
        }
      } catch (error) {
        console.error("Error al guardar el proceso de compra:", error);
      }
    
    };