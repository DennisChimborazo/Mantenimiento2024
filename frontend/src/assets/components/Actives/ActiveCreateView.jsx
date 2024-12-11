import { useEffect, useState } from "react";
import { useGuardarActivo } from "./ActiveCreateFun"; 
import Styles from "./ActivoNuevoEstilos.module.css";


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
    <div className={Styles.modalGlobal}>
      <div className={Styles.NuevoActivo}>
      <h3 className={Styles.formTitle}>Agregar Nuevo Activo</h3>
        <form className={Styles.form} onSubmit={handleSubmit}>
          {/* Proceso de Compra */}
          <div className={Styles.formGroup}>
            <label htmlFor="procesoCompra" className={Styles.formLabel}>
              Proceso de Compra</label>
            {isLoading ? (
              <p>Cargando Procesos compra...</p>
            ) : (
              <select
                name="procesoCompra"
                id="procesoCompra"
                className={Styles.formSelect}
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
          <div className={Styles.formGroup}>
            <label htmlFor="tipoBien" className={Styles.formLabel}>
              Tipo de Bien</label>
            {isLoading ? (
              <p>Cargando Tipo bien...</p>
            ) : (
              <select
                name="tipoBien"
                id="tipoBien"
                className={Styles.formSelect}
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
          <div className={Styles.formGroup}>
            <label htmlFor="bien" className={Styles.formLabel}>
              Bien</label>
            {isLoading ? (
              <p>Cargando bien...</p>
            ) : (
              <select
                name="bien"
                id="bien"
                className={Styles.formSelect}
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
          <div className={Styles.formGroup}>
            <label htmlFor="serie" className={Styles.formLabel}>
              Serie</label>
            <input
              type="text"
              name="serie"
              id="serie"
              className={Styles.formInput}
              placeholder="Ej: 0097987"
              value={form.serie}
              onChange={nameChange}
              required
            />
          </div>

          {/* Marca */}
          <div className={Styles.formGroup}>
            <label htmlFor="marca" className={Styles.formLabel}>
              Marca</label>
            <input
              type="text"
              name="marca"
              id="marca"
              className={Styles.formInput}
              placeholder="Ej: DELL"
              value={form.marca}
              onChange={nameChange}
              required
            />
          </div>

          {/* Modelo */}
          <div className={Styles.formGroup}>
            <label htmlFor="modelo" className={Styles.formLabel}>
              Modelo</label>
            <input
              type="text"
              name="modelo"
              id="modelo"
              className={Styles.formInput}
              placeholder="Ej: D-08"
              value={form.modelo}
              onChange={nameChange}
              required
            />
          </div>

          {/* Color */}
          <div className={Styles.formGroup}>
            <label htmlFor="color" className={Styles.formLabel}>
              Color</label>
            <input
              type="text"
              name="color"
              id="color"
              className={Styles.formInput}
              placeholder="Ej: Azul"
              value={form.color}
              onChange={nameChange}
              required
            />
          </div>

          {/* Código de Barras */}
          <div className={Styles.formGroup}>
            <label htmlFor="codigoBarra" className={Styles.formLabel}>
              Código de Barras</label>
            <input
              type="text"
              name="codigoBarra"
              id="codigoBarra"
              className={Styles.formInput}
              placeholder="Ej: 98797098"
              value={form.codigoBarra}
              onChange={nameChange}
              required
            />
          </div>

        
          {/* Responsable */}
          <div className={Styles.formGroup}>
            <label htmlFor="responsable" className={Styles.formLabel}>
              Responsable</label>
            {isLoading ? (
              <p>Cargando responsables...</p>
            ) : (
              <select
                name="responsable"
                id="responsable"
                className={Styles.formSelect}
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
          <div className={Styles.formGroup}>
            <label htmlFor="estado" className={Styles.formLabel}>
              Estado</label>
            {isLoading ? (
              <p>Cargando estados...</p>
            ) : (
              <select
                name="estado"
                id="estado"
                className={Styles.formSelect}
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
           <div className={Styles.formGroup}>
            <label htmlFor="ubicacion" className={Styles.formLabel}>
              Ubicacion</label>
            {isLoading ? (
              <p>Cargando estados...</p>
            ) : (
              <select
                name="ubicacion"
                id="ubicacion"
                className={Styles.formSelect}
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
         
        </form>
        <div className={Styles.formActions}>
        <button
            className={`${Styles.btn} ${Styles.btnPrimary}`}
            onClick={handleSubmit} // Llama manualmente a handleSubmit
          >
            Guardar
          </button>
            <button
              type="button"
              className={`${Styles.btn} ${Styles.btnSecondary}`}
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
      </div>
    </div>
  );
};

export default ActiveCreateView;
