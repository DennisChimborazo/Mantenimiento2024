import ApiService from "../../Services/ApiMetodos.js"; // Asegúrate de que la URL esté correcta
// Función para cargar procesos de compra
export const cargarProcesosCompra = async () => {
    const data = await ApiService.traerDatos("procompras");
    return data;
};
