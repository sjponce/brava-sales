import {
  Box, Button, Divider, IconButton, Modal, Typography, styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import AddSalesOrderForm from '@/forms/AddSalesOrderForm';
import { selectCreatedItem, selectCurrentItem } from '@/redux/crud/selectors';
import crud from '@/redux/crud/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddSalesOrderModal = ({
  idSalesOrder, open, handlerOpen,
}) => {
  const roleOptions = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Vendedor', value: 'seller' },
  ];
  const dispatch = useDispatch();
  const salesOrderData = useSelector(selectCurrentItem);
  const {
    register, handleSubmit, setValue, watch,
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isUpdate = !!idSalesOrder.length;

  const createSalesOrder = async (data) => {
    try {
      dispatch(
        crud.create({
          entity: 'user',
          jsonData: {
            ...data,
            role: roleOptions.find((role) => role.label === data.role)?.value ?? watch('role'),
          },
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isUpdate) {
      setValue('id', salesOrderData.result._id);
      setValue('email', salesOrderData.result.email);
      setValue('password', salesOrderData.result.password);
      setValue('name', salesOrderData.result.name);
      setValue('surname', salesOrderData.result.surname);
      setValue('phone', salesOrderData.result.phone);
      setValue('photo', salesOrderData.result.photo);
      setValue('role', salesOrderData.result.role);
    }
  }, [salesOrderData]);

  const updateSalesOrder = async (data) => {
    try {
      dispatch(
        crud.update({
          entity: 'user',
          id: idSalesOrder,
          jsonData: {
            ...data,
            role: roleOptions.find((role) => role.label === data.role)?.value ?? watch('role'),
          },
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  const preSubmit = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (data) => {
    if (isUpdate) {
      updateSalesOrder(data);
    } else {
      createSalesOrder(data);
    }
    setDialogOpen(false);
    handlerOpen(false);
  };

  const { isLoading } = useSelector(selectCreatedItem);

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
            {isUpdate ? 'Editar vendedor ' : 'Crear vendendor'}
          </Typography>
          <IconButton onClick={() => handlerOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box component="form" name="add_sales_order" onSubmit={preSubmit}>
          <AddSalesOrderForm
            register={register}
            setValue={setValue}
            watch={watch}
            roleOptions={roleOptions} />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            size="large"
            fullWidth>
            <Typography variant="button">
              {isUpdate ? 'Modificar ' : 'Crear '}
              vendedor
            </Typography>
          </Button>
          <CustomDialog
            title={`${isUpdate ? 'Editar' : 'Crear nuevo'} vendedor`}
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
  idSalesOrder: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handlerOpen: PropTypes.func.isRequired,
};

export default AddSalesOrderModal;
