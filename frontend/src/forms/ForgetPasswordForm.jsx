import React from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

const ForgetPasswordForm = ({ register, watch }) => (
  <Box display="flex" flexDirection="column" gap={2} mb={2}>
    <TextField
      id="password"
      label="Contraseña"
      type="password"
      name="password"
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon color="disabled" />
          </InputAdornment>
        ),
        minLength: 8,
      }}
      {...register('password', {
        required: true,
        minLength: {
          value: 8,
          message: 'La contraseña debe tener al menos 8 caracteres',
        },
      })}
      error={watch('password')?.length < 8}
      helperText={watch('password')?.length < 8 && 'La contraseña debe tener al menos 8 caracteres'}
      variant="outlined"
      size="large"
      fullWidth
    />
    <TextField
      id="repassword"
      label="Vuelve a introducir la contraseña"
      type="password"
      name="repassword"
      required
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LockIcon color="disabled" />
          </InputAdornment>
        ),
        minLength: 8,
      }}
      {...register('repassword', {
        required: true,
        validate: (value) => value === watch('password') || 'Las contraseñas no coinciden',
      })}
      variant="outlined"
      size="large"
      fullWidth
      error={watch('password') !== watch('repassword')}
      helperText={watch('password') !== watch('repassword') && 'Las contraseñas no coinciden'}
    />
  </Box>
);

export default ForgetPasswordForm;
