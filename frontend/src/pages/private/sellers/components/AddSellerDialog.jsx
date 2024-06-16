import { Box, Dialog, DialogActions, DialogContent, DialogTitle, InputAdornment, TextField } from '@mui/material';
import { Button, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddSellerForm from '@/forms/AddSellerForm';
import { selectCreatedItem } from '@/redux/crud/selectors';
import crud from '@/redux/crud/actions';
import EmailIcon from '@mui/icons-material/Email';
const AddSellerDialog = ({ idSeller, isOpen, onCancel }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState } = useForm();
  const isUpdate = !!idSeller.length;
  const { isLoading } = useSelector(selectCreatedItem);

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    if (formState.isValid) {
      dispatch(
        crud.create({
          entity: 'user',
          jsonData: {
            ...data,
          },
        })
      );
      onCancel();
    }
  };
  return (
    <Dialog open={isOpen} onClose={onCancel}>
      <DialogTitle>Crear nuevo vendedor</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit(onSubmit)} id='form-add-seller'>
          <AddSellerForm register={register} />
          {/* <TextField
            label="Correo electrónico"
            name="email"
            type="email"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="disabled" />
                </InputAdornment>
              ),
            }}
            {...register('email', { required: true })}
            variant="outlined"
            size="large"
            fullWidth
            sx={{ mr: 3, minWidth: 200 }}
          /> */}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          disabled={isLoading}
          size="large"
          type="submit"
          form='form-add-seller'
          sx={{ mt: 1 }}>
          <Typography variant="button">
            {isUpdate ? 'Modificar ' : 'Crear '}
            usuario
          </Typography>
        </Button>
        <Button
          type="button"
          variant="outlined"
          color="secondary"
          size="large"
          sx={{ mt: 1 }}
          onClick={onCancel}>
          <Typography variant="button">Atras</Typography>
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddSellerDialog.propTypes = {
  idSeller: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddSellerDialog;
