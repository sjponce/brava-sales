import {
  Box,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputAdornment,
  InputLabel,
  Switch,
  TextField,
} from '@mui/material';
import React from 'react';
import EmailIcon from '@mui/icons-material/Email';
import { PropTypes } from 'prop-types';

const AddSellerForm = ({ register }) => (
  <Box display="flex" flexDirection="row" justifyContent="center" sx={{ width: '100%', height: '100%' }}>
    <TextField
      label="Correo electrónico"
      name="email"
      type="email"
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <EmailIcon color="disabled" />
          </InputAdornment>
        ),
      }}
      {...register('email', { required: true })}
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mr: 3, minWidth: 200 }}
    />
    <TextField
      label="Nombre"
      name="name"
      required
      {...register('name', { required: true })}
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mr: 3, minWidth: 200 }}
    />
    <TextField
      label="Apellido"
      name="apellido"
      required
      {...register('surname', { required: true })}
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mr: 3, minWidth: 200 }}
    />
    <TextField
      label="Rol"
      name="role"
      required
      {...register('role', { required: true })}
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mr: 3, minWidth: 200 }}
    />
    {/* TODO: Use phone validator */}
    <TextField
      label="Telefono"
      name="phone"
      required
      {...register('phone', { required: true })}
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mr: 3, minWidth: 200 }}
    />
    {/* TODO: Upload photo */}
    <TextField
      label="Foto"
      name="photo"
      required
      {...register('photo')}
      variant="outlined"
      size="large"
      fullWidth
      sx={{ mr: 3, minWidth: 200 }}
    />
    <InputLabel  htmlFor="role-select" id="role-label">Rol</InputLabel>
    {/* TODO: Add select instead of textfield */}
    {/* <Select labelId="role-label" id="role-select" label="Rol">
        <MenuItem value="ADMIN">Administrador</MenuItem>
        <MenuItem value="SELLER">Vendedor</MenuItem>
      </Select> */}
    <FormControl {...register('disabled', { required: true })} component="fieldset">
      <FormLabel component="legend">Activo</FormLabel>
      <FormGroup aria-label="position" row>
        <FormControlLabel
          control={<Switch color="primary" />}
        />
      </FormGroup>
    </FormControl>
  </Box>
);

AddSellerForm.propTypes = {
  register: PropTypes.func.isRequired,
};

export default AddSellerForm;
