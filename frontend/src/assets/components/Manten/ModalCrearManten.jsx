import { useState, useEffect } from "react";
import Select from "react-select";
import mostrarMensaje from "../Mensajes/Mensaje";
import ApiService from "../../Services/ApiMetodos";

function ModalCrearManten({ onClose, setActiveView, setDatosMantenimiento, datosPadre }) {
  const [formulario, setFormulario] = useState({idManten:"", proMant: "", fInicio: "", tipo: "", responsable: "" });
  const [responsable, setResponsable] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [proveedor, setProveedor] = useState([]);
  const [labelCombo, setLabelCombo] = useState("");

  useEffect(() => {
    if (datosPadre && datosPadre.length > 0) {
      const prove=datosPadre[1];
      const perso=datosPadre[2];
      setProveedor(prove);
      setPersonal(perso);
      setResponsable(perso); 
      setFormulario({
        ...formulario,
        tipo: "in",
      });
    }
  }, []); // Recalcular solo cuando los datosPadre cambian

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
    
        const res = await ApiService.enviarDatos("nuevoMantenimiento", formulario);
        if (res) {
            mostrarMensaje({
                title: res.message,
                text: "Se ha creado un nuevo proceso de mantenimiento",
                icon: "success",
                timer: 2200,
            });
          
            const datosRes=[{codManten:formulario.proMant,edit:true,fechaFin:"S/N",
              fechaInico:formulario.fInicio,idManten:res,nomEstado:"En proceso",
              nombreResponsable:labelCombo.label,tipo:formulario.tipo}];
              console.log(datosRes);
            setDatosMantenimiento([...datosPadre,datosRes]);
           setActiveView("MantenProceso");
        }
    
    }
    //setDatosMantenimiento(formulario); // Pasamos el formulario como objeto, no como string
    
//    setFormulario({
//     ...formulario,
//     idMan: res,
//   });
 
  };
  const cerrarModal = () => {
    onClose(); // Llama a la función onClose para cerrar el modal
  };

  return (
    <div>
      <div className="">
        <p>Nuevo Mantenimiento</p>
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
            <button className="" onClick={guardarMantenimiento}>Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCrearManten;
