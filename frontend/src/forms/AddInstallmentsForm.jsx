import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  Box, FormControl, InputLabel, MenuItem, Select,
} from '@mui/material';
import { MONTHLY_INTEREST_RATE, QTY_INSTALLMENTS } from '@/utils/constants';

const AddInstallmentsForm = ({ control, watch, setValue }) => {
  const calculateInterest = (quantity) => (quantity - 1) * MONTHLY_INTEREST_RATE;

  const calculateInstallment = (installments) => {
    const totalWithDiscount = watch('totalWithDiscount');
    const interest = calculateInterest(installments);
    const totalWithInterest = totalWithDiscount * (1 + interest);
    const installmentAmount = totalWithInterest / installments;
    return installmentAmount;
  };

  useEffect(() => {
    if (!watch('totalWithDiscount')) setValue('totalWithDiscount', watch('totalAmount'));
    const totalWithDiscount = watch('totalWithDiscount');
    const interest = calculateInterest(watch('installments'));
    const finalAmount = totalWithDiscount * (1 + interest);
    setValue('finalAmount', parseFloat(finalAmount?.toFixed(2)));
  }, [watch('installments'), watch('totalWithDiscount')]);

  return (
    <Box
      p={1}
      border={1}
      borderRadius={2.5}
      borderColor="background.paper"
      display="flex"
      mb={2}
      color="primary"
      flexDirection="column">
      <Controller
        name="installments"
        control={control}
        defaultValue={1}
        render={({ field }) => (
          <FormControl fullWidth>
            <InputLabel id="installments">Cuotas</InputLabel>
            <Select {...field} labelId="installments" label="Cuotas" value={field.value || 1}>
              {Array.from({ length: QTY_INSTALLMENTS }, (_, i) => i + 1).map((installments) => (
                <MenuItem key={installments} value={installments}>
                  {`${installments} cuota${installments > 1 ? 's' : ''} de
                  $${calculateInstallment(installments).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
    </Box>
  );
};

export default AddInstallmentsForm;
