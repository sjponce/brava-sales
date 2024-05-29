import React from 'react';
import { InputAdornment, TextField } from '@mui/material';
import Email from '@mui/icons-material/Email';
import PropTypes from 'prop-types';

const ForgetPasswordForm = ({ register }) => (
  <TextField
    label="Correo electrónico"
    name="email"
    type="email"
    required
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Email color="disabled" />
        </InputAdornment>
      ),
    }}
    {...register('email', { required: true })}
    size="large"
    fullWidth
    sx={{ mb: 3 }}
  />
);

ForgetPasswordForm.propTypes = {
  register: PropTypes.func.isRequired,
};

export default ForgetPasswordForm;
