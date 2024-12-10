import { useEffect, useState } from "react";
import { useGuardarActivo } from "./ActiveCreateFun"; 
import "./ActiveCreateViewStyles.css"

const ActiveCreateView = ({ onClose }) => {
  const {
    form,
    setForm, // Asegúrate de importar setForm aquí
    nameChange,
    actionButtonGuardar,
    cargarProcesosCompra,
    cargarTipoBiem,
    cargarBienesPorTipo,
    cargarUbicacion,
    cargarResponsable,
    cargarEstado,
  } = useGuardarActivo();

  const [isLoading, setIsLoading] = useState(false);
  const [datos, setDatos] = useState({
    procesoCompras: [],
    tipoBienes: [],
    bienes: [],
    responsables: [],
    estados: [],
    ubicaciones: [],
  });

  useEffect(() => {
    const obtenerDatos = async () => {
      setIsLoading(true);
      try {
        const [
          procesoCompras,
          tipoBienes,
          responsables,
          estados,
          ubicaciones,
        ] = await Promise.all([
          cargarProcesosCompra(),
          cargarTipoBiem(),
          cargarResponsable(),
          cargarEstado(),
          cargarUbicacion(),
        ]);
        setDatos({ procesoCompras, tipoBienes, bienes: [], responsables, estados, ubicaciones });
      } catch (error) {
        console.error("Error al cargar datos:", error);
      } finally {
        setIsLoading(false);
      }
    };
    obtenerDatos();
  }, []);

  const handleTipoBienChange = async (e) => {
    const selectedTipoBien = e.target.value;
    console.log("Tipo de Bien seleccionado:", selectedTipoBien); // Para depuración
    nameChange(e);
    setForm((prevForm) => ({
      ...prevForm,
      bien: "", // Resetear selección de bienes
    }));

    if (selectedTipoBien) {
      try {
        setIsLoading(true);
        setDatos((prevDatos) => ({
          ...prevDatos,
          bienes: [], // Limpiar bienes antes de cargar
        }));
        const bienesCargados = await cargarBienesPorTipo(selectedTipoBien);
        setDatos((prevDatos) => ({
          ...prevDatos,
          bienes: bienesCargados,
        }));
      } catch (error) {
        console.error("Error al cargar bienes:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setDatos((prevDatos) => ({
        ...prevDatos,
        bienes: [], // Limpiar bienes si no hay selección
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    actionButtonGuardar(form, onClose);
  };

  const { procesoCompras, tipoBienes, bienes, responsables, estados, ubicaciones } = datos;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h3 className="modal-title">Agregar Nuevo Activo</h3>
        <form className="form" onSubmit={handleSubmit}>
          {/* Proceso de Compra */}
          <div className="form-group">
            <label htmlFor="procesoCompra" className="form-label">Proceso de Compra</label>
            {isLoading ? (
              <p>Cargando Procesos compra...</p>
            ) : (
              <select
                name="procesoCompra"
                id="procesoCompra"
                className="form-select"
                value={form.procesoCompra}
                onChange={nameChange}
                required
              >
                <option value="">Seleccione</option>
                {procesoCompras.map((procesoCompra) => (
                  <option key={procesoCompra.idCompra} value={procesoCompra.idCompra}>
                    {procesoCompra.idCompra}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tipo de Bien */}
          <div className="form-group">
            <label htmlFor="tipoBien" className="form-label">Tipo de Bien</label>
            {isLoading ? (
              <p>Cargando Tipo bien...</p>
            ) : (
              <select
                name="tipoBien"
                id="tipoBien"
                className="form-select"
                value={form.tipoBien}
                onChange={handleTipoBienChange}
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

          {/* Bien */}
          <div className="form-group">
            <label htmlFor="bien" className="form-label">Bien</label>
            {isLoading ? (
              <p>Cargando bien...</p>
            ) : (
              <select
                name="bien"
                id="bien"
                className="form-select"
                value={form.bien}
                onChange={nameChange}
                required
              >
                <option value="">Seleccione</option>
                {bienes.map((bien) => (
                  <option key={bien.idbien} value={bien.idbien}>
                    {bien.nombien}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Serie */}
          <div className="form-group">
            <label htmlFor="serie" className="form-label">Serie</label>
            <input
              type="text"
              name="serie"
              id="serie"
              className="form-input"
              placeholder="Ej: 0097987"
              value={form.serie}
              onChange={nameChange}
              required
            />
          </div>

          {/* Marca */}
          <div className="form-group">
            <label htmlFor="marca" className="form-label">Marca</label>
            <input
              type="text"
              name="marca"
              id="marca"
              className="form-input"
              placeholder="Ej: DELL"
              value={form.marca}
              onChange={nameChange}
              required
            />
          </div>

          {/* Modelo */}
          <div className="form-group">
            <label htmlFor="modelo" className="form-label">Modelo</label>
            <input
              type="text"
              name="modelo"
              id="modelo"
              className="form-input"
              placeholder="Ej: D-08"
              value={form.modelo}
              onChange={nameChange}
              required
            />
          </div>

          {/* Color */}
          <div className="form-group">
            <label htmlFor="color" className="form-label">Color</label>
            <input
              type="text"
              name="color"
              id="color"
              className="form-input"
              placeholder="Ej: Azul"
              value={form.color}
              onChange={nameChange}
              required
            />
          </div>

          {/* Código de Barras */}
          <div className="form-group">
            <label htmlFor="codigoBarra" className="form-label">Código de Barras</label>
            <input
              type="text"
              name="codigoBarra"
              id="codigoBarra"
              className="form-input"
              placeholder="Ej: 98797098"
              value={form.codigoBarra}
              onChange={nameChange}
              required
            />
          </div>

        
          {/* Responsable */}
          <div className="form-group">
            <label htmlFor="responsable" className="form-label">Responsable</label>
            {isLoading ? (
              <p>Cargando responsables...</p>
            ) : (
              <select
                name="responsable"
                id="responsable"
                className="form-select"
                value={form.responsable}
                onChange={nameChange}
                required
              >
                <option value="">Seleccione</option>
                {responsables.map((responsable) => (
                  <option key={responsable.idPers} value={responsable.idPers}>
                    {responsable.nomPers}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Estado */}
          <div className="form-group">
            <label htmlFor="estado" className="form-label">Estado</label>
            {isLoading ? (
              <p>Cargando estados...</p>
            ) : (
              <select
                name="estado"
                id="estado"
                className="form-select"
                value={form.estado}
                onChange={nameChange}
                required
              >
                <option value="">Seleccione</option>
                {estados.map((estado) => (
                  <option key={estado.idEstado} value={estado.idEstado}>
                    {estado.nomEstado}
                  </option>
                ))}
              </select>
            )}
          </div>

           {/* Ubicacion */}
           <div className="form-group">
            <label htmlFor="ubicacion" className="form-label">Ubicacion</label>
            {isLoading ? (
              <p>Cargando estados...</p>
            ) : (
              <select
                name="ubicacion"
                id="ubicacion"
                className="form-select"
                value={form.ubicacion}
                onChange={nameChange}
                required
              >
                <option value="">Seleccione</option>
                {ubicaciones.map((ubicacion) => (
                  <option key={ubicacion.idUbic} 
                  value={ubicacion.idUbic}>
                    {ubicacion.nomUbic}
                  </option>
                ))}
              </select>
            )}
          </div>
                    {/* Botones de Acción */}
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
    </div>
  );
};

export default ActiveCreateView;
