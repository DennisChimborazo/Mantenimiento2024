import { useEffect, useState } from "react";
import ApiService from "../../Services/ApiMetodos";
import DataTable from "react-data-table-component";

function MantenHistorial({setActiveView,mantenimiento}) {
    const [datosPadre,setDatosPadre]=useState([]);
  const [datosMantenimiento, setDatosMantenimiento] = useState([]);

  useEffect(() => {
    const cargarYTraerDatos = async () => {
      const datos = JSON.parse(mantenimiento);
      setDatosPadre(datos);
      console.log(datos);
  
      if (datos.idManten) {
        const activo = await ApiService.buscarDatos("historialManten",datos.idManten)
        setDatosMantenimiento(activo);
      }
    };
    cargarYTraerDatos();
  }, []);

   const datosColumna = [
    {name:"Serie",selector:row=>row.serieAct, width: "150px",},
    {name: "Actividades",
      cell: (row) => (
        <div>
          <ul>
            {row.actividad
              ? row.actividad.split(", ").map((a) => (
                  <li>{a}</li>
                ))
              : <li>No hay actividades</li>}
          </ul>
        </div>),},
         {name: "Componentes",
            cell: (row) => (
              <div>
                <ul>
                  {row.componente
                    ? row.componente.split(", ").map((a) => (
                        <li>{a}</li>
                      ))
                    : <li>No hay componentes</li>}
                </ul>
              </div>),},
               {name: "Observacion",
                cell: (row) => (
                  <div>
                    <ul>
                      {row.observacion
                        ? <li>{row.observacion}</li>
                        : <li>No hay observaciones</li>}
                    </ul>
                  </div>),},

  ];

const buscarActivo = async (e)=>{
    const formulario=[{idman:datosPadre.idManten,idserie:e.target.value}];
    const busqueda= await ApiService.buscarDatos("histManSerie",formulario);
    console.log(busqueda);
    setDatosMantenimiento(busqueda);
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
    <div className="MantenHistorial">
        <h2>Detalle de Mantenimiento: {" "} {datosPadre.length === 0 ? "Cargando..." : datosPadre.codManten}</h2>
        <div>
        <label htmlFor=""> fecha inicio: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.fechaInico}</p>
        <label htmlFor=""> fecha Final: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.fechaFin}</p>
        <label htmlFor=""> Responsable: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.nombreResponsable}</p>
        <label htmlFor=""> Estado: </label>
        <p>{datosPadre.length === 0 ? "Cargando..." : datosPadre.nomEstado}</p>
        
        </div>
      <label htmlFor="busAct">Buscar activo</label>

      <input type="text" name="busAct" id="busAct" onChange={buscarActivo} />

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
