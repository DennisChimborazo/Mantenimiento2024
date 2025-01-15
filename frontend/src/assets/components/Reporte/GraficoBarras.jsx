import React from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const GraficoBarras = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May"], // Etiquetas
    datasets: [
      {
        label: "Estados de Mantenimientos",
        data: [30, 50, 60, 70, 90], // Datos de las barras
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return <Bar data={data} />;
};

export default GraficoBarras;
