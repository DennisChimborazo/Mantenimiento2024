import { useState, useEffect } from "react";
import Select from "react-select";
import mostrarMensaje from "../Mensajes/Mensaje.js";
import ApiService from "../../Services/ApiMetodos.js";
import styles from "./CrearMantenimientoEstilos.module.css"; // Importación de estilos locales

function CrearManten({ setActiveView, setSelectedMantenimiento, mantenimietoEdit }) {
    const [respons, setRespons] = useState([]);
    const [formulario, setFormulario] = useState({ proMant: "", fInicio: "", fFinal: "", tipo: "", responsable: "" });
    const [personal, setPersonal] = useState([]);
    const [proveedor, setProveedor] = useState([]);
    const [selNuevaOpcion, setSelNuevaOpcion] = useState(null); // Cambié a null para un valor inicial adecuado
    const [datosPadre, setDatosPadre] = useState([]);
    const [boolEdit, setboolEdit] = useState(false);

    useEffect(() => {
        const cargarDatos = async () => {
            // Cargar datos de proveedores
            let prov = await ApiService.traerDatos("proovedor");
            const provConvertido = prov.map((d) => ({
                clave: d.idProveedor,
                nombre: d.nomProveedor,
            }));
            setProveedor(provConvertido);

            // Cargar datos de responsables
            let per = await ApiService.traerDatos("responsable");
            let perConvertido = per.map((d) => ({
                clave: d.idPers,
                nombre: d.nomPers,
            }));
            setPersonal(perConvertido);
            setRespons(perConvertido);

            const datosRecibidos = JSON.parse(mantenimietoEdit);
            if (datosRecibidos.codManten !== "") {
                const bus = await ApiService.buscarDatos("busMantcomple", datosRecibidos.idManten);

                setFormulario({
                    proMant: bus[0].codManten,
                    fInicio: bus[0].fechaInico,
                    fFinal: bus[0].fechaFin,
                    tipo: bus[0].tipo,
                    responsable: bus[0].idRespons,
                });

                setFormulario((fo) => ({ ...fo, idManten: bus[0].idManten }));

                setboolEdit(true);
                setDatosPadre(bus);
                if (bus[0].tipo === "in") {
                    const val = perConvertido.filter((dato) => dato.clave === bus[0].idRespons);
                    setSelNuevaOpcion({ value: val[0].clave, label: val[0].nombre });
                    setRespons(perConvertido);
                } else {
                    const val = provConvertido.filter((dato) => dato.clave === bus[0].idRespons);
                    setSelNuevaOpcion({ value: val[0].clave, label: val[0].nombre });
                    setRespons(provConvertido);
                }
            }
        };

        cargarDatos();
    }, []); // Agregado mantenimietoEdit como dependencia

    const cargarResponsable = (e) => {
        let tip = "";
        if (e.target.checked) {
            setRespons(proveedor);
            tip = "ex";
        } else {
            setSelNuevaOpcion(null); // Limpiar la opción seleccionada
            setRespons(personal);
            tip = "in";
        }
        setFormulario({
            ...formulario,
            responsable: "",
            tipo: tip,
        });
    };

    const valorCombo = (val) => {
        setSelNuevaOpcion(val);
        setFormulario({
            ...formulario,
            responsable: val.value,
        });
    };

    const asignarValorFormulario = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

    const guardar = async (e) => {
        e.preventDefault();
        if (formulario.responsable === "" || formulario.fInicio === "" || formulario.fFinal === "" || formulario.proMant === "") {
            mostrarMensaje({
                title: "Campos faltantes",
                text: "Es obligatorio llenar todos los campos",
                icon: "error",
                timer: 3200,
            });
        } else {
            const fini = new Date(formulario.fInicio);
            const ffin = new Date(formulario.fFinal);

            if (fini > ffin) {
                mostrarMensaje({
                    title: "Fechas invalidas",
                    text: "Seleccione un rango de fechas válido",
                    timer: 2000,
                    icon: "info",
                });
            } else {
                if (boolEdit) {
                    const res = await ApiService.actualizarDatos("actuInfManten", formulario);
                    if (res) {
                        mostrarMensaje({
                            title: res.message,
                            text: "Se actualizó el proceso de mantenimiento",
                            icon: "success",
                            timer: 2200,
                        });
                        setActiveView("mantenimiento");
                         setboolEdit(false);
                    }
                } else {
                    const res = await ApiService.enviarDatos("nuevoMantenimiento", formulario);
                    if (res) {
                        mostrarMensaje({
                            title: res.message,
                            text: "Se ha creado un nuevo proceso de mantenimiento",
                            icon: "success",
                            timer: 2200,
                        });
                        const datos = [{ idMan: res, codMant: formulario.proMant }];
                        setSelectedMantenimiento(JSON.stringify(datos));
                        setActiveView("detalleMantenimiento");
                    }
                }
            }
        }
    };

    return (
        <div className={styles.CrearMantenimiento}>
            {datosPadre.length === 0 ? (
                <div>
                    <h2 className={styles.tittle}>Nuevo Proceso de Mantenimiento</h2>

                </div> // Esto renderiza un div vacío si no hay datos
                ) : (
                <div>
                    <h2 className={styles.tittle}>Actualiza Proceso de Mantenimiento</h2>
                </div>
                )}
            <div className={styles.options}>
                <div className={styles["options-text"]}>
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
                <div className={styles["options-calendar"]}>
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
                <div className={styles["options-calendar"]}>
                    <label htmlFor="fFinal">Fecha de fin</label>
                    <input
                        type="date"
                        name="fFinal"
                        id="fFinal"
                        onChange={asignarValorFormulario}
                        required
                        value={formulario.fFinal}
                    />
                </div>
                <div className={styles["options-checkbox"]}>
                    <label htmlFor="Tipo">Agente externo
                        <input
                            type="checkbox"
                            onChange={(e) => cargarResponsable(e)}
                            name="checResp"
                            id="checResp"
                            className={styles.checkbox}
                        />
                    </label>
                </div>
                <div className={styles["filter-section"]}>
                    <label htmlFor="responsable">Responsable:</label>
                    <Select
                        options={respons.map((r) => ({
                            value: r.clave,
                            label: r.nombre,
                        }))}
                        placeholder="Seleccione"
                        onChange={valorCombo}
                        value={selNuevaOpcion}
                        className={styles["filter-select"]}
                    />
                </div>
                <div className={styles["action-buttons"]}>
                    <button className={styles["primary-button"]} onClick={(e) => guardar(e)}>Guardar</button>
                </div>
            </div>
        </div>
    );
}

export default CrearManten;
