import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import AddSalesOrderForm from '@/forms/AddSalesOrderForm';
import ModifiableProductTable from '../ModifiableProductTable';
import sales from '@/redux/sales/actions';
import { getCurrentStep } from '@/redux/sales/selectors';

const OrderDataStep = ({
  register, watch, control, setValue,
}) => {
  const [productError, setProductError] = useState(null);
  const dispatch = useDispatch();
  const validateProducts = (products) => {
    if (!products || products.length === 0) {
      return 'Al menos se necesita un producto';
    }
    let errorMessage = null;
    products.forEach((product, index) => {
      if (!errorMessage) {
        if (!product.price || product.price <= 0) {
          errorMessage = `El precio es requerido para el producto ${index + 1}`;
        } else if (!product.sizes?.length) {
          errorMessage = `El talle es requerido para el producto ${index + 1}`;
        }
      }
    });

    return errorMessage;
  };

  const currentStep = useSelector(getCurrentStep);

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = watch();
    const productsValidation = validateProducts(formData.products);
    if (productsValidation) {
      setProductError(productsValidation);
    } else {
      setProductError(null);
      dispatch(sales.setCurrentStep(currentStep + 1));
    }
  };

  return (
    <Box sx={{ overflowY: 'auto', height: '55vh' }} component="form" id="step-1" onSubmit={onSubmit}>
      <AddSalesOrderForm register={register} setValue={setValue} watch={watch} />
      <Box mb={1} mt={2}>
        <ModifiableProductTable
          register={register}
          control={control}
          watch={watch}
          setValue={setValue}
        />
      </Box>
      {productError && (
        <Typography variant="body2" color="error" sx={{ mt: 2, mb: 2 }}>
          {productError}
        </Typography>
      )}
    </Box>
  );
};

export default OrderDataStep;
