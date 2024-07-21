import {
  Autocomplete, Box, TextField, Typography,
} from '@mui/material';
import React from 'react';
import { PropTypes } from 'prop-types';

const AddCustomerForm = ({
  register, setValue, watch, documentTypeOptions, ivaConditionOptions,
}) => {
  const handleNumberChange = (event) => {
    const filteredValue = event.target.value.replace(/[^0-9]/g, '');
    setValue('number', filteredValue);
  };

  const handleDataInput = (event) => {
    const filteredValue = event.target.value.replace(/[^a-zA-Z\s]/g, '');
    setValue(event.target.name, filteredValue);
  };

  return (
    <Box display="flex" flexDirection="column" border={1} borderColor="background.paper" borderRadius={2.5} p={1} mt={2} mb={2}>
      <Typography variant="overline" textAlign="center">
        Datos del Cliente
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          label="Nombre/Razón Social"
          name="name"
          size="small"
          required
          onChange={handleDataInput}
          margin="normal"
          value={watch('name')}
          variant="outlined"
          fullWidth
          />
        <TextField
          label="Correo electrónico"
          name="email"
          type="email"
          size="small"
          required
          margin="normal"
          value={watch('email')}
          {...register('email', { required: true })}
          variant="outlined"
          fullWidth
          />
      </Box>
      <TextField
        label="Número de teléfono"
        name="number"
        margin="normal"
        size="small"
        variant="outlined"
        fullWidth
        value={watch('number')}
        onChange={handleNumberChange}
        inputProps={{
          minLength: 9,
          maxLength: 11,
        }}
        />
      <Box display="flex" gap={2}>
        <Autocomplete
          options={documentTypeOptions}
          fullWidth
          isOptionEqualToValue={(option, value) => option === value || value === ''}
          defaultValue={documentTypeOptions.find((option) => option.value === watch('documentType'))?.label ?? ''}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Tipo de documento"
              name="documentType"
              size="small"
              required
              margin="normal"
              {...register('documentType', { required: true })}
              variant="outlined"
              fullWidth
              />
          )}
          />
        <TextField
          label="Número Documento"
          name="documentNumber"
          size="small"
          required
          margin="normal"
          value={watch('documentNumber')}
          {...register('documentNumber', { required: true })}
          variant="outlined"
          fullWidth
          />
      </Box>
      <Autocomplete
        options={ivaConditionOptions}
        fullWidth
        isOptionEqualToValue={(option, value) => option === value || value === ''}
        defaultValue={ivaConditionOptions.find((option) => option.value === watch('ivaCondition'))?.label ?? ''}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Condición IVA"
            name="ivaCondition"
            size="small"
            required
            margin="normal"
            {...register('ivaCondition', { required: true })}
            variant="outlined"
            fullWidth
          />
        )}
        />
      <Typography variant="overline" textAlign="center" mt={2}>
        Dirección
      </Typography>
      <Box display="flex" gap={2}>
        <TextField
          label="Calle"
          name="address.street"
          size="small"
          required
          margin="normal"
          value={watch('address.street')}
          {...register('address.street', { required: true })}
          variant="outlined"
          fullWidth
          />
        <TextField
          label="Número"
          name="address.streetNumber"
          size="small"
          required
          margin="normal"
          value={watch('address.streetNumber')}
          {...register('address.streetNumber', { required: true })}
          variant="outlined"
          fullWidth
          />
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          label="Piso"
          name="address.floor"
          size="small"
          margin="normal"
          value={watch('address.floor')}
          {...register('address.floor')}
          variant="outlined"
          fullWidth
          />
        <TextField
          label="Departamento"
          name="address.apartment"
          size="small"
          margin="normal"
          value={watch('address.apartment')}
          {...register('address.apartment')}
          variant="outlined"
          fullWidth
         />
      </Box>
      <Box display="flex" gap={2}>
        <TextField
          label="Ciudad"
          name="address.city"
          size="small"
          required
          margin="normal"
          value={watch('address.city')}
          {...register('address.city', { required: true })}
          variant="outlined"
          fullWidth
          />
        <TextField
          label="Estado/Provincia"
          name="address.state"
          size="small"
          required
          margin="normal"
          value={watch('address.state')}
          {...register('address.state', { required: true })}
          variant="outlined"
          fullWidth
         />
      </Box>
      <TextField
        label="Código Postal"
        name="address.zipCode"
        size="small"
        required
        margin="normal"
        value={watch('address.zipCode')}
        {...register('address.zipCode', { required: true })}
        variant="outlined"
        fullWidth
        />
    </Box>

  );
};

AddCustomerForm.propTypes = {
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  documentTypeOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  ivaConditionOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
};

export default AddCustomerForm;
