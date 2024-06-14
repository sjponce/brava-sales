import { Box } from '@mui/material';
import { Button, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import Loading from '@/components/Loading';
import AddSellerForm from '@/forms/AddSellerForm';
import { request } from '@/request';

const AddSellerDialog = ({ idSeller }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const response = await request.create({ entity: 'user', data });
    if (response) {
      const updatedRows = response.result.map((row) => ({
        ...row,
        id: row._id,
      }));
      setRows(updatedRows);
    }
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);
  return (
    <Box>
      <Loading isLoading={isLoading} />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} name="normal_login">
        <AddSellerForm />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          size="large"
          fullWidth
          sx={{ mt: 1 }}
        >
          <Typography variant="button">Iniciar sesión</Typography>
        </Button>
      </Box>
    </Box>
  );
};

AddSellerDialog.propTypes = {
  idSeller: PropTypes.string,
};

AddSellerDialog.defaultProps = {
  idSeller: '',
};

export default AddSellerDialog;
