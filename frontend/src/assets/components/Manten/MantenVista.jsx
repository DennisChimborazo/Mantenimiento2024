import {React,useState} from "react";
import DataTable from "react-data-table-component";
function MantenVista() {
 const [mantenientos,setMantemientos]= useState([]);

 //// Columnas de mi tabla Mantenimientos
 const columas=[
  {name:"Componente",selector:row=>row.nomCompo},
  {name:"Eliminar",cell:(row)=>
    (<button onClick={()=>devolverValoresCom(row.idCompo)}>Eliminar</button>),ignoreRowClick: true},
 ];
 

  return (
    <div className="MantenPrincipal">
      <h2> Mantenimientos esta área se encuentra en poceso de desarrollo</h2>
      <DataTable
       pagination
       paginationPerPage={28}
      columns={columas}
      data={mantenientos}
      noDataComponent="No ha selecionado ningun Mantenimiento"
      persistTableHead 
      />

      </div>
  );
}

export default MantenVista;
