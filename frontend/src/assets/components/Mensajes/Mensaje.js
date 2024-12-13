import swal from "sweetalert";

const mostrarMensaje = ({ title = "Información", text = "", icon = "info", timer = null }) => {
  swal({
    title,
    text,
    icon,
    timer,
    buttons: timer ? false : true, // Oculta los botones si hay temporizador
  });
};

export default mostrarMensaje;
