import React, { useState } from "react"; // Asegúrate de importar useState
import Combos from "./combos";

function Prueba() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para el modal

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Vista 1</h2>
      <button
        type="button"
        className="secondary-button"
        onClick={handleOpenModal}
      >
        Agregar Activo
      </button>
      {/* Modal: Mostramos el componente Combos como una ventana emergente */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <Combos onClose={handleCloseModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Prueba;
