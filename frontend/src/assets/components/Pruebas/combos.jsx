import React, { useState, useEffect } from "react"; 
import { useGuardarActivo } from "./comboFun.js"; // Importa el hook correctamente

function Combos({ onClose }) {
  const {
    form,
    setForm,
    nameChange,
    cargarTipoBiem,
    cargarBienesPorTipo,
  } = useGuardarActivo();

  const [isLoading, setIsLoading] = useState(false);
  const [datos, setDatos] = useState({
    tipoBienes: [],
    bienes: [], // Inicializamos bienes como un arreglo vacío
  });

  // Cargar los datos iniciales
  useEffect(() => {
    const obtenerDatos = async () => {
      setIsLoading(true);
      try {
        const tipoBienes = await cargarTipoBiem();
        setDatos((prevDatos) => ({ ...prevDatos, tipoBienes }));
      } catch (error) {
        console.error("Error al cargar los tipos de bienes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    obtenerDatos();
  }, []); // Solo se ejecuta una vez al montar el componente

  // Manejar cambio de tipo de bien
  const handleTipoBienChange = async (e) => {
    e.preventDefault(); // Evitar que se recargue la página
    const selectedTipoBien = e.target.value;
    nameChange(e); // Actualizar el estado del formulario
    setForm((prevForm) => ({ ...prevForm, bien: "" })); // Resetear selección de bienes

    if (selectedTipoBien) {
      try {
        setIsLoading(true);
        const bienesCargados = await cargarBienesPorTipo(selectedTipoBien);
        setDatos((prevDatos) => ({
          ...prevDatos,
          bienes: Array.isArray(bienesCargados) ? bienesCargados : [], // Asegurarse de que bienes sea un arreglo
        }));
      } catch (error) {
        console.error("Error al cargar bienes:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setDatos((prevDatos) => ({ ...prevDatos, bienes: [] })); // Limpiar bienes si no hay selección
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Evitar recarga de página al enviar el formulario
    console.log("Formulario enviado:", form);
    onClose(); // Cerrar la vista al finalizar
  };

  const { tipoBienes, bienes } = datos;

  return (
    <div>
      {/* Formulario */}
      <form onSubmit={handleSubmit}>
        {/* Select Tipo de Bien */}
        <div className="form-group">
          <label htmlFor="tipoBien" className="form-label">Tipo de Bien</label>
          {isLoading ? (
            <p>Cargando tipos de bienes...</p>
          ) : (
            <select
              name="tipoBien"
              id="tipoBien"
              className="form-select"
              value={form.tipoBien}
              onChange={handleTipoBienChange} // Usar handleTipoBienChange para controlar cambios
              required
            >
              <option value="">Seleccione</option>
              {tipoBienes.map((tipoBien) => (
                <option key={tipoBien.idtipBien} value={tipoBien.idtipBien}>
                  {tipoBien.nomtipBien}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Select Bien */}
        <div className="form-group">
          <label htmlFor="bien" className="form-label">Bien</label>
          {isLoading ? (
            <p>Cargando bienes...</p>
          ) : (
            <select
              name="bien"
              id="bien"
              className="form-select"
              value={form.bien}
              onChange={nameChange} // Usar nameChange para cambios en el combo de bienes
              required
            >
              <option value="">Seleccione</option>
              {bienes.length > 0 ? (
                bienes.map((bien) => (
                  <option key={bien.idbien} value={bien.idbien}>
                    {bien.nombien}
                  </option>
                ))
              ) : (
                <option value="">No hay bienes disponibles</option> // Mensaje si no hay bienes
              )}
            </select>
          )}
        </div>

        {/* Botones */}
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

export default Combos;
