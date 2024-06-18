import {
  Autocomplete, Box, IconButton, TextField, Typography, Tooltip,
} from '@mui/material';
import { AddPhotoAlternateOutlined, HideImageOutlined } from '@mui/icons-material';
import React, { useState } from 'react';
import { PropTypes } from 'prop-types';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';

const AddSellerForm = ({
  register, setValue, watch, roleOptions,
}) => {
  const [uploadedImg, setUploadedImg] = useState(watch('photo'));
  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      const imageUrl = await uploadImageToImgbb(image);
      setValue('photo', imageUrl);
      setUploadedImg(true);
    }
  };

  const handlePhoneInputChange = (event) => {
    const filteredValue = event.target.value.replace(/[^0-9]/g, '');
    setValue('phone', filteredValue);
  };

  const handleRemoveImage = (event) => {
    event.preventDefault();
    setUploadedImg(false);
    setValue('photo', '');
    const fileInput = document.getElementById('raised-button-file');
    if (fileInput) fileInput.value = '';
  };

  return (
    <>
      <Box display="flex" flexDirection="column" border={1} borderColor="background.paper" borderRadius={2.5} p={1} mt={2}>
        <Typography variant="overline" textAlign="center">
          Datos de la cuenta
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Email"
            name="email"
            type="email"
            size="small"
            required
            margin="normal"
            fullWidth
            {...register('email', { required: true })}
            variant="outlined"
          />
          <TextField
            label="Contraseña"
            name="password"
            type="password"
            size="small"
            margin="normal"
            fullWidth
            required
            {...register('password', { required: true })}
            variant="outlined"
            inputProps={{
              minLength: 8,
            }}
          />
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" border={1} borderColor="background.paper" borderRadius={2.5} p={1} mt={2} mb={2}>
        <Typography variant="overline" textAlign="center">
          Datos del vendedor
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Nombre"
            name="name"
            size="small"
            required
            margin="normal"
            {...register('name', { required: true })}
            variant="outlined"
            fullWidth
          />
          <TextField
            label="Apellido"
            name="surname"
            size="small"
            required
            margin="normal"
            {...register('surname', { required: true })}
            variant="outlined"
            fullWidth
          />
        </Box>
        <TextField
          label="Teléfono"
          name="phone"
          margin="normal"
          size="small"
          variant="outlined"
          fullWidth
          onChange={handlePhoneInputChange}
          inputProps={{
            minLength: 9,
            maxLength: 11,
          }}
          {...register('phone')}
        />
        <Box display="flex" alignItems="center" justifyContent="center" gap={3}>
          <Autocomplete
            options={roleOptions}
            fullWidth
            isOptionEqualToValue={(option, value) => option === value || value === ''}
            defaultValue={roleOptions.find((option) => option.value === watch('role'))?.label ?? ''}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Rol"
                name="role"
                size="small"
                required
                margin="normal"
                {...register('role', { required: true })}
                variant="outlined"
                fullWidth
              />
            )}
          />
          <label htmlFor="raised-button-file">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <Tooltip title={uploadedImg ? 'Eliminar imagen de perfil' : 'Agregar imagen de perfil'}>
              <IconButton component="span" onClick={uploadedImg ? handleRemoveImage : undefined}>
                {uploadedImg ? <HideImageOutlined /> : <AddPhotoAlternateOutlined />}
              </IconButton>
            </Tooltip>
          </label>
        </Box>
      </Box>
    </>
  );
};

AddSellerForm.propTypes = {
  register: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  watch: PropTypes.func.isRequired,
  roleOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
};

export default AddSellerForm;
