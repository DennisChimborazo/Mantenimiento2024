import React, { useEffect, useState } from "react";
import ModalCrearManten from "./ModalCrearManten";
import styles from "./CrearMantenimientoEstilos.module.css";
import styles1 from "./MantenPrincipal.module.css";
import ApiService from "../../Services/ApiMetodos";
import DataTable from "react-data-table-component";
import ModalHisManten from "./ModalHisManten";
import { FcClearFilters,FcSupport,FcFinePrint } from "react-icons/fc";
import Select from "react-select";
import mostrarMensaje from "../Mensajes/Mensaje";
function MantenPrincipal({ setActiveView, setDatosMantenimiento, datosMantenimiento }) {
  const [datosPadre, setDatosPadre] = useState([]);
  const [estadoAbrirModal, setEstadoAbrirModal] = useState(false);
  const [mantenientos, setMantemientos] = useState([]);
  const [mantenientosTabla, setMantemientosTabla] = useState([]);
  const [mantenientosTemp, setMantemientosTemp] = useState([]);
  const [valorFechaInicio,setValorFechaInicio]=useState("");
  const [valorFechaFinal,setValorFechaFinal]=useState("");
  const [valorSelect,setValorSelect]=useState("");
  const [valorInputBuscar,setValorInputBuscar]=useState("");
  const [estadoAbrirModalHistorial, setEstadoAbrirModalHistorial] = useState(false);
  const [datosHistorial, setDatosHistorial] = useState([]);
  const estadosCombo=[{value:"En proceso",label:"En proceso"},{value:"Terminado",label:"Terminado"}];

  useEffect(() => {
    const cargarDatos = async () => {
      let prov = await ApiService.traerDatos("proovedor");
      const provConvertido = prov.map((d) => ({
        clave: d.idProveedor,
        nombre: d.nomProveedor,
      }));

      let per = await ApiService.traerDatos("responsable");
      const perConvertido = per.map((d) => ({
        clave: d.idPers,
        nombre: d.nomPers,
      }));

      const actData = await ApiService.traerDatos("actividad");
      const actConver = actData.map((datos) => ({
        value: datos.idActi,
        label: datos.nomActi,
      }));

      const com = await ApiService.traerDatos("componen");
      const comCover = com.map((datos) => ({
        value: datos.idCompo,
        label: datos.nomCompo,
      }));
      const activ = await ApiService.traerDatos("todActivos");
      const mant = await ApiService.traerDatos("datosManten");
      setMantemientos(mant)
      setMantemientosTabla(mant);
      setDatosPadre([activ,provConvertido, perConvertido, actConver, comCover]);
    };

    cargarDatos();
  }, []);

  const columasMantenimientos = [
    { name: "Mantenimiento", selector: row => row.codManten },
    { name: "Fecha de inicio", selector: row => row.fechaInico },
    { name: "Fecha de finalizacion", selector: row => row.fechaFin },
    { name: "estado", selector: row => row.nomEstado },
    { name: "responsable", selector: row => row.nombreResponsable },
    {
      name: "Opciones", cell: (row) =>
      (<div>
        <FcFinePrint size={25} onClick={() => abrirModalHistorial(row)}/>
        <FcSupport size={25}  onClick={() => editarInfMantenimiento(row)}/>
      </div>
      ), ignoreRowClick: true
    },
  ];
  
  const editarInfMantenimiento = (fila) => {
    const newArray = [].concat(fila).map(item => ({
      ...item,
      edit: true,
    }));
    setDatosMantenimiento([...datosPadre,newArray]);
    setActiveView("MantenProceso");
 }

  const abrirModal = () => {
    setEstadoAbrirModal(true);
  };

  const cerrarModal = () => {
    setEstadoAbrirModal(false);
  };
  const abrirModalHistorial = (fila) => { 
    setDatosHistorial([fila]);
    setEstadoAbrirModalHistorial(true);};
  const cerrarModalHistorial = async () => {
    setEstadoAbrirModalHistorial(false);
  };

  const buscarFechaInicio = (e) => {
    setValorInputBuscar("");
    setValorSelect("");
    setValorFechaInicio(e.target.value);
    const fechaSeleccionada = new Date(e.target.value); 
    const datosFiltrados = mantenientos.filter((item) => {
    const fechaInico = new Date(item.fechaInico); // Convertir la fechaInico a un objeto Date
    return fechaInico >= fechaSeleccionada;
      });
    setMantemientosTabla(datosFiltrados);
    setMantemientosTemp(datosFiltrados)
    };
  
  const buscarFechaFinal=(e)=>{
    if (valorFechaInicio==="") {
      mostrarMensaje({title:"Fecha Inicial",text:"Selecione una fecha de partida",icon:"info",timer:2000});
      setValorFechaFinal("");
    }else{
      setValorFechaFinal(e.target.value);
      const fechaInicioFiltro= new Date(valorFechaInicio);
      const fechaFinFiltro= new Date(e.target.value);
      if (fechaInicioFiltro>fechaFinFiltro) {
        mostrarMensaje({title:"Fechas invalidas",text:"Seleccione un rango de fechas Valido",timer:2000,icon:"info"});
        setValorFechaFinal("");
      }else{
        buscarRangoFechas(valorFechaInicio,e.target.value)
      }

    }
  }
  const buscarRangoFechas = (fechaInicio, fechaFin) => {
   const fechaInicioFiltro = new Date(fechaInicio); // Fecha de inicio proporcionada
    let fechaFinFiltro = null;
  
    if (fechaFin && fechaFin !== "S/N" && fechaFin !== "fecha ampliada") {
      fechaFinFiltro = new Date(fechaFin); // Si la fecha es válida, la convertimos
    }
  
    if (!fechaFinFiltro) {
      fechaFinFiltro = fechaInicioFiltro;
    }
  
    const datosFiltrados = mantenientos.filter((item) => {
      const fechaInico = new Date(item.fechaInico); // Convertir fechaInico del mantenimiento
      let fechaFinItem = null;
  
      if (item.fechaFin && item.fechaFin !== "S/N" && item.fechaFin !== "ampliada") {
        fechaFinItem = new Date(item.fechaFin); // Si la fechaFin es válida, convertirla
      }
  
      if (!fechaFinItem) {
        fechaFinItem = fechaInico;
      }
  
      return (
        (fechaInico >= fechaInicioFiltro && fechaInico <= fechaFinFiltro) ||
        (fechaFinItem >= fechaInicioFiltro && fechaFinItem <= fechaFinFiltro) ||
        (fechaInico <= fechaInicioFiltro && fechaFinItem >= fechaFinFiltro)
      );
    });
  setMantemientosTabla(datosFiltrados);
  setMantemientosTemp(datosFiltrados);

  };
  
const buscarManEstados=(e)=>{
  setValorSelect(e);
  setValorInputBuscar("")
  if (valorFechaInicio!==""||valorFechaInicio!==""&&valorFechaFinal!=="") {
      const filtro=mantenientosTemp.filter((m)=>m.nomEstado===e.value);
      setMantemientosTabla(filtro);
  }else{
   const filtro=mantenientos.filter((m)=>m.nomEstado===e.value);
     setMantemientosTabla(filtro);
}
}
const buscarCodMantenimiento=(e)=>{
  setValorFechaFinal("")
  setValorFechaInicio("")
  setValorSelect("")
  setValorInputBuscar(e.target.value)
  const bus=mantenientos.filter((ac)=>ac.codManten.startsWith(e.target.value));
  setMantemientosTabla(bus)
}

const limpiarFiltros=()=>{
    setValorFechaFinal("")
    setValorFechaInicio("")
    setValorSelect("")
    setValorInputBuscar("")
    setMantemientosTabla(mantenientos);
}
const customStyles = {
  header: {
    style: {
      minHeight: '56px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#7c181a',
      
    },
  },
  headRow: {
    style: {
      backgroundColor: '#7c181a',
      borderTop: '1px solid #dddddd',

    },
  },
  headCells: {
    style: {
      fontSize: '14px',
      fontWeight: '600',
      textTransform: 'uppercase',
      paddingLeft: '8px',
      paddingRight: '8px',
      color: '#ffffff',

    },
  },
  rows: {
    style: {
      backgroundColor: '#ffffff',
      '&:nth-of-type(even)': {
        backgroundColor: '#f9f9f9', // Color alternativo para filas pares
      },
      '&:hover': {
        backgroundColor: '#ffe3e3', // Color al pasar el cursor
      },
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  pagination: {
    style: {
      borderTop: '1px solid #dddddd',
      backgroundColor: '#ffffff',
      padding: '8px',
    },
    
  },
};

  return (
    <div className={styles1.Mantenimiento}>
      <h2>Mantenimientos</h2>
      <div className={styles1["filtros-container"]}>
        <label htmlFor="">Buscar</label>
        <input type="text" onChange={buscarCodMantenimiento} value={valorInputBuscar} />
        <label>Fecha inicial</label>
        <input type="date" onChange={buscarFechaInicio}  value={valorFechaInicio}/>
        <label>Fecha Final</label>
        <input type="date" onChange={buscarFechaFinal} value={valorFechaFinal}/>
        <label htmlFor="">Estado</label>
        <Select
            options={estadosCombo}
            placeholder="Seleccione el estado"
            onChange={buscarManEstados}
            value={valorSelect}
          />
          
        <FcClearFilters size={30} onClick={limpiarFiltros} />
      </div>

      <div className={styles1["action-buttons"]}>
      <button onClick={abrirModal} className={styles1["primary-button"]}>Nuevo Mantenimiento</button>
      </div>
      <div className={styles1["data-table-container"]}>
      <DataTable
          pagination
          paginationPerPage={5}
          columns={columasMantenimientos}
          data={mantenientosTabla}
          noDataComponent="Ningun Mantenimiento"
          customStyles={customStyles}
          persistTableHead>
        </DataTable>
        </div>


      {estadoAbrirModal && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <ModalCrearManten
              onClose={cerrarModal}
              setActiveView={setActiveView}
              setDatosMantenimiento={setDatosMantenimiento}
              datosPadre={datosPadre} // Pasamos datosPadre al modal
            />
          </div>
        </div>
      )}
      
      {estadoAbrirModalHistorial && (
        <div className={styles["modal-overlay"]}>
          <div className={styles.modal}>
            <ModalHisManten
              onClose={cerrarModalHistorial}
              datosHistorial={datosHistorial}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MantenPrincipal;
