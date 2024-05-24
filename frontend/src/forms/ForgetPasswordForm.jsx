import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import Email from '@mui/icons-material/Email';

export default function ForgetPasswordForm({register}) {
  return (
    <TextField
        label="Correo electrónico"
        name="email"
        type="email"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Email color='disabled' />
            </InputAdornment>
          )
        }}
        {...register('email', { required: true })}
        size="large"
        fullWidth
        sx={{ mb: 3 }}
      />
  );
}