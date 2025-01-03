import { useEffect, useState } from "react";
import ApiService from "../../Services/ApiMetodos";
import DataTable from "react-data-table-component";
import styles from "./MantenimientoHistorialEstilos.module.css"; // Importación de estilos locales


function MantenHistorial({ setActiveView, mantenimiento }) {
  const [datosPadre, setDatosPadre] = useState([]);
  const [datosMantenimiento, setDatosMantenimiento] = useState([]);

  useEffect(() => {
    const cargarYTraerDatos = async () => {
      const datos = JSON.parse(mantenimiento);
      setDatosPadre(datos);
      console.log(datos);

      if (datos.idManten) {
        const activo = await ApiService.buscarDatos("historialManten", datos.idManten)
        console.log(activo);
        setDatosMantenimiento(activo);
      }
    };
    cargarYTraerDatos();
  }, []);

  const datosColumna = [
    { name: "Serie", selector: row => row.serieAct, width: "150px", },
    {
      name: "Actividades",
      cell: (row) => (
        <div>
          <ul>
            {row.actividad
              ? row.actividad.split(", ").map((a) => (
                <li>{a}</li>
              ))
              : <li>No hay actividades</li>}
          </ul>
        </div>),
    },
    {
      name: "Componentes",
      cell: (row) => (
        <div>
          <ul>
            {row.componente
              ? row.componente.split(", ").map((a) => (
                <li>{a}</li>
              ))
              : <li>No hay componentes</li>}
          </ul>
        </div>),
    },
    {
      name: "Observacion",
      cell: (row) => (
        <div>
          <ul>
            {row.observacion
              ? <li>{row.observacion}</li>
              : <li>No hay observaciones</li>}
          </ul>
        </div>),
    },

  ];

  const buscarActivo = async (e) => {
    const formulario = [{ idman: datosPadre.idManten, idserie: e.target.value }];
    const busqueda = await ApiService.enviarDatos("histManSerie", formulario[0]);
    setDatosMantenimiento(busqueda);
  }
  const customStyles = {
    table: {
      style: {
        width: '100%',
        minWidth: '1000px',  // Ancho mínimo para evitar que cambie de tamaño
        maxWidth: '1100px', // Máximo para evitar que crezca demasiado
        paddingLeft: '25px'
      },
    },
    headCells: {
      style: {
        backgroundColor: "#7c181a",
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "capitalize",
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        padding: '10px',  // Ajusta el espaciado interno
      },
    },
  };

  return (
    <div className={styles.MantenHistorial}>
      <h2 className={styles.tittle}>Detalle de Mantenimiento: {" "} {datosPadre.length === 0 ? "Cargando..." : datosPadre.codManten}</h2>
      <div className={styles.options}>
        <label htmlFor=""> Fecha inicio: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.fechaInico}</p>
        <label htmlFor=""> Fecha Final: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.fechaFin}</p>
        <label htmlFor=""> Responsable: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.nombreResponsable}</p>
        <label htmlFor=""> Estado: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.nomEstado}</p>

      </div>
      <div className={styles["actions-section"]}>
        <div  className={styles["search-row"]}>
        <label htmlFor="busAct">Buscar activo</label>
        <input className={styles["text-input"]} type="text" name="busAct" id="busAct" onChange={buscarActivo} />
        </div>
      </div>
      <DataTable
        columns={datosColumna}
        data={datosMantenimiento}
        pagination
        paginationPerPage={10}
        noDataComponent="No hay activo registrados"
        persistTableHead
        customStyles={customStyles}
      ></DataTable>

    </div>
  );
}

export default MantenHistorial;
