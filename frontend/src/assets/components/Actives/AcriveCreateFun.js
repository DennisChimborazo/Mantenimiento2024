import { useState } from "react";

export const useForm = () => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    status: "",
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.location || !form.status) {
      setError(true);
      setErrorMessage("Todos los campos son obligatorios.");
      return;
    }
    setError(false);
    console.log("Datos enviados:", form);
  };

  return { form, handleInputChange, handleSubmit, error, errorMessage };
};
