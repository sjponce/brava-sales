import { Box, DialogContent, DialogTitle } from '@mui/material';
import { Button, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import AddSellerForm from '@/forms/AddSellerForm';
import { selectCreatedItem } from '@/redux/crud/selectors';
import crud from '@/redux/crud/actions';

const AddSellerDialog = ({ idSeller }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const isUpdate = !!idSeller.length;
  const onSubmit = async (data) => {
    dispatch(
      crud.create({
        entity: 'user',
        jsonData: {
          ...data,
          /* password: 'admin123',
          email: 'johntravolta@demo.com',
          nombre: 'John',
          apellido: 'Travolta',
          telefono: '66666666',
          role: 'SELLER',
          enabled: true,
          photo:
            'https://www.pngitem.com/pimgs/m/153-1537758_user-icon-png-transparent-png-user-icon-png-transparent.png', */
        },
      }),
    );
  };
  const { isLoading } = useSelector(selectCreatedItem);
  return (
    <>
      <DialogTitle>Crear nuevo vendedor</DialogTitle>
      <DialogContent>
        {/* TODO: fix css */}
        <Box sx={{ width: '100%' }}>
          <Box
            component="form"
            sx={{ width: '100%' }}
            onSubmit={handleSubmit(onSubmit)}
            name="add_seller">
            <AddSellerForm register={register} />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
              size="large"
              sx={{ mt: 1 }}>
              <Typography variant="button">
                {isUpdate ? 'Modificar ' : 'Crear '}
                usuario
              </Typography>
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </>
  );
};

AddSellerDialog.propTypes = {
  idSeller: PropTypes.string.isRequired,
};

export default AddSellerDialog;
