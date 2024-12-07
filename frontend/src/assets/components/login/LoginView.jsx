import React, { useEffect } from "react";
import { useLogin } from "./LoginFun";
import {
  LoginContainer,
  LoginTitle,
  Form,
  FormGroup,
  FormInput,
  LoginButton,
  ErrorMessage,
} from "./LoginStyles.js";
import "./LoginBodyStyles.css"; 

const LoginView = () => {
  const { form, nameChange, actionButtonLogin, error, smserror } = useLogin();

  useEffect(() => {
    document.body.classList.add("login-view-body");
    return () => {
      document.body.classList.remove("login-view-body");
    };
  }, []);

  return (
    <LoginContainer>
      <LoginTitle>Iniciar Sesión</LoginTitle>
      <Form>
        <FormGroup>
          <label htmlFor="username">Usuario</label>
          <FormInput
            type="text"
            id="username"
            name="username"
            placeholder="Ingrese su usuario"
            required
            value={form.username}
            onChange={nameChange}
          />
        </FormGroup>
        <FormGroup>
          <label htmlFor="pass">Contraseña</label>
          <FormInput
            type="password"
            id="pass"
            name="pass"
            placeholder="Ingrese su contraseña"
            required
            value={form.pass}
            onChange={nameChange}
          />
        </FormGroup>
        <LoginButton type="button" onClick={actionButtonLogin}>
          Ingresar
        </LoginButton>
      </Form>
      {error && <ErrorMessage>{smserror}</ErrorMessage>}
    </LoginContainer>
  );
};

export default LoginView;
