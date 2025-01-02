import { React, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos";
import Select from "react-select";
import styles from "./MantenimientoVistaEstilos.module.css"; // Importación de estilos locales
function MantenVista({ setActiveView,setSelectedMantenimiento }) {

  const [mantenientos, setMantemientos] = useState([]);
  const datosPrueba = [{ value: "1", label: "opcion 1" }];

  useEffect(() => {
    const cargarDatos = async () => {
      const mant = await ApiService.traerDatos("datosManten");
      setMantemientos(mant);
    }
    cargarDatos();
  }, []);

 //// Columnas de mi tabla Mantenimientos
 const columas=[
  {name:"Mantenimiento",selector:row=>row.codManten},
  {name:"Fecha de inicio",selector:row=>row.fechaInico},
  {name:"Fecha de finalizacion",selector:row=>row.fechaFin},
  {name:"estado",selector:row=>row.nomEstado},
  {name:"responsable",selector:row=>row.nombreResponsable},
  {name:"Opciones",cell:(row)=>
    (<div style={{ display: "flex", gap: "10px" }}>
      <button onClick={()=>historialMantenimiento(row)}>Detalles</button>
        {row.nomEstado==="En proceso"?(<button onClick={()=>editarMantenimiento(row.idManten,row.codManten)}>Editar</button>):(null)}
    </div>
  ),ignoreRowClick: true},
 ];
 /////// editar

 const editarMantenimiento = (id,nombre)=>{
    const datosEditar=[{idMan:id, codMant:nombre,accion:"editar"}];
    setSelectedMantenimiento(JSON.stringify(datosEditar));
    setActiveView("detalleMantenimiento");
 }
 const historialMantenimiento=(fila)=>{
    setSelectedMantenimiento(JSON.stringify(fila));
    setActiveView("historialMantenimiento");

 }

 const buscar = async(e)=>{
  e.preventDefault();
 const res= await ApiService.buscarDatos("busManten",e.target.value);
 setMantemientos(res);
 }

  const StylesTable = {
    headCells: {
      style: {
        backgroundColor: "#7c181a",
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "capitalize",
        border: "1px solid #ddd",
      },
    },
    cells: {
      style: {
        border: "1px solid #ddd",
        fontSize: "16px",
        padding: "10px",
        color: "#333",
        textAlign: "left",
        textTransform: "capitalize",
      },
    },

  };


  return (
    <div className={styles.MantenPrincipal}>
      <h2 className={styles.tittle}> Mantenimientos de Activos</h2>
      <form className={styles["active-form"]}>
        <div className={styles["filter-section"]}>
          <div className={styles["filter-group"]}>
            <label htmlFor="" >Filtro 1</label>
            <Select className={styles["filter-select"]}
              options={datosPrueba} />
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="" className={styles.formLabel}>Filtro 2</label>
            <Select className={styles["filter-select"]}
              options={datosPrueba} />
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="" className={styles.formLabel}>Filtro 3</label>
            <Select className={styles["filter-select"]}
              options={datosPrueba} />
          </div>
          <div className={styles["filter-group"]}>
            <label htmlFor="" className={styles.formLabel}>Filtro 4</label>
            <Select className={styles["filter-select"]}
              options={datosPrueba} />
          </div>
        </div>
        <div className={styles["actions-section"]}>
          <div className={styles["search-row"]}>
            <p>Ingresa el nombre: </p>
            <input
              className={styles["text-input"]}
              type="text"
              name="buscar"
              id="buscar"
              placeholder="Buscar mantenimiento"
              onChange={buscar}/>
          </div>

          <div className={styles["action-buttons"]}>
            <button
              className={styles["secondary-button"]}
              onClick={() => setActiveView("crearMantenimiento")}
            >
              Nuevo Mantenimiento
            </button>
          </div>
        </div>
        <DataTable
          pagination
          paginationPerPage={10}
          columns={columas}
          data={mantenientos}
          noDataComponent="No ha selecionado ninguna actividad"
          persistTableHead
          customStyles={StylesTable}>
        </DataTable>
      </form>
    </div>
  );
}

export default MantenVista;
