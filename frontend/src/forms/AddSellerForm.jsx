import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import React from 'react';

const AddSellerForm = () => (
  <>
    <Form.Item
      name="name"
      label="nombre"
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Input prefix={<UserOutlined className="site-form-item-icon" />} size="large" />
    </Form.Item>
    <Form.Item
      name="email"
      label="correo electrónico"
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
        prefix={<MailOutlined className="site-form-item-icon" />}
        type="email"
        size="large"
      />
    </Form.Item>
    <Form.Item
      name="password"
      label="contraseña"
      rules={[
        {
          required: true,
        },
      ]}
    >
      <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
    </Form.Item>
  </>
);

export default AddSellerForm;
