import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ApiService from "../../Services/ApiMetodos";

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoPastelComAct = ({ valoresPadre }) => {
  const [actividad, setActividad] = useState(0);
  const [componente, setComponente] = useState(0);
  const [observacion, setObservacion] = useState(0);

  useEffect(() => {
    const medirProsentaje =async () => {
        const val=  await ApiService.buscarDatos("buscarCantidadAcciones",valoresPadre);
        if (val.length===0) {
            setActividad(0)
            setComponente(0)
            setObservacion(0)
        }else{
            setActividad(val[0].cantidad)
            setComponente(val[1].cantidad)
            setObservacion(val[2].cantidad)
        }
        
    };
    
    medirProsentaje();
  }, [valoresPadre]); // Depende de valoresPadre

  const data = {
    labels: ["Actividades: "+actividad, "Componentes: "+componente,"Observaciones: "+observacion], // Etiquetas
    datasets: [
      {
        label: "Estados Mantenimientos",
        data: [actividad, componente,observacion], // Datos
        backgroundColor: ["#FF5733", "#33FF57", "#3357FF", "#FFEB33"], // Colores
      },
    ],
  };

  return <Pie data={data} />;
};

export default GraficoPastelComAct;
