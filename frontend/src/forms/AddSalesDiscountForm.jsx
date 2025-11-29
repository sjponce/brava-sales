import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import {
  InputAdornment,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  Box,
  Autocomplete,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getPaymentOptions } from '@/redux/sales/selectors';
import sales from '@/redux/sales/actions';

const AddSalesDiscountForm = ({ control, watch, setValue }) => {
  const dispatch = useDispatch();
  const promotions = useSelector((store) => store.crud.list_promotion);
  const currentOptions = useSelector(getPaymentOptions);

  const handlerUpdateOptions = (event, dataOptions) => {
    if (dataOptions === null || typeof dataOptions !== 'string') return;
    const newOptions = { discountType: dataOptions };
    dispatch(sales.updatePaymentOptions(newOptions));
  };

  const addDiscount = () => {
    const discount = watch('discount');
    let totalWithDiscount = watch('totalAmount');
    if (discount) {
      totalWithDiscount -= (totalWithDiscount * discount) / 100;
    }
    setValue('totalWithDiscount', parseFloat(totalWithDiscount?.toFixed(2)));
  };

  useEffect(() => {
    addDiscount();
  }, [watch('discount')]);

  return (
    <Box
      p={1}
      border={1}
      borderRadius={2.5}
      borderColor="background.paper"
      display="flex"
      color="primary"
      mb={2}
      flexDirection="column">
      <Box>
        <ToggleButtonGroup
          fullWidth
          color="primary"
          exclusive
          value={currentOptions?.discountType}
          defaultValue={currentOptions?.discountType}
          onChange={handlerUpdateOptions}
          aria-label="payment type">
          <ToggleButton value="discount" aria-label="Descuento">
            Descuentos
          </ToggleButton>
          <ToggleButton value="promotion" aria-label="Promociónes">
            Promociones
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {currentOptions?.discountType === 'discount' && (
      <Controller
        name="discount"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            margin="normal"
            label="Descuento"
            onChange={(event) => {
              const { value } = event.target;
              if (/^\d*$/.test(value) && (value === '' || parseInt(value, 10) <= 100)) {
                field.onChange(value);
              }
            }}
            InputProps={{
              endAdornment: <InputAdornment position="end">%</InputAdornment>,
            }}
          />
        )}
      />
      )}
      {currentOptions?.discountType === 'promotion' && (
      <Autocomplete
        fullWidth
        id={watch('promotion')?._id || ''}
        value={watch('promotion') || null}
        options={promotions?.result?.items || []}
        getOptionLabel={(option) => `${option?.name} (${option?.percent}%)` || ''}
        onChange={(event, value) => {
          setValue('promotion', value || 0);
          setValue('discount', value?.percent || 0);
        }}
        isOptionEqualToValue={(option, value) => option?._id === value?._id || value === null}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="normal"
            label="Promoción"
          />
        )}
      />
      )}
    </Box>
  );
};

export default AddSalesDiscountForm;
