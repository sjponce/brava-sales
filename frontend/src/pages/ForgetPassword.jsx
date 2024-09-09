import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import { notification } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import ForgetPasswordForm from '@/forms/ForgetPasswordForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
import { resetAuthState } from '@/redux/auth/actions';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const ForgetPassword = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isValid },
  } = useForm();

  const { onFetch, isLoading } = useOnFetch();
  const { forcePasswordReset } = useSelector(selectCurrentAdmin);

  useEffect(() => {
    if (!forcePasswordReset) navigate('/');
  }, [forcePasswordReset]);

  const handleBackToLogin = () => {
    dispatch(resetAuthState({}));
    navigate('/login');
  };
  async function postData(data) {
    await request.post({ entity: 'forgetpassword', jsonData: data }).then((res) => {
      if (res.success) {
        reset();
        handleBackToLogin();
        notification.config({
          duration: 2,
          maxCount: 2,
        });
        notification.success({
          message: 'OK',
          description: 'Se cambio la contraseña, ingrese nuevamente',
        });
      } else {
        notification.config({
          duration: 2,
          maxCount: 2,
        });
        notification.error({
          message: 'Error',
          description: 'Ocurrio un erorr al cambiar la contraseña',
        });
      }
    });
  }
  const onSubmit = (values) => {
    if (values.password === values.repassword) {
      const callback = postData(values);
      onFetch(callback);
    }
  };

  return (
    <AuthModule
      authContent={(
        <Box>
          <Loading isLoading={isLoading} />
          <Box component="form" name="signup" onSubmit={handleSubmit(onSubmit)}>
            <ForgetPasswordForm register={register} watch={watch} />
            <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
              <Button
                type="submit"
                disabled={!isValid}
                className="login-form-button"
                variant="contained"
                data-test-id="change-password-button"
                fullWidth>
                <Typography variant="button">Cambiar contraseña</Typography>
              </Button>
              <Button onClick={handleBackToLogin}>
                <Typography variant="body2">Regresar al login</Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      AUTH_TITLE="Cambiar contraseña"
    />
  );
};

export default ForgetPassword;
