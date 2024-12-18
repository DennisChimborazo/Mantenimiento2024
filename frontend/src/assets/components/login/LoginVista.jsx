import React, { useEffect } from "react";
import { useLogin } from "./LoginFun";
import styles from "./loginVistaEstilos.module.css"; // Importación de estilos locales

const LoginVista = () => {
  const { form, nameChange, actionButtonLogin} = useLogin();

  useEffect(() => {
    // Añadir una clase al body solo cuando este componente esté montado
    document.body.classList.add("login-view-body");
    return () => {
      // Eliminar la clase cuando el componente se desmonte
      document.body.classList.remove("login-view-body");
    };
  }, []);

  return (
    <div>
      <div className={styles.banner}></div> {/* Banner agregado aquí */}
      <div className={styles.LoginVistaLV}>

        <form className={styles.form}>
        <h1 className={styles.title}>Iniciar Sesión</h1> 
        <div className={styles.formImage}></div>
          <label htmlFor="username" className={styles.label}>Usuario</label>
          <input
            className={styles.input}
            type="text"
            id="username"
            name="username"
            placeholder="Ingrese su usuario"
            required
            value={form.username}
            onChange={nameChange}
          />
          <label htmlFor="pass" className={styles.label}>Contraseña</label>
          <input
            className={styles.input}
            type="password"
            id="pass"
            name="pass"
            placeholder="Ingrese su Contraseña"
            required
            value={form.pass}
            onChange={nameChange}
          />
          <button className={styles.button} type="button" onClick={actionButtonLogin}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginVista;
