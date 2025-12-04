import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { AddPhotoAlternateOutlined, HideImageOutlined, VerticalAlignTop } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import translatePaymentMethod from '@/utils/translatePaymentMethod';
import uploadImageToImgbb from '@/utils/uploadImageToImgbb';

const InstallmentPaymentForm = ({ control, watch, setValue, register, reset, pendingAmount }) => {
  const userState = useSelector((store) => store.auth.current);
  const isCustomer = userState.role === 'customer';

  const paymentMethods = isCustomer
    ? ['Deposit', 'Transfer', 'MercadoPago']
    : ['Deposit', 'Transfer'];
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

  const selectedPaymentMethod = watch('paymentMethod');
  const isMercadoPago = selectedPaymentMethod === 'MercadoPago';

  useEffect(() => {
    if (updatedPaymentResult) {
      reset();
      setUploadedImg(false);
    }
  }, [updatedPaymentResult, reset]);

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', sm: 'row' }}
      color="primary"
      mb={2}
      gap={2}
      alignItems={{ xs: 'stretch', sm: 'center' }}>
      <Controller
        name="paymentMethod"
        control={control}
        required
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="installments">Método de pago</InputLabel>
            <Select
              fullWidth
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
      <Box display="flex" gap={1} width="100%">
        <TextField
          label="Monto"
          name="amount"
          type="text"
          fullWidth
          variant="outlined"
          InputLabelProps={{
            shrink: !!watch('amount'),
          }}
          InputProps={{
            endAdornment: pendingAmount > 0 && (
              <InputAdornment position="end">
                <Tooltip title="Ingresar monto pendiente">
                  <IconButton
                    onClick={() => setValue('amount', pendingAmount.toFixed(2), { shouldValidate: true })}
                    edge="end"
                    size="small">
                    <VerticalAlignTop />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
          {...register('amount', {
            required: 'Este campo es requerido',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Ingrese un número válido con hasta dos decimales',
            },
            validate: (value) => parseFloat(value) > 0 || 'El monto debe ser mayor que cero',
          })}
        />
        {!isMercadoPago && (
          <label htmlFor="raised-button-file">
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              data-test-id="image-input"
              onChange={handleImageChange}
            />
            <Tooltip title={uploadedImg ? 'Eliminar imagen' : 'Agregar imagen'}>
              <IconButton
                component="span"
                onClick={uploadedImg ? handleRemoveImage : undefined}
                sx={{ height: 56 }}>
                {uploadedImg ? <HideImageOutlined /> : <AddPhotoAlternateOutlined />}
              </IconButton>
            </Tooltip>
          </label>
        )}
      </Box>
    </Box>
  );
};

export default InstallmentPaymentForm;
