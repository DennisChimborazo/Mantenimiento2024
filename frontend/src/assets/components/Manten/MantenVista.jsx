import {React,useState,useEffect} from "react";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos";
import Select from "react-select";

function MantenVista({ setActiveView }) {

 const [mantenientos,setMantemientos]= useState([]);
 const datosPrueba=[{value:"1",label:"opcion 1"}];

    useEffect(()=>{

    const cargarDatos = async ()=>{
      const mant= await ApiService.traerDatos("datosManten");
      console.log("api "+mant);
      setMantemientos(mant);
      console.log(mantenientos);
    }
 
    cargarDatos();
   },[]);
 //// Columnas de mi tabla Mantenimientos
 const columas=[
  {name:"Mantenimiento",selector:row=>row.codManten},
  {name:"Fecha de inicio",selector:row=>row.fechaInico},
  {name:"Fecha de finalizacion",selector:row=>row.fechaFin},
  {name:"estado",selector:row=>row.nomEstado},
  {name:"responsable",selector:row=>row.nombreResponsable},
  {name:"Opciones",cell:(row)=>
    (<div style={{ display: "flex", gap: "10px" }}>
      <button>Editar</button>
      <button >Detalles</button>
    </div>
  ),ignoreRowClick: true},
 ];
 

  return (
    <div className="MantenPrincipal">
      <h2> Mantenimientos de Activos</h2>
      <div> 
        <div> 
          <label htmlFor="">filtro 1</label>
          <Select
          options={datosPrueba}
          />
          <label htmlFor="">filtro 2</label>
          <Select
          options={datosPrueba}
          />
          <label htmlFor="">filtro 3</label>
          <Select
          options={datosPrueba}
          />
          <label htmlFor="">filtro 4</label>
          <Select
          options={datosPrueba}
          />

          </div>   
        <div>
        <input type="text" name="buscar" id="buscar" />
        <button> buscar </button>
        <button onClick={() => setActiveView("crearMantenimiento")}> Nuevo Mantenimiento</button>
      
        </div>
          <DataTable
            pagination
            paginationPerPage={10}
            columns={columas}
            data={mantenientos}
            noDataComponent="No ha selecionado ningun Mantenimiento"
            persistTableHead />
    </div>

      </div>
  );
}

export default MantenVista;
