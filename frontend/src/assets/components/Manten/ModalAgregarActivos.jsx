import { useEffect,useState } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import ApiService from "../../Services/ApiMetodos";
import mostrarMensaje from "../Mensajes/Mensaje";
import { FcOk,FcFullTrash,FcClearFilters } from "react-icons/fc";

function ModalAgregarActivos({ onClose,inforMantenimiento,activos,setRefrescar,activosProceso }){

  const [activosSelecionados,setActivosSelecionados]= useState([]);
  const [activosBase,setActivosBase]= useState([]);
  const [estadoObservacion,setEstadoObservacion]= useState(false);
  const [datosGenerales,setDatosGenerales]= useState([]);
  const [formulario,setFormulario]= useState("");
  const [inpBuscarSerie,setInpBuscarSerie]=useState("");
  const [inpBuscarCodigo,setInpBuscarCodigo]=useState("");

  const [activosComprob,setaActivosComprob]=useState([]);
  const [bienes,setBienes]= useState([]);
  const [bienesSelect,setBienesSelect]= useState([]);

  const [valorComboTipoBien,setValorComboTipoBien]=useState("");
  const [valorComboBien,setValorComboBien]=useState("");


    
useEffect(()=>{
        const cargarDatos=()=>{
            const valores= activos;
            console.log(valores);
            const valNuevos= valores.map((val)=>({
                ...val,estSeleccion: false, 
            }));
            setActivosBase(valNuevos);
            setaActivosComprob(activosProceso);
        }
        const cargarDatosTipoBien= async()=>{
          const inf= await ApiService.traerDatos("bien");
          setBienes(inf);

        }
        cargarDatosTipoBien();
        cargarDatos();
    },[]);

    useEffect(()=>{
        if (estadoObservacion) {
            setDatosGenerales(activosSelecionados);
        }else{
            setDatosGenerales([]);
        }

    },[estadoObservacion]);
    const tipoBien=[{value:1,label:"Informatica"},{value:2,label:"Oficina"},{value:3,label:"Limpieza"}];
  
    const columaActivos=[
        {name:"Proceso de compra",selector:row=>row.idCompra},
        {name:"Serie",selector:row=>row.serieAct},
        {name:"Codigo de barras",selector:row=>row.codigoBarraAct},
        {name:"Bien",selector:row=>row.nombien},
        {name:"Marca",selector:row=>row.marcaAct},
        {name:"Modelo",selector:row=>row.modeloAct},
        {name:"Color",selector:row=>row.colorAct},
        {name:"Ubicacion",selector:row=>row.nomUbic},
        {name:"Opciones",cell:(row)=>
          (<div style={{ display: "flex", gap: "10px" }}>
            {row.estSeleccion?(
              <FcFullTrash  size={25} onClick={()=>eliminarActivo(row.idActivo)}></FcFullTrash>
            ):(
              <FcOk size={25} onClick={()=>agregarActivo(row.idActivo)}></FcOk>

            )}
          </div>
        ),ignoreRowClick: true},
      ];  

  const agregarActivo=(id)=>{
    const busDupli= activosComprob.filter((a)=>a.idActivo===id);
    if (busDupli.length!==0) {
      mostrarMensaje({title:"Activo incluido",
        text:"ya pertenece al proceso de mantenimiento",icon:"info",timer:2000});
    }else{
      const bus= activosBase.filter((act)=>act.idActivo===id);
      const retirarDatos=activosBase.filter((ac)=>ac.idActivo!==id);
      setActivosBase(retirarDatos);
      mostrarMensaje({title:"Selecionado",text:"Ha selecionado un activo",icon:"success",timer:2000});
      bus[0].estSeleccion=true;
      setActivosSelecionados((actSel)=>[...actSel,...bus]);
    }
  }


const eliminarActivo= async(id)=>{
    const res= await mostrarMensaje({
        icon: "info",
        title: "Retirar ",
        text: "Esta seguro de retirar el activo",
        buttons: {cancel: "Cancelar",confirm:{text: "Retirar",},},
      });

      if (res) {
        const retirarDatos=activosSelecionados.filter((ac)=>ac.idActivo!==id);
        setActivosSelecionados(retirarDatos);
        const bus= activosSelecionados.filter((act=>act.idActivo===id));
        bus[0].estSeleccion=false;
        setActivosBase((actSel)=>[...actSel,...bus]);
      }
  }  


 const observarActivos=()=>{
    setInpBuscarSerie("");
    setEstadoObservacion((prev) => !prev); 
 }
 const filtoTipoBien=(e)=>{
  setInpBuscarCodigo("")
  setInpBuscarSerie("")
  setValorComboTipoBien(e);
  const fil= bienes.filter((ac)=>ac.idtipBien===e.value);
  setBienesSelect(fil);
 const bus=activosBase.filter((ac)=>ac.idtipBien===e.value);
 setDatosGenerales(bus);

 }
 const filtoBienes=(e)=>{
  setValorComboBien(e);
  const bus=activosBase.filter((ac)=>ac.idbien===e.value);
  setDatosGenerales(bus)
 }

 const filtroCodigoBarra=(id)=>{
  setValorComboBien("")
  setValorComboTipoBien("")
  setInpBuscarSerie("")
  setBienesSelect([]);
  setInpBuscarCodigo(id.target.value)
    if (id.target.value==="") {
        setDatosGenerales([]);
    }else{
    const bus=activosBase.filter((ac)=>ac.codigoBarraAct.startsWith(id.target.value));
    setDatosGenerales(bus);
 }
}

const filtroSerie=(id)=>{
      setValorComboBien("");
      setValorComboTipoBien("");
      setInpBuscarCodigo("");
      setBienesSelect([]);
    setInpBuscarSerie(id.target.value);
    if (id.target.value==="") {
        setDatosGenerales([]);
    }else{
    const bus=activosBase.filter((ac)=>ac.serieAct.startsWith(id.target.value));
    setDatosGenerales(bus);
 }
}

const guardarDatos= async ()=>{
    if (activosSelecionados.length===0) {
        mostrarMensaje({title:"Sin activos",text:"Debe selecionar como minimo 1 activo",timer:2000,icon:"info"});
    }else{
        const res= await mostrarMensaje({
            icon: "info",
            title: "Agregar los Activo ",
            text: "Estas seguro que deseas continuar",
            buttons: {
              cancel: "Cancelar", 
              confirm: 
              {
                text: "Finalizar", 
              },
              
            },
          });
          if (res) {
            const envio=activosSelecionados.map(({ idActivo }) => `( '${inforMantenimiento[0].idManten}', '${idActivo}','3')`)
            .join(", ");
            setFormulario({formEnv:envio});
          }
    }
 }

useEffect(()=>{
  const ejecutar= async ()=>{
    if (formulario!=="") {
        const res= await ApiService.enviarDatos("guarMantenActiv",formulario);
        setRefrescar(true);
        onClose();
      }
    }
    ejecutar();

  },[formulario]);

 const cerrarModal = async() => {
    if (activosSelecionados.length!==0) {
        
    const res= await mostrarMensaje({
        icon: "info",
        title: "Cerrar  ",
        text: "Esta seguro de cerrar la ventana tiene activos que aun no ha guardado",
        buttons: {cancel: "Cancelar",confirm: { text: "Retirar",},},
      });
      
      if (res) {
        if (onClose) {onClose();}
      }

    }else{
        if (onClose) {onClose();}
    }
  
  };

  const limpiarFiltros=()=>{
    setValorComboBien("")
    setValorComboTipoBien("")
    setInpBuscarSerie("")
    setInpBuscarCodigo("")
    setBienesSelect([]);
    setDatosGenerales([])

  }
    return (<div>
                <div>
                <label htmlFor="filtro1">Tipo de bien</label>
                <Select
                value={valorComboTipoBien}
                options={tipoBien}
                placeholder="Seleccione tipo"
                onChange={filtoTipoBien}
                ></Select>
                <label htmlFor="filtro1">Bien</label>
                <Select
                value={valorComboBien}
                placeholder="Seleccione tipo"
                onChange={filtoBienes}
                options={bienesSelect.map((acti) => ({
                  value: acti.idbien,
                  label: acti.nombien,
                }))}
                ></Select>
                <label htmlFor=""> codigo barras</label>
                <input type="text" onChange={filtroCodigoBarra} value={inpBuscarCodigo} />
                <label htmlFor=""> serie</label>
                <input type="text" onChange={filtroSerie} value={inpBuscarSerie}/>
                <FcClearFilters size={30} onClick={limpiarFiltros} />
                
                </div>
                <div>
                    <button onClick={observarActivos}>Activos Selecionados</button>
                    <button onClick={cerrarModal}> Cerrar</button>
                    <button onClick={guardarDatos}>Guardar</button>
                </div>
                <DataTable 
                pagination
                paginationPerPage={7}
                columns={columaActivos} 
                data={datosGenerales}
                noDataComponent="No ha selecionado ningun Activo"
                persistTableHead/>

    </div>);


}


export default ModalAgregarActivos;