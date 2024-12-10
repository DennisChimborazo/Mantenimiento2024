import React, { useState, useEffect } from "react";
import "./NuevaProcCompraStyles.css";
import { cargarProveedores, guardarProcesoCompra } from "./NuevaProCompraFun.js";

function NuevaProcCompra({ onClose }) {
  const [proveedores, setProveedores] = useState([]); // Estado para los proveedores
  const [isLoading, setIsLoading] = useState(true); // Estado de carga
  const [form, setForm] = useState({
    proceso: "",
    fecha: "",
    proveedor: "",
  }); // Estado del formulario

  useEffect(() => {
    const obtenerProveedores = async () => {
      try {
        const data = await cargarProveedores(); // Llama a la función importada
        setProveedores(data); // Actualiza el estado con los datos recibidos
      } catch (error) {
        alert("Error al cargar proveedores. Por favor, inténtalo de nuevo.");
      } finally {
        setIsLoading(false); // Marca que terminó de cargar
      }
    };

    obtenerProveedores();
  }, []);

  const nameChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.proveedor === "" || form.proveedor === "Seleccione un proveedor") {
      alert("Por favor, seleccione un proveedor válido.");
      return;
    }

    try {
      await guardarProcesoCompra(form); // Llama a la función para guardar
      onClose(); // Cierra el modal después de guardar
    } catch (error) {
      console.log("Error al guardar el proceso. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h3 className="form-title">Agregar Nuevo Proceso</h3>

        <div className="form-group">
          <label htmlFor="proceso" className="form-label">
            Proceso de Compra
          </label>
          <input
            type="text"
            name="proceso"
            id="proceso"
            className="form-input"
            placeholder="Ej: COM-001"
            required
            onChange={nameChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fecha" className="form-label">
            Fecha
          </label>
          <input
            type="date"
            name="fecha"
            id="fecha"
            className="form-input"
            required
            onChange={nameChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="proveedor" className="form-label">
            Proveedor
          </label>
          {isLoading ? (
            <p>Cargando proveedores...</p> // Mensaje mientras carga
          ) : (
            <select
              name="proveedor"
              id="proveedor"
              className="form-select"
              value={form.proveedor}
              onChange={nameChange}
              required
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option
                  key={proveedor.idProveedor}
                  value={proveedor.idProveedor}
                >
                  {proveedor.nomProveedor}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Guardar
          </button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevaProcCompra;
