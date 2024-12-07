import React, { useEffect } from "react";
import { useForm } from "./AcriveCreateFun.js"; // Hook personalizado para manejar la lógica
import {
  FormContainer,
  FormTitle,
  Form,
  FormGrid,
  FormGroup,
  FormInput,
  FormSelect,
  FormButton,
  ErrorMessage,
} from "./ActiveCreateStyles.js"; // Estilos personalizados
import "./ActiveCreateBody.css"; // Estilo CSS específico

const ActiveCreateView = () => {
  const { form, handleInputChange, handleSubmit, error, errorMessage } = useForm();

  useEffect(() => {
    document.body.classList.add("form-view-body");
    return () => {
      document.body.classList.remove("form-view-body");
    };
  }, []);

  return (
    <FormContainer>
      <FormTitle>Nuevo Activo</FormTitle>
      <Form>
        {/* Grid para organizar los campos */}
        <FormGrid>
          <FormGroup>
            <label htmlFor="typeActive">Tipo Activo</label>
            <FormSelect
              id="typeActive"
              name="typeActive"
              required
              value={form.typeActive}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un tipo</option>
              <option value="Informatico">Informático</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Decorativo">Decorativo</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <label htmlFor="activo">Activo</label>
            <FormSelect
              id="activo"
              name="activo"
              required
              value={form.activo}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un activo</option>
              <option value="Informatico">Informático</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Decorativo">Decorativo</option>
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="series">Serie</label>
            <FormInput
              type="text"
              id="series"
              name="series"
              placeholder="Ingrese la serie"
              required
              value={form.series}
              onChange={handleInputChange}
            />
          </FormGroup>
          

          <FormGroup>
            <label htmlFor="marca">Marca</label>
            <FormInput
              type="text"
              id="marca"
              name="marca"
              placeholder="Ingrese el proveedor"
              required
              value={form.marca}
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="modelo">Modelo</label>
            <FormInput
              type="text"
              id="modelo"
              name="modelo"
              placeholder="Ingrese el proveedor"
              required
              value={form.modelo}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup>
            <label htmlFor="color">Color</label>
            <FormInput
              type="text"
              id="color"
              name="color"
              placeholder="Ingrese la serie"
              required
              value={form.color}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="barcode">Código de Barras</label>
            <FormInput
              type="text"
              id="barcode"
              name="barcode"
              placeholder="Ingrese el código de barras"
              required
              value={form.barcode}
              onChange={handleInputChange}
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="compra">Proceso de compra</label>
            <FormSelect
              id="compra"
              name="compra"
              required
              value={form.compra}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un proceso</option>
              <option value="Informatico">Informático</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Decorativo">Decorativo</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <label htmlFor="ubicacion">Ubicacion</label>
            <FormSelect
              id="ubicacion"
              name="ubicacion"
              required
              value={form.ubicacion}
              onChange={handleInputChange}
            >
              <option value="">Seleccione una ubicacion</option>
              <option value="Informatico">Informático</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Decorativo">Decorativo</option>
            </FormSelect>
          </FormGroup>
          <FormGroup>
            <label htmlFor="responsable">Responsable</label>
            <FormSelect
              id="responsable"
              name="responsable"
              required
              value={form.responsable}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un responsable</option>
              <option value="Informatico">Informático</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Decorativo">Decorativo</option>
            </FormSelect>
          </FormGroup>

          <FormGroup>
            <label htmlFor="status">Estado</label>
            <FormSelect
              id="status"
              name="status"
              required
              value={form.status}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un estado</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="pendiente">Pendiente</option>
            </FormSelect>
          </FormGroup>
        </FormGrid>

        {/* Botón de enviar */}
        <FormButton type="button" onClick={handleSubmit}>
          Guardar
        </FormButton>
      </Form>

      {/* Mostrar error si existe */}
      {error && <ErrorMessage>{errorMessage}</ErrorMessage>}
    </FormContainer>
  );
};

export default ActiveCreateView;
