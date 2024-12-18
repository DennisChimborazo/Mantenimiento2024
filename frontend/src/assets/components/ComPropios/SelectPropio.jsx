import React from "react";
import Select from "react-select";

function SelectPropio({ options, onChange }) {
  return (
    <div>
      <Select
        isMulti
        options={options} // Pasar opciones dinámicamente desde los props
        onChange={onChange} // Llamar a la función pasada por los props para manejar el cambio
      />
    </div>
  );
}

export default SelectPropio;
