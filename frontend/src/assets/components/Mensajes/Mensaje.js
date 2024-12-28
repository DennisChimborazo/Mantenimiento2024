import swal from "sweetalert";

const mostrarMensaje = ({ 
  title = "Información", 
  text = "", 
  icon = "info", 
  timer = null, 
  buttons = timer ? false : true // Si hay temporizador, oculta los botones por defecto
}) => {
  return swal({
    title,
    text,
    icon,
    timer,
    buttons, // Usa directamente el valor de buttons
  });
};

export default mostrarMensaje;
// success error warning info