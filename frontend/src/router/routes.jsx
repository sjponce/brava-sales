import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Sellers from '@/pages/private/sellers/Sellers';
import Shipping from '@/pages/private/shipping/Shipping';
import SalesOrder from '@/pages/private/sales-orders/SalesOrder';
import Customers from '@/pages/private/customers/Customers';
import Products from '@/pages/private/products/Products';
import Home from '@/pages/private/home/Home';
import HomeEcommerce from '@/pages/private/ecommerce/HomeEcommerce';
import NotFound from '@/components/NotFound';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const CommingSoon = lazy(() => import('@/pages/private/CommingSoon.jsx'));

const Dashboard = lazy(() => import('@/pages/private/Dashboard'));
const Ecommerce = lazy(() => import('@/pages/private/Ecommerce'));

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
      path: '/ecommerce',
      element: <Ecommerce />,
      children: [
        {
          path: '/ecommerce',
          element: <HomeEcommerce />,
        },
      ],
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
        {
          path: '/sales-orders',
          element: <SalesOrder />,
          children: [
            {
              path: '/sales-orders/success',
              element: <SalesOrder />,
            },
            {
              path: '/sales-orders/failure',
              element: <SalesOrder />,
            },
            {
              path: '/sales-orders/pending',
              element: <SalesOrder />,
            },
          ],
        },
        {
          path: '/customers',
          element: <Customers />,
        },
        {
          path: '/products',
          element: <Products />,
        },
        {
          path: '/shipping',
          element: <Shipping />,
        },
      ],
    },
  ],
};

export const routesSellers = {
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
      path: '/ecommerce',
      element: <Ecommerce />,
      children: [
        {
          path: '/ecommerce',
          element: <HomeEcommerce />,
        },
      ],
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
          path: '/sales-orders',
          element: <SalesOrder />,
          children: [
            {
              path: '/sales-orders/success',
              element: <SalesOrder />,
            },
            {
              path: '/sales-orders/failure',
              element: <SalesOrder />,
            },
            {
              path: '/sales-orders/pending',
              element: <SalesOrder />,
            },
          ],
        },
        {
          path: '/customers',
          element: <Customers />,
        },
        {
          path: '/products',
          element: <Products />,
        },
        {
          path: '/shipping',
          element: <Shipping />,
        },
      ],
    },
  ],
};

export const routesEcommerce = {
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
      element: <Ecommerce />,
      children: [
        {
          path: '/',
          element: <HomeEcommerce />,
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
