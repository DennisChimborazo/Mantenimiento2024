import { useState, useEffect } from "react";
import Select from "react-select";
import mostrarMensaje from "../Mensajes/Mensaje";
import ApiService from "../../Services/ApiMetodos";

function ModalEdInfManten({ onClose, setInforMantenimiento, datosPadre }) {
  const [formulario, setFormulario] = useState({idManten:"", proMant: "", fInicio: "", tipo: "", responsable: "" });
  const [responsable, setResponsable] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [labelCombo, setLabelCombo] = useState("");

  useEffect(() => {

    if (datosPadre && datosPadre.length > 0) {
      const datosEditar=datosPadre[5];
      const proovedorPad=datosPadre[1];
      const personalPad=datosPadre[2];
     
       setProveedor(proovedorPad);
       setPersonal(personalPad);
      let datosResponsable={};
       if (datosEditar[0].tipo==="in") {
      setResponsable(personalPad); 
      datosResponsable=personalPad.filter((p)=>p.nombre===datosEditar[0].nombreResponsable);
       }else{
        setResponsable(proovedorPad); 
      datosResponsable=proovedorPad.filter((p)=>p.nombre===datosEditar[0].nombreResponsable);
       }
       const val={value:"",label:datosResponsable[0].nombre};
        setLabelCombo(val);
        setFormulario({
          ...formulario,idManten:datosEditar[0].idManten,
          fInicio:datosEditar[0].fechaInico,
          proMant:datosEditar[0].codManten,
          tipo: datosEditar[0].tipo,
          responsable:datosResponsable[0].clave
        });
    }
  }, []); 

  const asignarValorFormulario = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  const cargarResponsable = (e) => {
    let tip = "";
    if (e.target.checked) {
      setResponsable(proveedor);
      tip = "ex";
    } else {
      setResponsable(personal);
      tip = "in";
    }
    setFormulario({
      ...formulario,
      responsable: "",
      tipo: tip,
    });
    setLabelCombo("");
  };

  const valorCombo = (val) => {
    setLabelCombo(val);
    setFormulario({
      ...formulario,
      responsable: val.value,
    });
  };

  const guardarMantenimiento = async () => {
    
    if (formulario.proMant===""||formulario.fInicio===""||formulario.responsable==="") {
        mostrarMensaje({
            title: "Campos faltantes",
            text: "Es obligatorio llenar todos los campos",
            icon: "error",
            timer: 3200,
        });
    }else{
      const res= await mostrarMensaje({
        icon: "info",
        title: "Actualizar",
        text: "Esta seguro de actualizar la informacion",
        buttons: { cancel: "Cancelar",confirm:{text: "continuar",},},
      });
  
      if (res) {
        const resApi = await ApiService.actualizarDatos("actuInfManten", formulario);
        if (resApi) {
            mostrarMensaje({
                title: "Actualizacion exitosa",
                text: "Se ha actualizado la informacion ",
                icon: "success",
                timer: 2200,
            });
            setInforMantenimiento((prevState) => [
              {
                ...prevState[0], // Mantiene los valores actuales del objeto en la posición 0
                codManten: formulario.proMant,          // Cambia solo el valor de codManten
                fechaInico: formulario.fInicio,         // Cambia solo el valor de fechaInico
                nombreResponsable: labelCombo.label, // Cambia solo el valor de nombreResponsable
                tipo: formulario.tipo,                  // Cambia solo el valor de tipo
              },
            ]);
            onClose(); 
        }
      }

    }
  };

  const cerrarModal = () => {
    onClose(); // Llama a la función onClose para cerrar el modal
  };

  return (
    <div>
      <div className="">
        <p>Editar Mantenimiento</p>
        <div className="">
          <div className="">
            <label htmlFor="proMant">Proceso:</label>
            <input
              type="text"
              name="proMant"
              id="proMant"
              onChange={asignarValorFormulario}
              required
              value={formulario.proMant}
            />
          </div>
          <div className="">
            <label htmlFor="fInicio">Fecha de inicio</label>
            <input
              type="date"
              name="fInicio"
              id="fInicio"
              onChange={asignarValorFormulario}
              required
              value={formulario.fInicio}
            />
          </div>
          <div className="">
            <label htmlFor="Tipo">Agente externo
              <input
                type="checkbox"
                onChange={(e) => cargarResponsable(e)}
                name="checResp"
                id="checResp"
              />
            </label>
          </div>
          <div className="">
            <label htmlFor="responsable">Responsable:</label>
            <Select
              options={responsable.map((r) => ({
                value: r.clave,
                label: r.nombre,
              }))}
              placeholder="Seleccione"
              onChange={valorCombo}
              value={labelCombo}
            />
          </div>
          <div className="">
            <button className="" onClick={cerrarModal}>Cancelar</button>
            <button className="" onClick={guardarMantenimiento}>Editar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalEdInfManten;
