import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Checkbox, Form, Input } from 'antd';
import React from 'react';

export default function LoginForm() {
  return (
    <div>
      <Form.Item
        label={'Correo electrónico'}
        name="email"
        rules={[
          {
            required: true,
          },
          {
            type: 'email',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={'correo electrónico'}
          type="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        label={'Contraseña'}
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={'contraseña'}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{'Mantener la sesión iniciada'}</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgetpassword">
          {'Olvidé mi contraseña'}
        </a>
      </Form.Item>
    </div>
  );
}
