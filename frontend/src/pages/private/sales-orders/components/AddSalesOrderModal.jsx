import {
  Box, Button, Divider, IconButton, Modal, Typography, styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import AddSalesOrderForm from '@/forms/AddSalesOrderForm';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import sales from '@/redux/sales/actions';
import crud from '@/redux/crud/actions';
import ModifiableProductTable from './ModifiableProductTable';
import stock from '@/redux/stock/actions';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddSalesOrderModal = ({ open, handlerOpen }) => {
  const dispatch = useDispatch();
  const {
    register, handleSubmit, setValue, watch, control,
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [productError, setProductError] = useState(null);

  const validateProducts = (products) => {
    if (!products || products.length === 0) {
      return 'Al menos se necesita un producto';
    }
    let errorMessage = null;
    products.forEach((product, index) => {
      if (!errorMessage) {
        if (!product.price || product.price > 0) {
          errorMessage = `El precio es requerido para el producto ${index + 1}`;
        } else if (!product.sizes?.length) {
          errorMessage = `El talle es requerido para el producto ${index + 1}`;
        } else if (!product.quantity || product.quantity > 0) {
          errorMessage = `La cantidad del producto ${index + 1} no puede ser 0`;
        }
      }
    });

    return errorMessage;
  };

  const createSalesOrder = async (data) => {
    try {
      dispatch(
        sales.create({
          entity: 'sales',
          jsonData: {
            ...data,
          },
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const preSubmit = (e) => {
    e.preventDefault();
    const formData = watch();
    const productsValidation = validateProducts(formData.products);
    if (productsValidation) {
      setProductError(productsValidation);
    } else {
      setProductError(null);
      setDialogOpen(true);
    }
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (data) => {
    createSalesOrder(data);
    setDialogOpen(false);
    handlerOpen(false);
  };

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(stock.listAll({ entity: 'stock' }));
  }, []);

  return (
    <StyledModal open={open}>
      <Box
        width={{ xs: '100%', sm: 800 }}
        height="auto"
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" display="flex" mb={2} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Crear orden de venta
          </Typography>
          <IconButton data-test-id="CloseIcon" onClick={() => handlerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box component="form" name="add_sales_order" onSubmit={preSubmit}>
          <AddSalesOrderForm register={register} setValue={setValue} watch={watch} />
          <Typography variant="overline" textAlign="center">
            Productos
          </Typography>
          <Box mb={2}>
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
          <Button type="submit" variant="contained" color="primary" size="large" fullWidth>
            <Typography variant="button">Crear orden de venta</Typography>
          </Button>
          <CustomDialog
            title="Crear orden de venta"
            text="Esta accion no se puede deshacer, ¿Desea continuar?"
            isOpen={dialogOpen}
            onAccept={handleSubmit(onSubmit)}
            onCancel={handleDialogCancel}
          />
        </Box>
      </Box>
    </StyledModal>
  );
};

AddSalesOrderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handlerOpen: PropTypes.func.isRequired,
};

export default AddSalesOrderModal;
