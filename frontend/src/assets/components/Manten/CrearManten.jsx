import { useState, useEffect } from "react";
import Select from "react-select";
import mostrarMensaje from "../Mensajes/Mensaje.js";
import ApiService from "../../Services/ApiMetodos.js";
import styles from "./CrearMantenimientoEstilos.module.css"; // Importación de estilos locales


function CrearManten({ setActiveView, setSelectedMantenimiento }) {
    const [respons, setRespons] = useState([]);
    const [formulario, setFormulario] = useState({ proMant: "", fInicio: "", fFinal: "", tipo: "", responsable: "" });
    const [personal, setPersonal] = useState([]);
    const [proveedor, setProveedor] = useState([]);
    const [selNuevaOpcion, setSelNuevaOpcion] = useState("");


    useEffect(() => {
        const cargarDatos = async () => {
            let prov = await ApiService.traerDatos("proovedor");
            const provConvertido = prov.map((d) => ({
                clave: d.idProveedor,
                nombre: d.nomProveedor,
            }));

            setProveedor(provConvertido);

            let per = await ApiService.traerDatos("responsable");
            let perConvertido = per.map((d) => ({
                clave: d.idPers,
                nombre: d.nomPers,
            }));
            setPersonal(perConvertido);

            setRespons(perConvertido);
            setFormulario({ ...formulario, tipo: "in", });
        }
        cargarDatos();
    }, []);

    const cargarResponsable = (e) => {
        let tip = "";
        if (e.target.checked) {
            setRespons(proveedor);
            tip = "ex";
        } else {
            setSelNuevaOpcion(null);
            setRespons(personal);
            tip = "in";
        }
        setFormulario({
            ...formulario, responsable: "", tipo: tip,
        });
        setSelNuevaOpcion(null);
    }

    const valorCombo = (val) => {
        setSelNuevaOpcion(val);
        setFormulario({
            ...formulario, responsable: val.value,
        });
    }
    const asignarValorFormulario = (e) => {
        setFormulario({
            ...formulario, [e.target.name]: e.target.value,
        });
    }

    const guardar = async (e) => {
        e.preventDefault();
        const datos = [{ idMan: "1", codMant: "HOla mundo" }];
                console.log(datos);
                setSelectedMantenimiento(JSON.stringify(datos));
                setActiveView("detalleMantenimiento");
        /*
        if (formulario.responsable === "" || formulario.fInicio === "" || formulario.fFinal === "" || formulario.proMant === "") {
            mostrarMensaje({
                title: "Campos faltantes",
                text: "Es obligatorio llenar todos los campos",
                icon: "error",
                timer: 3200
            });
        } else {

            const res = await ApiService.enviarDatos("nuevoMantenimiento", formulario);
            console.log(res);
            if (res) {
                mostrarMensaje({
                    title: res.message,
                    text: "Se ha creado un nuevo proceso de mantemiento",
                    icon: "success",
                    timer: 3200
                });
                const datos = [{ idMan: res, codMant: formulario.proMant }];
                console.log(datos);
                setSelectedMantenimiento(JSON.stringify(datos));
                setActiveView("detalleMantenimiento");
            } else {
                mostrarMensaje({
                    title: res,
                    text: "verifica los datos  ",
                    icon: "error",
                    timer: 3200
                });

            }
        }
            */
    }


    return (
        <div className={styles.CrearMantenimiento}>
            <h2 className={styles.tittle}> Crear nuevo Proceso de Mantenimiento</h2>
            <div className={styles.options}>
                <div className={styles["options-text"]}>
                    <label htmlFor="proMant"> Proceso: </label>
                    <input type="text" name="proMant" id="proMant" onChange={asignarValorFormulario} required />
                </div>
                <div className={styles["options-calendar"]}>

                    <label htmlFor="fInicio">Fecha de inicio</label>
                    <input type="date" name="fInicio" id="fInicio" onChange={asignarValorFormulario} required />
                </div>
                <div className={styles["options-calendar"]}>

                    <label htmlFor="fFinal">Fecha de fin </label>
                    <input type="date" name="fFinal" id="fFinal" onChange={asignarValorFormulario} required />
                </div>
                <div className={styles["options-checkbox"]}>

                    <label htmlFor="Tipo">Agente externo</label>
                    <input type="checkbox" onChange={(e) => cargarResponsable(e)} name="checResp" id="checResp" className={styles.checkbox} />
                </div>
                <div className={styles["filter-section"]}>

                    <label htmlFor="responsable"> Responsable: </label>

                    <Select
                        options={respons.map((r) => ({
                            value: r.clave,
                            label: r.nombre
                        }))}
                        placeholder="Seleccione"
                        onChange={valorCombo}
                        value={selNuevaOpcion}
                        className={styles["filter-select"]}
                    />
                </div>
                <div className={styles["action-buttons"]}>
                    <button className={styles["primary-button"]} onClick={(e) => guardar(e)}> Guardar</button>
                </div>
            </div>
        </div>
    );
}
export default CrearManten;