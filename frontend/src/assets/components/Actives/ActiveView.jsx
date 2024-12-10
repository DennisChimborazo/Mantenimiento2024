import React, { useState, useEffect } from "react";
import "./ActiveViewStyles.css";
import ActiveCreateView from "./ActiveCreateView";

function ActiveView() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="active-form-container">
      <h2 className="form-title">Gestión de Activos</h2>
      <form className="active-form" action="" method="get">
        <div className="filter-section">
          <div className="filter-group">
            <label htmlFor="activo">Activo</label>
            <select id="activo" className="filter-select">
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="proveedor">Proveedor</label>
            <select id="proveedor" className="filter-select">
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="procesoCompra">Proceso Compra</label>
            <select id="procesoCompra" className="filter-select">
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="ubicacion">Ubicación</label>
            <select id="ubicacion" className="filter-select">
              <option value="">Opción 1</option>
              <option value="">Opción 2</option>
            </select>
          </div>
        </div>

        <div className="actions-section">
          <label htmlFor="name-input">Ingrese el nombre</label>
          <input
            id="name-input"
            type="text"
            placeholder="Nombre del activo"
            className="text-input"
          />
          <div className="action-buttons">
            <button type="submit" className="primary-button">Buscar</button>
            <button type="button" className="secondary-button" onClick={handleOpenModal}>Agregar Activo</button>
            <button type="button" className="secondary-button">Agregar por Lotes</button>
          </div>
        </div>

        <table className="active-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Estado</th>
              <th>Ubicación</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Activo 1</td>
              <td>Tipo A</td>
              <td>Disponible</td>
              <td>Ubicación X</td>
              <td>
                <button className="table-button">Editar</button>
                <button className="table-button">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
       {/* Modal: Mostramos el componente NuevaProcCompra como una ventana emergente */}
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
