import { Close } from '@mui/icons-material';
import {
  Box, Button, Divider, IconButton, Modal, styled, Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updatePassword } from '@/redux/auth/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import UpdatePasswordForm from '@/forms/UpdatePasswordForm';

const SytledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const UpdatePasswordModal = ({ idUser, open, handlerOpen }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register, reset, handleSubmit, watch,
  } = useForm();

  const onSubmit = async (data) => {
    const passwordData = {
      password: data.password,
    };
    try {
      dispatch(updatePassword({ userId: idUser, passwordData }));
    } catch (error) {
      console.log(error);
    }
    reset();
    setDialogOpen(false);
    handlerOpen(false);
  };

  const handleClose = () => {
    reset();
    handlerOpen(false);
  };

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const preSubmit = (e) => {
    e.preventDefault();
    if (watch('password') !== watch('confirmPassword')) return;
    setDialogOpen(true);
  };

  return (
    <SytledModal open={open}>
      <Box
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" display="flex" mb={2} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Actualizar contraseña
          </Typography>
          <IconButton onClick={() => handleClose()}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box component="form" name="update-password" onSubmit={preSubmit}>
          <UpdatePasswordForm register={register} watch={watch} />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            size="large"
            >
            <Typography variant="button">Guardar cambios</Typography>
          </Button>
          <CustomDialog
            title="Actualizar contraseña"
            text="Esta acción no se puede deshacer, ¿Desea continuar?"
            isOpen={dialogOpen}
            onAccept={handleSubmit(onSubmit)}
            onCancel={handleDialogCancel}
          />
        </Box>
      </Box>
    </SytledModal>
  );
};

export default UpdatePasswordModal;
