import React, { useState } from "react";
import ActiveCreateView from "./ActiveCreateView";
import styles from "./ActivoVistaEstilos.module.css"; // Importa los estilos específicos

function ActiveView() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.vistaActivo}>
      <h2 className={styles["form-title"]}>Gestión de Activos</h2>
      <form className={styles["active-form"]}>
        <div className={styles["filter-section"]}>

          <div className={styles["filter-group"]}>
            <label htmlFor="ProcesoCompra">Proceso de Compra</label>
            <select id="ProcesoCompra" className={styles["filter-select"]}>
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="provedor">Proveedor</label>
            <select id="provedor" className={styles["filter-select"]}>
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="activo">Activo</label>
            <select id="activo" className={styles["filter-select"]}>
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="ubicacion">ubicacion</label>
            <select id="ubicacion" className={styles["filter-select"]}>
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          
          {/* Resto de los filtros */}
        </div>

        <div className={styles["actions-section"]}>
          <label htmlFor="name-input">Ingrese el nombre</label>
          <input
            id="name-input"
            type="text"
            placeholder="Nombre del activo"
            className={styles["text-input"]}
          />
          <div className={styles["action-buttons"]}>
            <button type="submit" className={styles["primary-button"]}>Buscar</button>
            <button type="button" className={styles["secondary-button"]} onClick={handleOpenModal}>Agregar Activo</button>
            <button type="button" className={styles["secondary-button"]}>Agregar por Lotes</button>
          </div>
        </div>

        <table className={styles["active-table"]}>
          <thead>
            <tr>
              <th>Proceso de compra</th>
              <th>Serie</th>
              <th>Código de barras</th>
              <th>Activo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Color</th>
              <th>Responsable</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Activo 1</td>
              <td>Tipo A</td>
              <td>Disponible</td>
              <td>Ubicación X</td>
              <td>Activo 1</td>
              <td>Tipo A</td>
              <td>Disponible</td>
              <td>Ubicación X</td>
              <td>Disponible</td>
              <td>Disponible</td>
              <td>
                <button className={styles["table-button"]}>Editar</button> <br /><br />
                <button className={styles["table-button"]}>Historial</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">    
             <ActiveCreateView onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ActiveView;
