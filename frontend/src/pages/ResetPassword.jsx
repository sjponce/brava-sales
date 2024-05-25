import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPassword } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';

import { Button, Form } from 'antd';

import ResetPasswordForm from '@/forms/ResetPasswordForm';

import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
const ResetPassword = () => {
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const { userId, resetToken } = useParams();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(
      resetPassword({
        resetPasswordData: {
          password: values.password,
          userId,
          resetToken
        }
      })
    );
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const validateMessages = {
    required: 'El campo es requerido',
    types: {
      email: 'Ingrese un correo válido'
    }
  };

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          name="signup"
          className="login-form"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <ResetPasswordForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size="large">
              {'Actualizar contraseña'}
            </Button>
            {'O'} <a href="/login"> {'Ya tengo una cuenta'} </a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };
  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Reestablecer Contraseña" />;
};

export default ResetPassword;
