import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Link,
  Box,
  Typography,
  InputAdornment,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

const LoginForm = ({ register }) => (
  <Box display="flex" flexDirection="column">
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
      sx={{ mb: 3 }}
    />
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
      {...register('password', { required: true })}
      variant="outlined"
      size="large"
      fullWidth
    />

    <Box display="flex" alignItems="center" justifyContent="space-between">
      <FormControlLabel
        control={<Checkbox defaultChecked name="remember" />}
        {...register('remember')}
        label={<Typography variant="subtitle2">Recuérdame</Typography>}
      />
      <Link href="/forgetpassword">
        <Typography variant="subtitle2">Reestablecer contraseña</Typography>
      </Link>
    </Box>
  </Box>
);

LoginForm.propTypes = {
  register: PropTypes.func.isRequired,
};

export default LoginForm;
