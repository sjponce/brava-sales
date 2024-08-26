import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { AddPhotoAlternateOutlined, HideImageOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import translatePaymentMethod from '@/utils/translatePaymentMethod';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';

const paymentMethods = ['Deposit', 'Debit Card', 'Credit Card', 'MercadoPago'];

const InstallmentPaymentForm = ({ control, watch, setValue, register, reset }) => {
  const [uploadedImg, setUploadedImg] = useState(watch('photo') || '');
  const updatedPaymentResult = useSelector((state) => state.sales.createPayment.result);

  const handleRemoveImage = (event) => {
    event.preventDefault();
    setUploadedImg(false);
    setValue('photo', '', { shouldValidate: true });
    const fileInput = document.getElementById('raised-button-file');
    if (fileInput) fileInput.value = '';
  };

  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const image = event.target.files[0];
      const imageUrl = await uploadImageToImgbb(image);
      setValue('photo', imageUrl, { shouldValidate: true });
      setUploadedImg(true);
    }
  };

  useEffect(() => {
    if (updatedPaymentResult) {
      reset();
      setUploadedImg(false);
    }
  }, [updatedPaymentResult, reset]);

  return (
    <Box height={60} p={1} display="flex" color="primary" mb={2} gap={2} alignItems="center">
      <Controller
        name="paymentMethod"
        control={control}
        required
        render={({ field }) => (
          <FormControl>
            <InputLabel id="installments">Método de pago</InputLabel>
            <Select
              sx={{ width: 180 }}
              fullHeight
              {...field}
              labelId="installments"
              label="Método de pago"
              value={field.value || 1}>
              {paymentMethods.map((method) => (
                <MenuItem key={method} value={method}>
                  {translatePaymentMethod(method)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <TextField
        label="Monto"
        name="amount"
        type="text"
        variant="outlined"
        inputProps={{ step: '0.01' }}
        {...register('amount', {
          required: 'Este campo es requerido',
          pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Ingrese un número válido con hasta dos decimales',
          },
          validate: (value) => parseFloat(value) > 0 || 'El monto debe ser mayor que cero',
        })}
      />
      <label htmlFor="raised-button-file">
        <input
          accept="image/*"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          data-test-id="image-input"
          required
          onChange={handleImageChange}
        />
        <Tooltip title={uploadedImg ? 'Eliminar imagen' : 'Agregar imagen'}>
          <IconButton component="span" onClick={uploadedImg ? handleRemoveImage : undefined}>
            {uploadedImg ? <HideImageOutlined /> : <AddPhotoAlternateOutlined />}
          </IconButton>
        </Tooltip>
      </label>
    </Box>
  );
};

export default InstallmentPaymentForm;
