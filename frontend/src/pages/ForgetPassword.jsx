import { useNavigate } from 'react-router-dom';

import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import { Button, Form, Result } from 'antd';

import ForgetPasswordForm from '@/forms/ForgetPasswordForm';

import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const ForgetPassword = () => {
  const navigate = useNavigate();

  const { onFetch, isSuccess, isLoading } = useOnFetch();

  async function postData(data) {
    return await request.post({ entity: 'forgetpassword', jsonData: data });
  }

  const onFinish = (values) => {
    const callback = postData(values);
    onFetch(callback);
  };

  const validateMessages = {
    required: 'El campo es requerido',
    types: {
      email: 'Ingrese un correo válido',
    },
  };

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          name="signup"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <ForgetPasswordForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size="large">
              {'Cambiar contraseña'}
            </Button>
            {'O'} <a href="/login"> {'Ya tengo una cuenta'} </a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };
  if (!isSuccess) {
    return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Olvidé mi contraseña" />;
  } else {
    return (
      <Result
        status="success"
        title={'Revisa tu email para reestablecer tu contraseña'}
        style={{ maxWidth: '450px', margin: 'auto' }}
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(`/login`);
            }}
          >
            {'Login'}
          </Button>
        }
      ></Result>
    );
  }
};

export default ForgetPassword;
