import React, { useState, useEffect, act } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos.js";
import mostrarMensaje from "../Mensajes/Mensaje.js";
import styles from "./MantenimientoDetalleEstilos.module.css"; // Importación de estilos locales


function MantenDetalle({ setActiveView, mantenimiento }) {
  const [datosPadre, setDatosPadre] = useState([]);

  const [formulario, setFormulario] = useState({ obs: "", datos: "", idAct: "", idMan: "" });

  const [recopilacionDetalles, setRecopilacionDetalles] = useState("");
  const [observacion, setObservacion] = useState(null);

  const [actividades, setActividades] = useState([]);
  const [componentes, setComponentes] = useState([]);

  const [datosEnvioComp, setdatosEnvioComp] = useState([]);
  const [datosEnvio, setdatosEnvio] = useState([]);

  const [dataTablaActividades, setdataTableActividades] = useState([]);
  const [dataTablaCom, setdataTablaCom] = useState([]);

  const [activoBusqueda, setActivosBusqueda] = useState([]);

  const [activoParaDetalle, setActivoParaDetalle] = useState([]);

  const [listadoActivos, setListadoActivos] = useState([]);

  const [activoSerie, setActivoSerie] = useState(null);

  const [activoSerieInput, setActivoSerieInput] = useState(null);

  useEffect(() => {
    const cagarProo = async () => {
      const actData = await ApiService.traerDatos("actividad");
      const dn = actData.map((datos) => ({
        value: datos.idActi,
        label: datos.nomActi,
      }));

      setActividades(dn);
    };
    const cargarComponentes = async () => {
      const com = await ApiService.traerDatos("componen");
      const dn = com.map((datos) => ({
        value: datos.idCompo,
        label: datos.nomCompo,
      }));
      setComponentes(dn);
    };

    cagarProo();
    cargarComponentes();
    console.log(mantenimiento);
    setDatosPadre(JSON.parse(mantenimiento));
    console.log(datosPadre);

  }, []);

  //////////////////////////////////
  const buscarActivo = async (e) => {
    setActivoSerieInput(e.target.value);
    const activo = await ApiService.buscarDatos("busActSerie", e.target.value);
    setActivosBusqueda(activo);
  }

  const colum = [
    { name: "Proceso de compra", selector: row => row.idCompra },
    { name: "Serie", selector: row => row.serieAct },
    { name: "Codigo de barras", selector: row => row.codigoBarraAct },
    { name: "Marca", selector: row => row.marcaAct },
    { name: "Modelo", selector: row => row.modeloAct },
    { name: "Color", selector: row => row.colorAct },
    { name: "Ubicacion", selector: row => row.nomUbic },
    {
      name: "Opciones", cell: (row) =>
      (<div style={{ display: "flex", gap: "10px" }}>
        <button className={styles["secondary-button"]} onClick={() => seleccionarActivo(row.serieAct)}>Selecionar</button>
      </div>
      ), ignoreRowClick: true
    },
  ];

  const seleccionarActivo = (e) => {
    const filtrado = activoBusqueda.filter(a => a.serieAct === e);
    const s2 = listadoActivos.filter(l => l.serieAct === filtrado[0].serieAct);
    if (s2.length === 0) {
      setActivoParaDetalle(filtrado);
      setActivoSerie(e);
      setActivoSerieInput("");
      setActivosBusqueda([]);
    } else {
      mostrarMensaje({
        title: "Activo ya detallado", text: "El activo seleccionado ya se encuentra en la lista",
        icon: "warning", timer: 2000
      });

    }

  }
  ////////////////////////////////
  const AgregarActividadTabla = (e) => {
    e.preventDefault();
    if (datosEnvio.length === 0) {
      mostrarMensaje(
        {
          title: "No se puede agregar",
          text: "Primero debe de selecionar una actividad",
          icon: "error",
          timer: 2500
        }
      );
    } else {
      const nuevosDatos = datosEnvio
        .map(({ value }) => `('${datosPadre[0].idMan}', '${activoParaDetalle[0].idActivo}', 'act', '${value}')`)
        .join(", ");
      setRecopilacionDetalles((datosActuales) => (datosActuales ? `${datosActuales}, ${nuevosDatos}` : nuevosDatos));
      setdataTableActividades((datos) => [...datos, ...datosEnvio]);
      const idsEnvio = datosEnvio.map((item) => item.value);
      const n = actividades.filter((acti) => !idsEnvio.includes(acti.value));
      setActividades(n);
      setdatosEnvio([]);
    };
  }

  const agregarValores = (val) => {
    setdatosEnvio(val);
  }

  const columasActividades = [
    { name: "Actividades realizadas", selector: row => row.label },
    { name: "Eliminar", cell: (row) => (<button className={styles["secondary-button"]} onClick={() => devolverValores(row.value)}>Eliminar</button>), ignoreRowClick: true },
  ];

  const devolverValores = (id) => {
    const n = dataTablaActividades.filter((row) => row.value !== id);

    setdataTableActividades(n);
    const nd = dataTablaActividades.filter((row) => row.value === id);
    setActividades((datos) => [...datos, ...nd]);
    eliminarDetalle("act", id);
    console.log(recopilacionDetalles);

  }

  const eliminarDetalle = (clave1, clave2) => {
    const detallesArray = recopilacionDetalles
      .split("),") // Divide por `),` para separar los elementos
      .map((detalle) => detalle.trim() + (detalle.trim().endsWith(")") ? "" : ")")); // Asegura que todos los elementos terminen en `)`
    const detallesFiltrados = detallesArray.filter((detalle) => {
      return !(detalle.includes(`'${clave1}'`) && detalle.includes(`'${clave2}'`));
    });
    const nuevosDetalles = detallesFiltrados.join(", ");
    setRecopilacionDetalles(nuevosDetalles);
  };
  /////////////////////////

  const agregarValorCom = (val) => {
    setdatosEnvioComp(val);
  };

  const columascomp = [
    { name: "Componente", selector: row => row.label },
    { name: "Eliminar", cell: (row) => (<button className={styles["secondary-button"]} onClick={() => devolverValoresCom(row.value)}>Eliminar</button>), ignoreRowClick: true },
  ];

  const AgregarComponenteTabla = (e) => {
    e.preventDefault();
    if (datosEnvioComp.length === 0) {
      mostrarMensaje({
        title: "No se puede agregar",
        text: "Selecione un componente primero",
        icon: "error",
        timer: 3200
      });
    } else {
      const nuevosDatos = datosEnvioComp
        .map(({ value }) => `('${datosPadre[0].idMan}', '${activoParaDetalle[0].idActivo}', 'com', '${value}')`)
        .join(", ");

      setRecopilacionDetalles((datosActuales) => (datosActuales ? `${datosActuales}, ${nuevosDatos}` : nuevosDatos));

      setdataTablaCom((datos) => [...datos, ...datosEnvioComp]);
      const idsEnvio = datosEnvioComp.map((item) => item.value);
      const n = componentes.filter((acti) => !idsEnvio.includes(acti.value));
      setComponentes(n);
      setdatosEnvioComp([]);
    }
  }
  const devolverValoresCom = (id) => {
    const n = dataTablaCom.filter((row) => row.value !== id);
    setdataTablaCom(n);
    const nd = dataTablaCom.filter((row) => row.value === id);
    setComponentes((datos) => [...datos, ...nd]);
    eliminarDetalle("com", id);
  }

  const customStyles = {
    table: {
      style: {
        width: '100%',
        minWidth: '400px',  // Ancho mínimo para evitar que cambie de tamaño
        maxWidth: '500px', // Máximo para evitar que crezca demasiado
        margin: '0 auto',   // Centra la tabla en el contenedor
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
  const stylesTableActive = {
    table: {
      style: {
        width: '100%',
        minWidth: '1000px',
        maxWidth: '1100px',
        margin: '0 auto',
         tableLayout: 'fixed'
      },
    },
    headRow: {
      style: {
        minHeight: '56px',  // Aumenta la altura mínima de la fila de encabezado
      },
    },
    headCells: {
      style: {
        backgroundColor: "#7c181a",
        color: "#FFFFFF",
        fontSize: "16px",
        fontWeight: "bold",
        textTransform: "capitalize",
        whiteSpace: 'normal',
        wordWrap: 'break-word',
        textAlign: 'center',
        minWidth: '200px',  // Aumenta el ancho mínimo de las celdas del encabezado
        maxWidth: '300px',  // Limita el ancho máximo para evitar estiramiento excesivo
      },
    },
    cells: {
      style: {
        fontSize: '14px',
        padding: '10px',
      },
    },
  };

  const stylesTableActiveFinal = {
    table: {
      style: {
        width: '100%',
        minWidth: '800px',  // Ancho mínimo para evitar que cambie de tamaño
        maxWidth: '900px', // Máximo para evitar que crezca demasiado
        margin: '0 auto',   // Centra la tabla en el contenedor
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

  ///////////////////////

  const tomarValorInput = (e) => {
    setObservacion(e.target.value);
  }

  const agregarNuevoDettale = (e) => {
    e.preventDefault();
    if (recopilacionDetalles !== "") {
      setFormulario({
        ...formulario,
        obs: observacion, datos: recopilacionDetalles, idMan: datosPadre[0].idMan, idAct: activoParaDetalle[0].idActivo,
      });
    } else {
      mostrarMensaje({
        title: "Datos vacios", icon: "error", text: " Debe de realizar minimo una accion", timer: 2000,
      });
    }
  }

  useEffect(() => {
    if (formulario.datos !== "") {
      const enviarValores = async () => {
        console.log("id: " + datosPadre[0].idMan);
        console.log("idFormula: " + formulario.idMan);

        const res = await ApiService.enviarDatos("nuevoDetalleMantenimiento", formulario);
        console.log(res);
        borrarDatos();
        setListadoActivos((act) => [...act, ...activoParaDetalle]);
        setActivoParaDetalle([]);
      }
      enviarValores();
    }
  }, [formulario]);

  const borrarDatos = () => {
    setFormulario({ ...formulario, obs: "", datos: "" });
    setRecopilacionDetalles("");
    setObservacion("");
    setdataTablaCom([]);
    setdataTableActividades([]);
    setComponentes((com) => [...com, ...dataTablaCom]);
    setActividades((act) => [...act, ...dataTablaActividades]);
  }

  const columasActivosFinales = [
    { name: "Proceso de compra", selector: row => row.idCompra },
    { name: "Serie", selector: row => row.serieAct },
    { name: "Codigo de barras", selector: row => row.codigoBarraAct },
    { name: "Marca", selector: row => row.marcaAct },
    { name: "Eliminar", cell: (row) => (<button className={styles["secondary-button"]} onClick={() => eliminarActivosManteniento(row.idActivo)}>Eliminar</button>), ignoreRowClick: true },
  ];

  /////////////////////////
  const eliminarActivosManteniento = async (e) => {
    const res = await mostrarMensaje({
      icon: "info",
      title: "Eliminar Activo ",
      text: "Estas seguro que deseas eliminar el activo del mantenimiento",
      buttons: {
        cancel: "Cancelar",
        confirm: "Si",
      },
    });
    if (res) {
      const val = [{ idManten: datosPadre[0].idMan, idAct: e, }];
      const res = await ApiService.borrarDatos("borrarDatosMantenimiento", val);
      const lista = listadoActivos.filter(l => l.idActivo !== e);
      setListadoActivos(lista);
    }

  }
  const finalizarProcesoMantenimiento = async () => {
    if (listadoActivos.length === 0) {
      mostrarMensaje({ title: "Advertencia", text: "Ningun activo se ha agregado a este mantemiento", icon: "warning", timer: 2500, });

    } else {
      const res = await mostrarMensaje({
        icon: "info",
        title: "Terminar Mantenimiento ",
        text: "Estas seguro que deseas finalizar",
        buttons: {
          cancel: "Cancelar",
          confirm: "Finalizar",
        },
      });
      if (res) {
        const val = [{ idManten: datosPadre[0].idMan }];
        const res = await ApiService.actualizarDatos("actuMantenimiento", val[0]);
        mostrarMensaje({ title: "Finalizado con exito", text: "Se ha finalizado el proceso de mantenimiento", icon: "success", timer: 2500, });
        setActiveView("mantenimiento");

      }
    }
  }
  const volverMantenVista = async () => {
    const res = await mostrarMensaje({
      icon: "info",
      title: "Continuar despues ",
      text: "Estas seguro que desea continar en otro momento",
      buttons: {
        cancel: "Cancelar",
        confirm: "Si",
      },
    });
    if (res) {
      setActiveView("mantenimiento");
    }
  }
  ////////////////////
  return (

    <div className={styles.MantenDetalle}>
      <div className={styles.tittle}>
        DETALLE MANTENIMIENTO:{" "}
        {datosPadre.length === 0 ? "Cargando..." : datosPadre[0].codMant}
      </div>
      <div className={styles["actions-section"]}>
        <label htmlFor="activos"> Ingresa la serie del activo </label>
        <input className={styles["text-inputactive"]} type="text" name="activo" id="activo" onChange={buscarActivo} value={activoSerieInput} />
        <DataTable
          pagination
          paginationPerPage={5}
          columns={colum}
          data={activoBusqueda}
          noDataComponent="No ha selecionado ningun activo"
          persistTableHead
          customStyles={stylesTableActive}>
            
        </DataTable>
        {activoSerie ? (

          <h2 className={styles["style-labels"]}>Activo seleccionado: {activoSerie}</h2> // Si hay un activo seleccionado
        ) : (
          <h2 className={styles["style-labels"]}>No se ha seleccionado ningún activo</h2> // Si no hay activo seleccionado
        )}
      </div>
      <div className={styles.contenedorTablas}>
        <div className={styles.tablaActividad}>
          <div className={styles["filter-section"]}>

            <label htmlFor="actividad" >Actvidades</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              options={actividades.map((acti) => ({
                value: acti.value,
                label: acti.label,
              }))}
              placeholder="Selecciona una actividad"
              onChange={agregarValores}
              value={datosEnvio}
              className={styles["filter-select"]}

            />
          </div>

          <div className={styles["action-buttons"]}>
            <button className={styles["primary-button"]} onClick={AgregarActividadTabla}>Agregar</button>
          </div>
          <br />
          <DataTable
            pagination
            paginationPerPage={5}
            columns={columasActividades}
            data={dataTablaActividades}
            noDataComponent="No ha selecionado ninguna actividad"
            persistTableHead
            customStyles={customStyles}>
          </DataTable>
        </div>
        <div className={styles.tablaComponente}>
          <div className={styles["filter-section"]}>

            <label htmlFor="componentes">Componentes</label>
            <Select
              isMulti
              closeMenuOnSelect={false}
              options={componentes.map((com) => ({
                value: com.value,
                label: com.label,
              }))}
              placeholder="Selecciona un componente"
              onChange={agregarValorCom}
              value={datosEnvioComp}
              className={styles["filter-select"]}

            />
          </div>

          <div className={styles["action-buttons"]}>

            <button className={styles["primary-button"]} onClick={AgregarComponenteTabla}>Agregar</button>
          </div>

          <br />
          <DataTable
            pagination
            paginationPerPage={5}
            columns={columascomp}
            data={dataTablaCom}
            noDataComponent="No ha selecionado ningun componente"
            persistTableHead
            customStyles={customStyles}>
          </DataTable>

        </div>
      </div>
      <div className={styles["actions-section"]}>
        <label htmlFor="observacion">Observacion:</label>
        <textarea
          id="observacion"
          name="observacion"
          rows="10"
          cols="135"
          placeholder="Detalle alguna observacion"
          onChange={tomarValorInput}
          value={observacion}
          className={styles["text-input"]}>
        </textarea>
      </div>
      <div className={styles["actions-section"]}>
        <label htmlFor="">Guardar los Datos y agregar un nuevo activo: </label>
        <div className={styles["action-buttons"]}>
          <button className={styles["primary-button"]} onClick={agregarNuevoDettale}> Agregar</button>
        </div>
      </div>

      <div className={styles["style-activeFinal"]}>
        <h3 >Listado de activos del Matenimiento </h3>
        <DataTable
          pagination
          paginationPerPage={5}
          columns={columasActivosFinales}
          data={listadoActivos}
          noDataComponent="No ha selecionado ningun activo"
          persistTableHead
          customStyles={stylesTableActiveFinal}>
        </DataTable>
      </div>
      <div className={styles["actions-button"]}>
  <button className={styles["primary-button"]} onClick={volverMantenVista}> Continuar despues </button>
  <button className={styles["primary-button"]} onClick={finalizarProcesoMantenimiento}> Finalizar Mantenimiento </button>
</div>

      <div><br />
        <br /><br />
      </div>
    </div>
  );
}

export default MantenDetalle;
