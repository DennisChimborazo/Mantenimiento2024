import React, { useState, useEffect } from "react";
import modalStyles from "./NuevoProcesoCompraEstilos.module.css";
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
    <div className={modalStyles.modalGlobal}>
      <div className={modalStyles.NuevoProcesoComp}>
        <form className={modalStyles.form} onSubmit={handleSubmit}>
          <h3 className={modalStyles.formTitle}>Agregar Nuevo Proceso</h3>

          <div className={modalStyles.formGroup}>
            <label htmlFor="proceso" className={modalStyles.formLabel}>
              Proceso de Compra
            </label>
            <input
              type="text"
              name="proceso"
              id="proceso"
              className={modalStyles.formInput}
              placeholder="Ej: COM-001"
              required
              onChange={nameChange}
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label htmlFor="fecha" className={modalStyles.formLabel}>
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              id="fecha"
              className={modalStyles.formInput}
              required
              onChange={nameChange}
            />
          </div>

          <div className={modalStyles.formGroup}>
            <label htmlFor="proveedor" className={modalStyles.formLabel}>
              Proveedor
            </label>
            {isLoading ? (
              <p>Cargando proveedores...</p> // Mensaje mientras carga
            ) : (
              <select
                name="proveedor"
                id="proveedor"
                className={modalStyles.formSelect}
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

          <br />
          <div className={modalStyles.formActions}>
            <button type="submit" className={`${modalStyles.btn} ${modalStyles.btnPrimary}`}>
              Guardar
            </button>
            <button
              type="button"
              className={`${modalStyles.btn} ${modalStyles.btnSecondary}`}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NuevaProcCompra;
