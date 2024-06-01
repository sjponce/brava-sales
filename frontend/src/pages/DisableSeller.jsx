import { Button } from '@mui/material';

const DisableSeller = () => {
  const DeleteSeller = () => {
    console.log('Hola');
  };

  return (
    <div>
      <p>HOLA MUUNDO</p>
      <Button onClick={DeleteSeller}>Eliminar al vendedor</Button>
    </div>
  );
};

export default DisableSeller;
