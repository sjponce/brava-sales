import React from 'react';
import { Layout } from 'antd';

export default function AuthLayout({ children }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}
