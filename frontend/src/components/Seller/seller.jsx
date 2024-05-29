import React from 'react';

const Vendedor = () => {
  const handleEliminar = () => {
    alert("El botón 'eliminar' fue presionado");
  };

  return (
    <div>
      <h1>Vendedor</h1>
      <button onClick={handleEliminar}>eliminar</button>
    </div>
  );
};

export default Vendedor;
