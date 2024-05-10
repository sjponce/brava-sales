import React from 'react';
import { Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';

export default function ForgetPasswordForm() {
  return (
    <Form.Item
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
        prefix={<MailOutlined className="site-form-item-icon" />}
        type="email"
        placeholder={'email'}
        size="large"
      />
    </Form.Item>
  );
}
