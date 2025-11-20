import { Box, Button, IconButton, Modal, Tooltip, Typography, styled } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import AddTravelForm from '@/forms/AddTravelForm';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import travelsRequest from '@/request/travelsRequest';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddTravelModal = ({ open, handlerOpen }) => {
  const { setValue, watch, reset, handleSubmit } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);

  const preSubmit = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const onSubmit = async (data) => {
    try {
      await travelsRequest.createTravel({
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        vehicleId: data.vehicle?._id,
        driverName: data.driverName || data.vehicle?.driver?.name,
        stops: data.stops || [],
        useExtraStock: !!data.useExtraStock,
        extraStockItems: data.extraStockItems || [],
      });
    } catch (error) {
      // handled globally
    } finally {
      reset();
      setDialogOpen(false);
      handlerOpen(false);
    }
  };

  const handleClose = () => {
    reset();
    handlerOpen(false);
  };
  return (
    <StyledModal open={open}>
      <Box
        width={{ xs: '100%', sm: 800 }}
        height={{ xs: '100%', sm: 'auto' }}
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" display="flex" mb={3} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Nuevo Viaje
          </Typography>
          <Tooltip title="Cerrar" arrow>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Tooltip>
        </Box>
        <Box component="form" name="add_travel" onSubmit={preSubmit}>
          <AddTravelForm setValue={setValue} watch={watch} />
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large">
              Crear Viaje
            </Button>
          </Box>
          <CustomDialog
            title="Crear nuevo viaje"
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

export default AddTravelModal;
