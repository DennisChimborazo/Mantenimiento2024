import { React, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos";
import Select from "react-select";
import styles from "./MantenimientoVistaEstilos.module.css"; // Importación de estilos locales
import mostrarMensaje from "../Mensajes/Mensaje";
function MantenVista({ setActiveView, setSelectedMantenimiento, setMantenimietoEdit }) {

  const [mantenientos, setMantemientos] = useState([]);
  const selEstados = [{ value: "3", label: "En proceso" }, { value: "4", label: "Terminado" }];
  const [ranFechas, setRanFechas] = useState({ busFechInio: "", busFechFinal: "" });
  const [inpbuscar, setInpbuscar] = useState("");
  const [selCombEstado, setSelCombEstado] = useState("");
  const [selCombRespo, setSelCombRespo] = useState("");
  const [datosComboRes, setDatosComboRes] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [responsable, setResponsable] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const mant = await ApiService.traerDatos("datosManten");
      setMantemientos(mant);
    }

    const cargarDatosRes = async () => {
      let prov = await ApiService.traerDatos("proovedor");
      const provConvertido = prov.map((d) => ({
        clave: d.idProveedor,
        nombre: d.nomProveedor,
      }));

      setProveedor(provConvertido);

      let per = await ApiService.traerDatos("responsable");
      let perConvertido = per.map((d) => ({
        clave: d.idPers,
        nombre: d.nomPers,
      }));

      setPersonal(perConvertido);
      setDatosComboRes(perConvertido);
      setResponsable("in");
    }
    cargarDatosRes();
    cargarDatos();
  }, []);

  //// Columnas de mi tabla Mantenimientos
  const columas = [
    { name: "Mantenimiento", selector: row => row.codManten },
    { name: "Fecha de inicio", selector: row => row.fechaInico },
    { name: "Fecha de finalizacion", selector: row => row.fechaFin },
    { name: "estado", selector: row => row.nomEstado },
    { name: "responsable", selector: row => row.nombreResponsable },
    {
      name: "Opciones", cell: (row) =>
      (<div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
        <button className={styles["secondary-button"]} onClick={() => historialMantenimiento(row)}>Historial</button>
        {row.nomEstado === "En proceso" ? (
          <button className={styles["secondary-button"]} onClick={() => editarInfMantenimiento(row)}>Editar Informacion</button>) : (null)}
        {row.nomEstado === "En proceso" ? (
          <button className={styles["secondary-button"]} onClick={() => editarMantenimiento(row.idManten, row.codManten)}>Editar proceso</button>) : (null)}

      </div>
      ), ignoreRowClick: true
    },
  ];
  /////// editar

  const editarMantenimiento = (id, nombre) => {
    const datosEditar = [{ idMan: id, codMant: nombre, accion: "editar" }];
    setSelectedMantenimiento(JSON.stringify(datosEditar));
    setActiveView("detalleMantenimiento");
  }
  const historialMantenimiento = (fila) => {
    setSelectedMantenimiento(JSON.stringify(fila));
    setActiveView("historialMantenimiento");

  }
  const editarInfMantenimiento = (fila) => {
  console.log(fila);
    setMantenimietoEdit(JSON.stringify(fila));
    console.log(fila);
  //  setActiveView("crearMantenimiento");
 }

 const asignarValorFecha =(e)=>{
  setSelCombEstado("");
  setSelCombRespo("");
  setInpbuscar("");
  setRanFechas({
    ...ranFechas,[e.target.name]:e.target.value,
  });
 }
 const buscarRangoFechas= async (e)=>{
  e.preventDefault();
   if (ranFechas.busFechInio===""||ranFechas.busFechFinal==="") {
    mostrarMensaje({title:"Seleccione dos fechas",text:"Debe asignar una fecha de inicio y fin",timer:2000,icon:"info"});
   }else{
    const fini= new Date(ranFechas.busFechInio);
    const ffin= new Date(ranFechas.busFechFinal);
    if (fini>ffin) {
    mostrarMensaje({title:"Fechas invalidas",text:"Seleccione un rango de fechas Valido",timer:2000,icon:"info"});
    }else{
      const res = await ApiService.enviarDatos("busMantRanFechas",ranFechas);
      setMantemientos(res);
    }
   }
 }
 const borrarDatos= ()=>{
  setRanFechas({busFechInio:"",busFechFinal:""});
  setInpbuscar("");
 }

  const buscar = async (e) => {
    e.preventDefault();
    setSelCombEstado("");
    setSelCombRespo("");
    setRanFechas({ busFechInio: "", busFechFinal: "" });
    setInpbuscar(e.target.value);
    const res = await ApiService.buscarDatos("busManten", e.target.value);
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

  const cargarResponsable = (e) => {
    setSelCombRespo("");
    let tip = "";
    if (e.target.checked) {
      setDatosComboRes(proveedor);
      tip = "ex";
    } else {
      setDatosComboRes(personal);
      tip = "in";
    }
    setResponsable(tip);
  }

  const filtroCombos = async (e, nombre) => {
    borrarDatos();
    if (nombre.name === "comEstado") {
      setSelCombRespo("");
      setSelCombEstado(e);
      const respuesta = await ApiService.buscarDatos("busMantEstado", e.value);
      setMantemientos(respuesta);
    } else {
      const envDat = { idRespon: e.value, tipo: responsable };
      setSelCombEstado("");
      setSelCombRespo(e);
      const res = await ApiService.enviarDatos("busMantRespons", envDat);
      setMantemientos(res);
    }
  }

  return (
    <div className={styles.MantenPrincipal}>
      <h2 className={styles.tittle}> Mantenimientos de Activos</h2>
      <form className={styles["active-form"]}>
        <div className={styles["filter-section"]}>
          <div><p>Busqueda por rango de fechas: </p>
            <div className={styles["options-calendar"]}>
              <label htmlFor="">Fecha Inico</label>
              <input type="date" name="busFechInio" onChange={asignarValorFecha} value={ranFechas.busFechInio} />
            </div>
            <div className={styles["options-calendar"]}>
              <label htmlFor="">Fecha Final</label>
              <input type="date" name="busFechFinal" onChange={asignarValorFecha} value={ranFechas.busFechFinal} />
            </div>
            <div className={styles["action-buttons"]}>
              <button onClick={buscarRangoFechas} className={styles["secondary-button"]}>Buscar</button>
            </div>
          </div>
          <div className={styles["filter-group1"]}>
            <div className={styles["filter-group"]}>
              <label htmlFor="" >Estado:</label>
              <Select className={styles["filter-select"]}
                options={selEstados}
                onChange={filtroCombos}
                value={selCombEstado}
                name="comEstado" />
            </div>
            <div className={styles["filter-group"]}>
              <label htmlFor="" className={styles.formLabel}>Responsable: {<label htmlFor="Tipo">Agente externo  {
                <input type="checkbox" className={styles.checkbox} onChange={(e) => cargarResponsable(e)} name="checResp" id="checResp" />
              }</label>}</label>
              <Select className={styles["filter-select"]}
                options={datosComboRes.map((d) => ({
                  value: d.clave,
                  label: d.nombre,
                }))}
                onChange={filtroCombos}
                name="comRespons"
                value={selCombRespo} />
            </div>

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
              onChange={buscar}
              value={inpbuscar} />
          </div>

          <div className={styles["action-buttons"]}>
            <button
              className={styles["primary-button"]}
              onClick={nuevoInfMantenimiento}>
              Nuevo Mantenimiento
            </button>
          </div>
        </div>
        <DataTable
          pagination
          paginationPerPage={10}
          columns={columas}
          data={mantenientos}
          noDataComponent="Ningun Mantenimiento"
          persistTableHead
          customStyles={StylesTable}>
        </DataTable>
      </form>
    </div>
  );
}

export default MantenVista;
