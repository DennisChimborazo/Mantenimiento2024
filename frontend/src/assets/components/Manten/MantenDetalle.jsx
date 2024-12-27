import React, { useState, useEffect } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos.js";
import mostrarMensaje from "../Mensajes/Mensaje.js";

function MantenDetalle() {
  const [actividades, setActividades] = useState([]); 
  const [componentes, setComponentes] = useState([]); 

  const [datosEnvioComp, setdatosEnvioComp] = useState([]); 
  const [datosEnvio, setdatosEnvio] = useState([]); 

  const [dataTabla, setdataTable] = useState([]); 
  const [dataTablaCom, setdataTablaCom] = useState([]); 


  useEffect(() => {
    const cagarProo = async () => {
        const actData = await ApiService.traerDatos("actividad"); 
        setActividades(actData); 
    };
    const cargarComponentes= async ()=>{
      const com= await ApiService.traerDatos("componen");
      setComponentes(com);
    };
    cagarProo();
    cargarComponentes();

  }, []);
////////////////////////////////
  const buttonAgregarProv =(e)=>{
    e.preventDefault();
if (datosEnvio.length===0) {
  mostrarMensaje(
    {title: "No se puede agregar",
      text: "Primero debe de selecionar una actividad",
      icon: "error",
      timer:2500}
  );
}else{
    const dn=datosEnvio.map((datos)=>({
      idActi: datos.value,
      nomActi: datos.label,
    }));
    
    setdataTable((datos)=>[...datos,...dn]);
    const idsEnvio = dn.map((item) => item.idActi); 
    const n = actividades.filter((acti) => !idsEnvio.includes(acti.idActi));
    setActividades(n);
    setdatosEnvio([]);
  };}


const agregarValores=(val)=>{
  setdatosEnvio(val);
}

  const columas=[
    {name:"Actividades realizadas",selector:row=>row.nomActi},
    {name:"Eliminar",cell:(row)=>(<button onClick={()=>devolverValores(row.idActi)}>Eliminar</button>),ignoreRowClick: true},
  ];

const devolverValores=(id)=>{

const n= dataTabla.filter((row)=>row.idActi!==id);
  setdataTable(n);
  const nd= dataTabla.filter((row)=>row.idActi===id);
  setActividades((datos)=>[...datos,...nd]);
}
/////////////////////////

const agregarValorCom = (val)=>{
  setdatosEnvioComp(val);
};

const columascomp=[
  {name:"Componente",selector:row=>row.nomCompo},
  {name:"Eliminar",cell:(row)=>(<button onClick={()=>devolverValoresCom(row.idCompo)}>Eliminar</button>),ignoreRowClick: true},
];

const buttonAgregarCompo =(e)=>{
  e.preventDefault();
  if (datosEnvioComp.length===0) {
    mostrarMensaje({
      title: "No se puede agregar",
      text: "Selecione un componente primero",
      icon: "error",
      timer:3200
    });
  }else{
    const dn=datosEnvioComp.map((datos)=>({
      idCompo: datos.value,
      nomCompo: datos.label,
    }));
    setdataTablaCom((datos)=>[...datos,...dn]);
    const idsEnvio = dn.map((item) => item.idCompo); 
    const n = componentes.filter((acti) => !idsEnvio.includes(acti.idCompo));
    setComponentes(n);
    setdatosEnvioComp([]);
  }
}
const devolverValoresCom=(id)=>{
  console.log(id);
  const n= dataTablaCom.filter((row)=>row.idCompo!==id);
    setdataTablaCom(n);
    const nd= dataTablaCom.filter((row)=>row.idCompo===id);
    setComponentes((datos)=>[...datos,...nd]);
  }
  const customStyles = {
  headCells: {
    style: {
      backgroundColor: "#7c181a", // Color de fondo (verde ejemplo)
      color: "#FFFFFF", // Color del texto (blanco)
      fontSize: "16px", // Tamaño de fuente
      fontWeight: "bold", // Texto en negrita
      textTransform: "uppercase", // Mayúsculas
    },
  },
};

  return (

    <div className="MantenDetalle">
      <h2>DETALLE MANTENIMIENTO</h2>
      <div>
        <label htmlFor="actividad">Actvidades</label>
      <Select
        isMulti
        closeMenuOnSelect={false}
        options={actividades.map((acti) => ({
          value: acti.idActi,
          label: acti.nomActi,
        }))}
        placeholder="Selecciona una actividad"
        onChange={agregarValores}
        value={datosEnvio}
      />
      <button onClick={buttonAgregarProv}>Agregar</button>
      
      <br />
      <DataTable 
      pagination
      paginationPerPage={5}
      columns={columas} 
      data={dataTabla}
      noDataComponent="No ha selecionado ninguna actividad"
      persistTableHead 
      customStyles={customStyles}>
      </DataTable>
    </div>
      <div>
        <label htmlFor="componentes">Componentes</label>
        <Select
        isMulti
        closeMenuOnSelect={false}
        options={componentes.map((com) => ({
          value: com.idCompo,
          label: com.nomCompo,
        }))}
        placeholder="Selecciona un componente"
        onChange={agregarValorCom}
        value={datosEnvioComp}
      />
      <button onClick={buttonAgregarCompo}>Agregar</button>
      
      <br />
      <DataTable 
      pagination
      paginationPerPage={5}
      columns={columascomp} 
      data={dataTablaCom}
      noDataComponent="No ha selecionado ningun componente"
      persistTableHead >
        
      </DataTable>
      
    </div>
    
      <label htmlFor="observacion">Observacion:</label>
    <textarea 
        id="observacion" 
        name="observacion" 
        rows="10" 
        cols="110" 
        placeholder="Detalle alguna observacion">
    </textarea>

    </div>
  );
}

export default MantenDetalle;
