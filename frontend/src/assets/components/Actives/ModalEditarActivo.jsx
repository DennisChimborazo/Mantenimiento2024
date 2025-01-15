import React, { useState, useEffect } from "react";
import Select from "react-select";
import ApiService from "../../Services/ApiMetodos";
import mostrarMensaje from "../Mensajes/Mensaje";
import styles from "./EditarActivosEstilos.module.css";

function ModalEditarActivo({ onClose, actEditar }) {
    const [proceso, setProceso] = useState([]);
    const [tipobien, setTipobien] = useState([]);
    const [ubicacion, setUbicacion] = useState([]);
    const [responsable, setResponsable] = useState([]);
    const [bien, setBien] = useState([]);

    const [bienCombo, setBienCombo] = useState([]);
    const [valProceso, setvalProceso] = useState([]);
    const [valubicacion, setvalUbicacion] = useState([]);
    const [valresponsable, setvalResponsable] = useState([]);
    const [valEstado, setvalEstado] = useState([]);

    const [valSerie, setvalSerie] = useState("");
    const [valMarca, setvalMarca] = useState("");
    const [valColor, setvalColor] = useState("");
    const [valModelo, setvalModelo] = useState("");
    const [valcodigo, setValCodigo] = useState("");
    const [valbien, setvalBien] = useState([]);
    const estados = [{ value: "1", label: "Activo" }, { value: "2", label: "Inactivo" }];
    const [formulario, setFormulario] = useState(
        {
            idActivo: "", serieAct: "", marcaAct: "", modeloAct: "", colorAct: "", codigoBarraAct: "",
            idCompra: "", idUbic: "", idPers: "", idbien: "", idEstado: ""
        });


    useEffect(() => {
        const cargarDatos = async () => {
            const cargarProcesosCompra = await ApiService.traerDatos("procompras");
            const cargarTipoBiem = await ApiService.traerDatos("tipobien");
            const cargarUbicacion = await ApiService.traerDatos("ubicacion");
            const cargarResponsable = await ApiService.traerDatos("responsable");
            const cargarbien = await ApiService.traerDatos("bien");
            setBien(cargarbien);
            setProceso(cargarProcesosCompra);
            setTipobien(cargarTipoBiem);
            setUbicacion(cargarUbicacion);
            setResponsable(cargarResponsable);

            ////////////////datos
            const idpros = cargarProcesosCompra.filter((p) => p.idCompra === actEditar.idCompra);
            const pros = { value: idpros[0].idCompra, label: actEditar.idCompra };
            setvalProceso(pros);

            const idbie = cargarbien.filter((p) => p.nombien === actEditar.nombien);
            const bie = { value: idbie[0].idbien, label: actEditar.nombien };
            setvalBien(bie);

            setvalSerie(actEditar.serieAct);
            setvalMarca(actEditar.marcaAct);
            setvalModelo(actEditar.modeloAct);
            setvalColor(actEditar.colorAct);
            setValCodigo(actEditar.codigoBarraAct);

            const idres = cargarResponsable.filter((p) => p.nomPers === actEditar.nomPers);
            const res = { value: idres[0].idPers, label: actEditar.nomPers };
            setvalResponsable(res);

            const idest = estados.filter((p) => p.label === actEditar.nomEstado);
            const est = { value: idest[0].value, label: actEditar.nomEstado };
            setvalEstado(est);

            const idubc = cargarUbicacion.filter((p) => p.nomUbic === actEditar.nomUbic);
            const ubic = { value: idubc[0].idUbic, label: actEditar.nomUbic };
            setvalUbicacion(ubic);

            setFormulario({
                ...formulario, idActivo: actEditar.idActivo,
                serieAct: actEditar.serieAct,
                marcaAct: actEditar.marcaAct,
                modeloAct: actEditar.modeloAct,
                colorAct: actEditar.colorAct,
                codigoBarraAct: actEditar.codigoBarraAct,
                idCompra: idpros[0].idCompra,
                idUbic: idubc[0].idUbic,
                idPers: idres[0].idPers,
                idbien: idbie[0].idbien,
                idEstado: idest[0].value
            });
        }
        cargarDatos();
    }, [])
    const cerrarModal = () => {
        onClose(); // Llama a la función onClose para cerrar el modal
    };


    const cargarBieneSelect = (e) => {
        setvalBien("")
        const fil = bien.filter((b) => b.idtipBien === e.value);
        setBienCombo(fil);
        setFormulario({ ...formulario, idbien: "" });
    }
    const asignarBienForm = (e) => {
        setvalBien(e)
        setFormulario({ ...formulario, idbien: e.value });
    }
    const asignarProcesoForm = (e) => {
        setvalProceso(e)
        setFormulario({ ...formulario, idCompra: e.value });
    }
    const asignarRespoForm = (e) => {
        setvalResponsable(e)
        setFormulario({ ...formulario, idPers: e.value });
    }
    const asignarEstadoForm = (e) => {
        setvalEstado(e)
        setFormulario({ ...formulario, idEstado: e.value });
    }
    const asignarUbicacionForm = (e) => {
        setvalUbicacion(e)
        setFormulario({ ...formulario, idUbic: e.value });
    }

    const actualzarActivo = async () => {
        if (formulario.idbien === "" || formulario.serieAct === "" ||
            formulario.marcaAct === "" || formulario.modeloAct === "" ||
            formulario.colorAct === "" || formulario.codigoBarraAct === "") {
            mostrarMensaje({ title: "Campos Vacios", text: "Todos los capos son obligatorios", icon: "error", timer: 2000 });
        } else {
            const res = await mostrarMensaje({
                icon: "info",
                title: "Actualizar ",
                text: "Esta seguro de actualizar informacion del activo",
                buttons: { cancel: "Cancelar", confirm: { text: "Actualizar", }, },
            });
            if (res) {
                const valApi = ApiService.actualizarDatos("actuActivo", formulario);
                console.log(valApi)
                mostrarMensaje({ title: "Actualizado", text: "Se actualizo con exito", icon: "success", timer: 2000 });
                cerrarModal();
            }
        }
    }

    const asignarValoresInput = (e) => {
        switch (e.target.name) {
            case "serieAct":
                setvalSerie(e.target.value);
                break;

            case "marcaAct":
                setvalMarca(e.target.value);
                break;

            case "modeloAct":
                setvalModelo(e.target.value);
                break;

            case "colorAct":
                setvalColor(e.target.value);
                break;

            case "codigoBarraAct":
                setValCodigo(e.target.value);
                break;

            default:
                break;
        }
        setFormulario({ ...formulario, [e.target.name]: e.target.value });
    }



    return (
        <div className={styles.modalGlobal}>
            <div className={styles.NuevoActivo}>
                <h2 className={styles["formTitle"]}> Editar activo</h2>
                <div className={styles["form"]}>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Proceso de compra</label>
                        <Select options={proceso.map((d) => ({
                            value: d.idCompra,
                            label: d.idCompra,
                        }))}
                            value={valProceso}
                            onChange={asignarProcesoForm}
                        ></Select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Tipo de Bien</label>
                        <Select options={tipobien.map((d) => ({
                            value: d.idtipBien,
                            label: d.nomtipBien,
                        }))}
                            onChange={cargarBieneSelect}
                        ></Select>
                    </div>
                    <div className={styles.formGroup}>

                        <label htmlFor="" className={styles.formLabel}>Bien</label>
                        <Select
                            options={bienCombo.map((d) => ({
                                value: d.idbien,
                                label: d.nombien,
                            }))}
                            value={valbien}
                            onChange={asignarBienForm}
                        ></Select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Serie</label>
              <input type="text" name="serieAct" className={styles.formInput} value={valSerie} onChange={asignarValoresInput} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Marca</label>
                        <input type="text" name="marcaAct" className={styles.formInput} value={valMarca} onChange={asignarValoresInput} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Modelo</label>
                        <input type="text" name="modeloAct" className={styles.formInput} value={valModelo} onChange={asignarValoresInput} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Color</label>
                        <input type="text" name="colorAct" className={styles.formInput} value={valColor} onChange={asignarValoresInput} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Codigo </label>
                        <input type="text" name="codigoBarraAct" className={styles.formInput} value={valcodigo} onChange={asignarValoresInput} />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Responsable</label>
                        <Select
                            options={responsable.map((d) => ({
                                value: d.idPers,
                                label: d.nomPers,
                            }))}
                            value={valresponsable}
                            onChange={asignarRespoForm}
                        ></Select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Estado</label>
                        <Select options={estados} value={valEstado}
                            onChange={asignarEstadoForm}></Select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="" className={styles.formLabel}>Ubicacion</label>
                        <Select
                            options={ubicacion.map((d) => ({
                                value: d.idUbic,
                                label: d.nomUbic,
                            }))}
                            value={valubicacion}
                            onChange={asignarUbicacionForm}
                        ></Select>
                    </div>
                    <div className={styles.formActions}>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={cerrarModal}> cancelar</button>
                        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={actualzarActivo}> Editar</button>

                    </div>
                </div>
            </div>
        </div>
    );

}
export default ModalEditarActivo;