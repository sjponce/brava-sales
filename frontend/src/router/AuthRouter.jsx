import { Navigate, Route, Routes } from 'react-router-dom';

import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';

import ForgetPassword from '@/pages/ForgetPassword';

const AuthRouter = () => (
  <Routes>
    <Route element={<Login />} path="/" />
    <Route element={<Login />} path="/login" />
    <Route element={<Navigate to="/login" replace />} path="/logout" />
    <Route element={<ForgetPassword />} path="/forgetpassword" />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AuthRouter;
