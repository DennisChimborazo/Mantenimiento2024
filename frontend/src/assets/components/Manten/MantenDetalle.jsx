import React, { useState, useEffect, act } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos.js";
import mostrarMensaje from "../Mensajes/Mensaje.js";
import styles from "./MantenimientoDetalleEstilos.module.css"; // Importación de estilos locales


function MantenDetalle({ setActiveView, mantenimiento }) {
  const [datosPadre, setDatosPadre] = useState([]);

  const [formulario, setFormulario] = useState({ obs: "", datos: "", idAct: "", idMan: "" });

  const [recopilacionDetalles,setRecopilacionDetalles]= useState([]);
  const [observacion,setObservacion]= useState("");

  const [actividades, setActividades] = useState([]); 
  const [componentes, setComponentes] = useState([]); 

  const [datosEnvioComp, setdatosEnvioComp] = useState([]); 
  const [datosEnvio, setdatosEnvio] = useState([]); 

  const [dataTablaActividades, setdataTableActividades] = useState([]); 
  const [dataTablaCom, setdataTablaCom] = useState([]); 

  const [activoBusqueda, setActivosBusqueda] = useState([]);

  const [activoParaDetalle, setActivoParaDetalle] = useState([]);

  const [listadoActivos, setListadoActivos] = useState([]);

  const [estilos,setEstilos]= useState(false);

  const [activoSerieInput,setActivoSerieInput]= useState("");

  const [editarMan,setEditarMan]= useState(false);

  useEffect(() => {
    const cagarProo = async () => {
        const actData = await ApiService.traerDatos("actividad"); 
        const dn=actData.map((datos)=>({
          value: datos.idActi,
          label: datos.nomActi,
        }));

        setActividades(dn); 
    };
    const cargarComponentes= async ()=>{
      const com= await ApiService.traerDatos("componen");
      const dn=com.map((datos)=>({
        value: datos.idCompo,
        label: datos.nomCompo,
      }));
      setComponentes(dn);
    };
    const cargarDatosPadre = async() => {
      const datosRecibidos = JSON.parse(mantenimiento);
      setDatosPadre(datosRecibidos);
      if (datosRecibidos[0].accion==="editar") {
        const actMan= await ApiService.buscarDatos("activosManten",datosRecibidos[0].idMan);
        setListadoActivos(actMan);
      }

    }
   
    cagarProo();
    cargarDatosPadre();
    cargarComponentes(); }, []);

  
  //////////////////////////////////
  const buscarActivo = async(e)=>{
    setActivoSerieInput(e.target.value);
    const activo= await ApiService.buscarDatos("busActSerie",e.target.value);
    setActivosBusqueda(activo);
    if (estilos==true) {
      setEstilos(false);
      setActivoParaDetalle([]);
    }
  }
                           
  const colum=[
    {name:"Proceso de compra",selector:row=>row.idCompra},
    {name:"Serie",selector:row=>row.serieAct},
    {name:"Codigo de barras",selector:row=>row.codigoBarraAct},
    {name:"Marca",selector:row=>row.marcaAct},
    {name:"Modelo",selector:row=>row.modeloAct},
    {name:"Color",selector:row=>row.colorAct},
    {name:"Ubicacion",selector:row=>row.nomUbic},
    {name:"Opciones",cell:(row)=>
      (<div style={{ display: "flex", gap: "10px" }}>
        {estilos?(<p>Selecionado</p>)
        :( <button className={styles["secondary-button"]} onClick={()=>seleccionarActivo(row.serieAct)}>Selecionar</button>)}
      </div>
    ),ignoreRowClick: true},
  ];  

  const seleccionarActivo = (e)=>{
     const filtrado=activoBusqueda.filter(a=>a.serieAct===e);
     const listAact=listadoActivos.filter(l=>l.serieAct===filtrado[0].serieAct);
     if (listAact.length===0) {
      setActivoParaDetalle(filtrado);  
      setActivoSerieInput("");
      setActivosBusqueda(filtrado);
      setEstilos(true);
     }else{
      mostrarMensaje({title:"Activo ya detallado", text:"El activo seleccionado ya se encuentra en la lista",
        icon:"warning",timer:2000
      });
      
     }

  }
////////////////////////////////
  const AgregarActividadTabla =()=>{
   
    if (activoParaDetalle.length===0) {
      mostrarMensaje(
        {title: "Activo no seleccionado",
          text: "Primero debe asignar un activo ",
          icon: "error",
          timer:2500}
      );
    }else{
    if (datosEnvio.length===0) {
      mostrarMensaje(
        {title: "No se puede agregar",
          text: "Primero debe de selecionar una actividad",
          icon: "error",
          timer:2500}
      );
    }else{
    console.log(datosEnvio);
      const denv=datosEnvio.map(({value})=>({tipo:"act",valor:value}));
      setRecopilacionDetalles((dact)=>[...dact,...denv]);
      setdataTableActividades((datos)=>[...datos,...datosEnvio]);
      const idsEnvio = datosEnvio.map((item) => item.value); 
      const n = actividades.filter((acti) => !idsEnvio.includes(acti.value));
      setActividades(n);
      setdatosEnvio([]);
    };
  }
  }

const agregarValores=(val)=>{
  setdatosEnvio(val);
}

  const columasActividades=[
    {name:"Actividades realizadas",selector:row=>row.label},
    {name:"Eliminar",cell:(row)=>(<button className={styles["secondary-button"]} onClick={()=>devolverValores(row.value)}>Eliminar</button>),ignoreRowClick: true},
  ];

const devolverValores=(id)=>{
const n= dataTablaActividades.filter((row)=>row.value!==id);

setdataTableActividades(n);
  const nd= dataTablaActividades.filter((row)=>row.value===id);
  setActividades((datos)=>[...datos,...nd]);
 eliminarDetalle("act",id);
}

const eliminarDetalle = (tipo, valor) => {
  const eliminar = recopilacionDetalles.filter(
    (d) => !(d.tipo.includes(tipo) && String(d.valor).includes(valor)));
  setRecopilacionDetalles(eliminar);
};
/////////////////////////

const agregarValorCom = (val)=>{
  setdatosEnvioComp(val);
  console.log(val);
};

const columascomp=[
  {name:"Componente",selector:row=>row.label},
  {name:"Eliminar",cell:(row)=>(<button className={styles["secondary-button"]} onClick={()=>devolverValoresCom(row.value)}>Eliminar</button>),ignoreRowClick: true},
];

const AgregarComponenteTabla =()=>{
  if (activoParaDetalle.length===0) {
    mostrarMensaje(
      {title: "Activo no seleccionado",
        text: "Primero debe asignar un activo ",
        icon: "error",
        timer:2500}
    );
  }else{
  if (datosEnvioComp.length===0) {
    mostrarMensaje({
      title: "No se puede agregar",
      text: "Selecione un componente primero",
      icon: "error",
      timer:3200
    });
  }else{ 
    const denv=datosEnvioComp.map(({value})=>({tipo:"com",valor:value}));
    setRecopilacionDetalles((dact)=>[...dact,...denv]);
    setdataTablaCom((datos)=>[...datos,...datosEnvioComp]);
    const idsEnvio = datosEnvioComp.map((item) => item.value); 
    const n = componentes.filter((acti) => !idsEnvio.includes(acti.value));
    setComponentes(n);
    setdatosEnvioComp([]);
  }
}
}
const devolverValoresCom=(id)=>{
  const n= dataTablaCom.filter((row)=>row.value!==id);
    setdataTablaCom(n);
    const nd= dataTablaCom.filter((row)=>row.value===id);
    setComponentes((datos)=>[...datos,...nd]);
    eliminarDetalle("com",id);
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
const customStylesCambio = {
  table: {
    style: {
      width: '100%',
      minWidth: '1000px',
      maxWidth: '1100px',
      margin: '0 auto',
       tableLayout: 'fixed'
    },
  },
  headCells: {
    style: {
      backgroundColor: "#5207d4", 
      color: "#FFFFFF", // Color del texto (blanco)
      fontSize: "16px", // Tamaño de fuente
      fontWeight: "bold", // Texto en negrita
      textTransform: "capitalize", // Mayúsculas
    },
  },
};

///////////////////////

const tomarValorInput= (e)=>{
 setObservacion(e.target.value);
}

const agregarNuevoDettale= (e)=>{
  e.preventDefault();
  if (activoParaDetalle.length===0) {
    mostrarMensaje(
      {title: "Activo no seleccionado",
        text: "Primero debe asignar un activo ",
        icon: "error",
        timer:2500}
    );
  }else{

  if (recopilacionDetalles!=="") {
    const en=recopilacionDetalles.map(({ valor,tipo }) => `('${datosPadre[0].idMan}', '${activoParaDetalle[0].idActivo}', '${tipo}', '${valor}')`)
    .join(", ");
     setFormulario({...formulario,
     obs:observacion,datos:en,idMan:datosPadre[0].idMan,idAct:activoParaDetalle[0].idActivo,});
  }else{
    mostrarMensaje({
      title:"Datos vacios", icon:"error",text:" Debe de realizar minimo una accion",timer:2000,
    });
  }
}
}

useEffect (()=>{
  if (formulario.datos!=="") {
    
    const enviarValores= async()=>{
      if (editarMan) {
        const val=[{idManten:datosPadre[0].idMan , idAct:activoParaDetalle[0].idActivo}];
        const resde= await ApiService.borrarDatos("borrarDatosMantenimiento",val);
        const lista= listadoActivos.filter(l=>l.idActivo!==activoParaDetalle[0].idActivo);
        setListadoActivos(lista);
      }
        const res= await ApiService.enviarDatos("nuevoDetalleMantenimiento",formulario);
        borrarDatos();
        setListadoActivos((act)=>[...act,...activoParaDetalle]);
        mostrarMensaje({title:"Activo Agregado",timer:2000,icon:"success", text:"Se agrego correctamente"});
      }
    enviarValores();
    if (editarMan) {
      setEditarMan(false);
   }
    
  }
},[formulario]);



const borrarDatos= ()=>{
  setFormulario({...formulario,obs:"",datos:""});
  setRecopilacionDetalles([]);
  setObservacion("");
  setdataTablaCom([]);
  setdataTableActividades([]);
  setComponentes((com)=>[...com,...dataTablaCom]);
  setActividades((act)=>[...act,...dataTablaActividades]);
  setActivoParaDetalle([]);
  setEstilos(false);
  setActivosBusqueda([]);
  if (editarMan) {
    setEditarMan(false);
 }
}

const columasActivosFinales=[
  {name:"Proceso de compra",selector:row=>row.idCompra},
  {name:"Serie",selector:row=>row.serieAct},
  {name:"Codigo de barras",selector:row=>row.codigoBarraAct},
  {name:"Marca",selector:row=>row.marcaAct},
  {name:"Eliminar",cell:(row)=>(
    <div style={{ display: "flex", gap: "10px" }}>
  <button className={styles["secondary-button"]} onClick={()=>eliminarActivosManteniento(row.idActivo)}>Eliminar</button>
  <button className={styles["secondary-button"]} onClick={()=>funEditarManten(row.idActivo)}>Editar</button>
  </div>
  ),ignoreRowClick: true},
];

/////////////////////////

const funEditarManten= async (e)=>{
  const sel= listadoActivos.filter((act)=>act.idActivo==e);
  setActivoParaDetalle(sel);
  setActivosBusqueda(sel);
  setEstilos(true);
  const formulario={idman:datosPadre[0].idMan,idact:e};
  const valores = await ApiService.enviarDatos("histManEditAct",formulario);
  for (const val of valores) {

    if (val.tipoMD === "act") {
      const bus= actividades.filter((a)=>a.value==val.idReferencia);
      setdatosEnvio((act)=>[...act,...bus]);

    } else if (val.tipoMD === "com") {
      const bus= componentes.filter((a)=>a.value==val.idReferencia);
      setdatosEnvioComp((com)=>[...com,...bus]);

    } else {
       const obs = await ApiService.buscarDatos("busobserva", val.idReferencia);
       setObservacion(obs[0].campObvs);
    }
}
setEditarMan(true);
} 

useEffect(()=>{
  if (editarMan) {
    AgregarActividadTabla();
    AgregarComponenteTabla();
  }
},[editarMan]);

const eliminarActivosManteniento=async (e)=>{
 
    const res= await mostrarMensaje({
      icon: "info",
      title: "Eliminar Activo ",
      text: "Estas seguro que deseas eliminar el activo del mantenimiento",
      buttons: {
        cancel: "Cancelar", 
        confirm: {
          text: "Si",
          className: styles["primary-button"], 
        },
      },
    });

     if (res) {
        const val=[{idManten:datosPadre[0].idMan , idAct:e,}];
        const res= await ApiService.borrarDatos("borrarDatosMantenimiento",val);
        const lista= listadoActivos.filter(l=>l.idActivo!==e);
        setListadoActivos(lista);
    }
}

const finalizarProcesoMantenimiento= async()=>{
 if (listadoActivos.length===0) {
  mostrarMensaje({title:"Advertencia",text:"Ningun activo se ha agregado a este mantemiento", icon:"warning",timer:2500,});
  
 }else{
  const res= await mostrarMensaje({
    icon: "info",
    title: "Terminar Mantenimiento ",
    text: "Estas seguro que deseas finalizar",
    buttons: {
      cancel: "Cancelar", 
      confirm: 
      {
        text: "Finalizar", 
        className: styles["primary-button"],
      },
      
    },
  });
  if (res) {
  const val=[{idManten:datosPadre[0].idMan}];
  const res= await ApiService.actualizarDatos("actuMantenimiento",val[0]);
  mostrarMensaje({title:"Finalizado con exito",text:"Se ha finalizado el proceso de mantenimiento", icon:"success",timer:2500,});
  setActiveView("mantenimiento");

}
 }
}
const volverMantenVista= async()=>{
  const res= await mostrarMensaje({
    icon: "info",
    title: "Continuar despues ",
    text: "Estas seguro que desea continar en otro momento",
    buttons: {
      cancel: "Cancelar",
      confirm:{
        text: "Si", 
        className: styles["primary-button"],
      },
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
        PROCESO DE MANTENIMIENTO:{" "}
        {datosPadre.length === 0 ? "Cargando..." : datosPadre[0].codMant}
      </div>
      <div className={styles["actions-section"]}>
        {!editarMan && (
        <>
          <label htmlFor="activos">Ingresa la serie del activo</label>
          <input
            className={styles["text-inputactive"]}
            type="text"
            name="activo"
            id="activo"
            onChange={buscarActivo}
            value={activoSerieInput}
          />
        </>
      )}
      <DataTable
      pagination
      paginationPerPage={5}
      columns={colum} 
      data={activoBusqueda}
      noDataComponent="No ha selecionado ningun activo"
      persistTableHead 
      customStyles={estilos===false ? stylesTableActive:customStylesCambio}>
      </DataTable>
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
        className={styles["filter-select"]} />
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
        <div className={styles["actions-button"]}>

          <button className={styles["primary-button"]} onClick={agregarNuevoDettale}> {editarMan?"Editar":"Agregar"}</button>
          <button className={styles["primary-button"]} onClick={borrarDatos}> Cancelar</button>

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
