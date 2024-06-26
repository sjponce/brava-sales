import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Sellers from '@/pages/private/sellers/Sellers';
import Home from '@/pages/private/home/Home';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
// const NotFound = lazy(() => import('@/pages/NotFound.jsx'));
const CommingSoon = lazy(() => import('@/pages/private/CommingSoon.jsx'));

const Dashboard = lazy(() => import('@/pages/private/Dashboard'));

const routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/verify/*',
      element: <Navigate to="/" />,
    },
    {
      path: '/resetpassword/*',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/',
      element: <Dashboard />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '*',
          element: <CommingSoon />,
        },
        {
          path: '/sellers',
          element: <Sellers />,
        },
      ],
    },
  ],
};

export default routes;
