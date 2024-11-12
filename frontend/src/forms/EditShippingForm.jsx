import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { Controller } from 'react-hook-form';

const EditShippingForm = ({ control, register, watch, setValue, shippingMethodOptions }) => {
  const today = dayjs();
  return (
    <Box sx={{ overflowY: 'auto', height: '60vh', padding: 1, width: '100%' }}>
      <Box display="flex" flexDirection="column" gap={3}>
        <Controller
          name="shippingMethod"
          control={control}
          render={({ field }) => (
            <FormControl>
              <InputLabel id="shippingMethod">Método de envio</InputLabel>
              <Select
                {...field}
                labelId="shippingMethod"
                label="Método de envio"
                value={field?.value || 1}>
                {shippingMethodOptions?.map((method) => (
                  <MenuItem key={method.value || method} value={method.value || method}>
                    {method.label || method}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        <DatePicker
          label="Fecha de Salida"
          value={watch('departureDate')}
          onChange={(newValue) => setValue('departureDate', newValue)}
          slotProps={{
            textField: {
              readOnly: true,
            }
          }}
          minDate={today}
        />

        <DatePicker
          label="Fecha de Legada"
          value={watch('arrivalDate')}
          onChange={(newValue) => setValue('arrivalDate', newValue)}
          slotProps={{
            textField: {
              readOnly: true,
            }
          }}
          minDate={watch('departureDate') || today}
        />

        <TextField
          label="Código de envío"
          name="shippingCode"
          fullWidth
          {...register('shippingCode')}
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default EditShippingForm;
