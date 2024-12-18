import React from "react";
import swal from "sweetalert";

function ActivoEditarVista() {

    const mensaje =()=>{
      swal({
          title:"ERROR",
          text: "Contraseña u usuario incorrecta",
          icon:"warning",
          timer: "3600"
      });

    };
  return (
    <div><h2> hola mundo</h2>
    <button onClick={()=>mensaje()}>HAS click</button></div>
  );
}

export default ActivoEditarVista;
