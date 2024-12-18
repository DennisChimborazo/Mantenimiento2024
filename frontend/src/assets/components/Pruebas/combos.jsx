import React, { useState, useEffect } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos.js";

function combos() {
  const [actividades, setActividades] = useState([]); 
  const [dataTabla, setdataTable] = useState([]); 
  const [datosEnvio, setdatosEnvio] = useState([]); 

  useEffect(() => {
    const cagarProo = async () => {
        const actData = await ApiService.traerDatos("proovedor"); 
        setActividades(actData); 
    };
    cagarProo();

  }, []);

  const buttonAgregarProv =(e)=>{
    e.preventDefault();

    const dn=datosEnvio.map((datos)=>({
      idProveedor: datos.value,
      nomProveedor: datos.label,
    }));
    
    setdataTable((datos)=>[...datos,...dn]);
    const idsEnvio = dn.map((item) => item.idProveedor); 
    const n = actividades.filter((acti) => !idsEnvio.includes(acti.idProveedor));
    setActividades(n);
    setdatosEnvio([]);
  };

const agregarValores=(val)=>{
  setdatosEnvio(val);
}

  const columas=[
    {name:"id",selector:row=>row.idProveedor},
    {name:"Provedor",selector:row=>row.nomProveedor},
    {name:"Eliminar",cell:(row)=>(<button onClick={()=>devolverValores(row.idProveedor)}>Eliminar</button>),ignoreRowClick: true},
  ];

const devolverValores=(id)=>{

const n= dataTabla.filter((row)=>row.idProveedor!==id);
setdataTable(n);
const nd= dataTabla.filter((row)=>row.idProveedor==id);
setActividades((datos)=>[...datos,...nd]);

}
  return (

    <div className="MantenDetalle">
      <h2>PRUEBA DETALLE MANTENIMIENTO</h2>
      <div>
        <label htmlFor="Proveedor">Proveedor</label>
      <Select
        isMulti
        closeMenuOnSelect={false}
        options={actividades.map((acti) => ({
          value: acti.idProveedor,
          label: acti.nomProveedor,
        }))}
        placeholder="Selecciona un Proveedor"
        onChange={agregarValores}
        value={datosEnvio}
      />
      <button onClick={buttonAgregarProv}>Agregar</button>
      
      <br />
      <DataTable 
      pagination
      paginationPerPage={6}
      columns={columas} 
      data={dataTabla}
      noDataComponent="No selecionado ningun valor"
      persistTableHead >
        
      </DataTable>
      </div>

    </div>
  );
}

export default combos;
