import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Link, Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import ForgetPasswordForm from '@/forms/ForgetPasswordForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const { onFetch, isSuccess, isLoading } = useOnFetch();

  function postData(data) {
    return request.post({ entity: 'forgetpassword', jsonData: data });
  }

  const onSubmit = (values) => {
    const callback = postData(values);
    onFetch(callback);
  };

  if (!isSuccess) {
    return (
      <AuthModule
        authContent={(
          <Box>
            <Loading isLoading={isLoading} />
            <Box component="form" name="signup" onSubmit={handleSubmit(onSubmit)}>
              <ForgetPasswordForm register={register} />
              <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
                <Button type="submit" className="login-form-button" variant="contained" fullWidth>
                  <Typography variant="button">Cambiar contraseña</Typography>
                </Button>
                <Link href="/login">
                  <Typography variant="body2">Regresar al login</Typography>
                </Link>
              </Box>
            </Box>
          </Box>
        )}
        AUTH_TITLE="Olvidé mi contraseña"
      />
    );
  }
  return (
    <Box>
      <Typography>
        Se ha enviado un correo electrónico con instrucciones para cambiar la contraseña
      </Typography>
      <Button
        onClick={() => {
          navigate('/login');
        }}
      >
        <Typography>Login</Typography>
      </Button>
    </Box>
  );
};

export default ForgetPassword;
