import {
  Box, Button, Divider, IconButton, Modal, Typography, styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import AddSellerForm from '@/forms/AddSellerForm';
import { selectCreatedItem, selectCurrentItem } from '@/redux/crud/selectors';
import { registerUser, updateUser } from '@/redux/auth/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddSellerModal = ({
  idSeller, open, handlerOpen,
}) => {
  const roleOptions = [
    { label: 'Administrador', value: 'admin' },
    { label: 'Vendedor', value: 'seller' },
  ];
  const dispatch = useDispatch();
  const sellerData = useSelector(selectCurrentItem);
  const {
    register, handleSubmit, setValue, watch, reset,
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isUpdate = !!idSeller.length;

  const createSeller = async (data) => {
    try {
      dispatch(
        registerUser({
          registerData: {
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
      setValue('id', sellerData.result._id);
      setValue('email', sellerData.result.user.email);
      setValue('name', sellerData.result.name);
      setValue('surname', sellerData.result.surname);
      setValue('phone', sellerData.result.phone);
      setValue('photo', sellerData.result.photo);
      setValue('role', sellerData.result.user.role);
    }
  }, [sellerData]);

  const updateSeller = async (data) => {
    try {
      dispatch(
        updateUser({
          userId: sellerData.result.user._id,
          updateData: {
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
      console.log(data);
      updateSeller(data);
    } else {
      createSeller(data);
    }
    reset();
    setDialogOpen(false);
    handlerOpen(false);
  };

  const handleClose = () => {
    reset();
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
          <IconButton onClick={() => handleClose()}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box component="form" name="add_seller" onSubmit={preSubmit}>
          <AddSellerForm
            register={register}
            setValue={setValue}
            watch={watch}
            roleOptions={roleOptions}
            isUpdate={isUpdate}
            />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading}
            size="large"
            fullWidth>
            <Typography variant="button">
              {isUpdate ? 'Guardar cambios ' : 'Crear nuevo'}
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

AddSellerModal.propTypes = {
  idSeller: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handlerOpen: PropTypes.func.isRequired,
};

export default AddSellerModal;
