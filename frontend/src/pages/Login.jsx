import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import AuthModule from '@/modules/AuthModule';
import Loading from '@/components/Loading';

const LoginPage = () => {
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    dispatch(login({ loginData: data }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  return (
    <AuthModule
      authContent={(
        <Box>
          <Loading isLoading={isLoading} />
          <Box component="form" onSubmit={handleSubmit(onSubmit)} name="normal_login">
            <LoginForm register={register} />
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
      )}
      AUTH_TITLE="Iniciar sesión"
    />
  );
};

export default LoginPage;
