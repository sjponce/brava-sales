import React from 'react';
import { Controller } from 'react-hook-form';
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

// TODO: Consumir tipos de envio desde la API
const shippingMethod = {
  andreani: {
    name: 'Andreani',
    description: 'Andreani es un servicio de paquetería privado que conlleva un costo adicional.',
  },
  oca: {
    name: 'OCA',
    description: 'OCA es un servicio de paquetería privado que conlleva un costo adicional.',
  },
  officePickup: {
    name: 'Retiro en oficina',
    description: 'El cliente retirará su pedido en el local de la empresa.',
  },
};

const AddShippingForm = ({ control }) => (
  <Box
    p={1}
    border={1}
    borderRadius={2.5}
    borderColor="background.paper"
    display="flex"
    color="primary"
    flexDirection="column">
    <Controller
      name="shippingMethod"
      control={control}
      defaultValue="tripDelivery"
      render={({ field }) => (
        <FormControl fullWidth>
          <InputLabel id="shippingMethod">Envío preferido</InputLabel>
          <Select
            {...field}
            labelId="shippingMethod"
            label="Envío preferido"
            value={field.value || 'tripDelivery'}>
            {Object.keys(shippingMethod).map((key) => (
              <MenuItem key={key} value={key}>
                <Typography variant="body1">{shippingMethod[key].name}</Typography>
              </MenuItem>
            ))}
          </Select>
          <Typography variant="body2" color="textSecondary" mt={2}>
            {shippingMethod[field.value]?.description}
          </Typography>
        </FormControl>
      )}
    />
  </Box>
);

export default AddShippingForm;
