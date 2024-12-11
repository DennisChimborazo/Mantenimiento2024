import React, { useState, useEffect } from "react";
import NuevaProcCompra from "./NuevaProcCompra"; // Importamos el componente del modal
import { cargarProcesosCompra } from "./ProcesoCompraFun"; // Importar servicio para cargar procesos
import styles from "./ProcesosCompraEstilos.module.css"; // Estilos específicos del componente

function ProcesoCompraView() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal
  const [procesos, setProcesos] = useState([]); // Estado para almacenar los procesos de compra

  useEffect(() => {
    // Cargar procesos al montar el componente
    const obtenerProcesos = async () => {
      try {
        const procesosData = await cargarProcesosCompra();
        setProcesos(procesosData); // Guardamos los procesos en el estado
      } catch (error) {
        console.error("Error al cargar los procesos de compra:", error);
      }
    };
    obtenerProcesos();
  }, []); // El arreglo vacío asegura que esto solo se ejecute al montar el componente

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.ProcesoCompra}>
      <h3>Procesos de compra</h3>
      <button onClick={handleOpenModal}>Nuevo Proceso de compra</button>
      <table className={styles["active-table"]}>
        <thead>
          <tr>
            <th>Proceso</th>
            <th>Fecha</th>
            <th>Proveedor</th>
            <th>Total de Activos</th>
          </tr>
        </thead>
        <tbody>
          {procesos.length > 0 ? (
            procesos.map((proceso) => (
              <tr key={proceso.idCompra}>
                <td>{proceso.idCompra}</td>
                <td>{proceso.fechaCompra}</td>
                <td>{proceso.nomProveedor}</td>
                <td>{proceso.TotalActivos}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No hay procesos de compra disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal: Mostramos el componente NuevaProcCompra como una ventana emergente */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <NuevaProcCompra onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProcesoCompraView;
