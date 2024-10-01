import { Box, Button, Divider, IconButton, Modal, Typography, styled } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { Close } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { selectCreatedItem } from '@/redux/crud/selectors';
import crud from '@/redux/crud/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import EditShippingForm from '@/forms/EditShippingForm';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const EditShippingModal = ({ shipping, open, handlerOpen }) => {
  const shippingMethodOptions = [
    { label: 'OCA', value: 'oca' },
    { label: 'Andreani', value: 'andreani' },
    { label: 'Retiro en oficina', value: 'officePickup' },
    { label: 'Envío con viajes', value: 'tripDelivery' },
  ];
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    reset,
    formState: { isValid },
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setValue('shippingMethod', shipping?.shippingMethod);
    setValue('arrivalDate', shipping?.arrivalDate ? dayjs(shipping.arrivalDate) : null);
    setValue('departureDate', shipping?.departureDate ? dayjs(shipping.departureDate) : null);
    setValue('shippingCode', shipping?.shippingCode);
  }, [shipping]);

  const updateShipping = async (data) => {
    try {
      await dispatch(crud.update({ entity: 'stockReservation', id: shipping.id, jsonData: data }));
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
    updateShipping(data);
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
            Editar envio
          </Typography>
          <IconButton onClick={() => handleClose()}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box component="form" name="add_seller" onSubmit={preSubmit}>
          <EditShippingForm
            register={register}
            setValue={setValue}
            watch={watch}
            control={control}
            shippingMethodOptions={shippingMethodOptions}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isLoading || !isValid}
            size="large"
            fullWidth>
            <Typography variant="button">Guardar cambios</Typography>
          </Button>
          <CustomDialog
            title="Editar envio"
            text="Esta acción no se puede deshacer, ¿Desea continuar?"
            isOpen={dialogOpen}
            onAccept={handleSubmit(onSubmit)}
            onCancel={handleDialogCancel}
          />
        </Box>
      </Box>
    </StyledModal>
  );
};
export default EditShippingModal;
