import { Box, TextField } from '@mui/material';

const UpdatePasswordForm = ({ register, watch }) => (
  <Box display="flex" flexDirection="column" border={1} borderColor="background.paper" borderRadius={2.5} p={1} mt={2} mb={2}>
    <TextField
      label="Nueva contraseña"
      name="password"
      type="password"
      size="small"
      required
      margin="normal"
      fullWidth
      inputProps={{
        minLength: 8,
      }}
      {...register('password', { required: true })}
      variant="outlined"
    />

    <TextField
      label="Confirmar Contraseña"
      name="confirmPassword"
      type="password"
      size="small"
      required
      margin="normal"
      fullWidth
      {...register('confirmPassword', { required: true })}
      error={watch('password') !== watch('confirmPassword')}
      helperText={watch('password') !== watch('confirmPassword') && 'Las contraseñas no coinciden'}
      variant="outlined"
    />
  </Box>
);

export default UpdatePasswordForm;
