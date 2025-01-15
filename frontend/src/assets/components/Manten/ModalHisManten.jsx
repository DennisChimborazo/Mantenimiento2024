import React ,{useEffect, useState}from "react";
import DataTable from "react-data-table-component";
import styles from './ModalDetallesMantenestilos.module.css'; // Importa el CSS Module
import ApiService from "../../Services/ApiMetodos";
import { TiArrowBack } from "react-icons/ti";


function ModalHisManten({onClose,datosHistorial}) {
    const [datosMantenimiento, setDatosMantenimiento] = useState([]);
    useEffect(()=>{
        const cargarInformacion=async()=>{
            const activo = await ApiService.buscarDatos("historialManten", datosHistorial[0].idManten)
            setDatosMantenimiento(activo);
        }
        cargarInformacion();
    },[]);
    
    const datosColumna = [
        { name: "Serie", selector: row => row.serieAct, width: "90px" },
        {
          name: "Actividades",width: "200px",
          cell: (row) => (
            <div>
              <ul>
                {row.actividad
                  ? row.actividad.split(", ").map((a, index) => (
                    <li key={index}>{a}</li> // Aquí se añadió el key
                  ))
                  : <li>No hay actividades</li>}
              </ul>
            </div>
          ),
        },
        {
          name: "Componentes", width: "200px",
          cell: (row) => (
            <div>
              <ul>
                {row.componente
                  ? row.componente.split(", ").map((a, index) => (
                    <li key={index}>{a}</li> // Aquí también se añadió el key
                  ))
                  : <li>No hay componentes</li>}
              </ul>
            </div>
          ),
        },
        {
          name: "Observacion",width: "200px",
          cell: (row) => (
            <div>
              <ul>
                {row.observacion
                  ? <li>{row.observacion}</li>
                  : <li>No hay observaciones</li>}
              </ul>
            </div>
          ),
        },
    ];

    return (
        <div className={styles.modalContainer}>
            <TiArrowBack size={30} onClick={()=>onClose()} />
            <DataTable
                columns={datosColumna}
                data={datosMantenimiento}
                pagination
                paginationPerPage={4}
                noDataComponent="No hay activo registrados"
                persistTableHead
            />
        </div>
    );
}

export default ModalHisManten; // Solo exportar la referencia a la función, no su ejecución.
