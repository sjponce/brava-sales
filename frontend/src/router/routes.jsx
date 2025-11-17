import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Sellers from '@/pages/private/sellers/Sellers';
import Shipping from '@/pages/private/shipping/Shipping';
import SalesOrder from '@/pages/private/sales-orders/SalesOrder';
import Customers from '@/pages/private/customers/Customers';
import Products from '@/pages/private/products/Products';
import Home from '@/pages/private/home/Home';
import HomeEcommerce from '@/pages/private/ecommerce/HomeEcommerce';
import Reports from '@/pages/private/reports/ClientsReport';
import NotFound from '@/components/NotFound';
import Trips from '@/pages/private/trips/Trips';
import TravelDetails from '@/pages/private/trips/TravelDetails';
import ProductsReport from '@/pages/private/reports/ProductsReport';

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
          path: '/trips',
          element: <Trips />,
        },
        {
          path: '/trips/:id',
          element: <TravelDetails />,
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
        {
          path: '/productsReport',
          element: <ProductsReport />,
        },
        {
          path: '/clientsReport',
          element: <Reports />,
        }
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
        {
          path: '/trips',
          element: <Trips />,
        },
        {
          path: '/trips/:id',
          element: <TravelDetails />,
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
        {
          path: '/success',
          element: <HomeEcommerce />,
        },
        {
          path: '/failure',
          element: <HomeEcommerce />,
        },
        {
          path: '/pending',
          element: <HomeEcommerce />,
        },
        {
          path: '/sales-orders',
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
