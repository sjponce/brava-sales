import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// TODO: Consumir tipos de envio desde la API
const shippingTypes = {
  free: {
    name: 'Envío gratuito',
    description:
      'El envío gratuito se realizará a domicilio del cliente en el próximo viaje de ventas a su localidad.',
  },
  andreani: {
    name: 'Andreani',
    description: 'Andreani es un servicio de paquetería privado que conlleva un costo adicional.',
  },
  oca: {
    name: 'OCA',
    description: 'OCA es un servicio de paquetería privado que conlleva un costo adicional.',
  },
};

const AddShippingForm = ({ control, watch }) => {
  useEffect(() => {
    console.log(watch('shippingType'));
  }, [watch('shippingType')]);

  return (
    <Box
      p={1}
      border={1}
      borderRadius={2.5}
      borderColor="background.paper"
      display="flex"
      color="primary"
      flexDirection="column">
      <Controller
        name="shippingType"
        control={control}
        defaultValue="free"
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="shippingType">Tipo de envío</InputLabel>
            <Select
              {...field}
              labelId="shippingType"
              label="Tipo de envío"
              value={field.value || 'free'}>
              {Object.keys(shippingTypes).map((key) => (
                <MenuItem key={key} value={key}>
                  <Typography variant="body1">{shippingTypes[key].name}</Typography>
                </MenuItem>
              ))}
            </Select>
            <Typography variant="body2" color="textSecondary" mt={2}>
              {shippingTypes[field.value].description}
            </Typography>
          </FormControl>
        )}
      />
    </Box>
  );
};

export default AddShippingForm;
