import { useEffect } from 'react';

import { useLocation, useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppContext } from '@/context/appContext';
import routes, { routesEcommerce } from './routes';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

export default function AppRouter() {
  const location = useLocation();
  const { appContextAction } = useAppContext();
  const { app } = appContextAction;
  const authUserState = useSelector(selectCurrentAdmin);

  const router = authUserState.role === 'customer' ? routesEcommerce : routes;

  const routesList = [];

  Object.entries(router).forEach(([, value]) => {
    routesList.push(...value);
  });

  function getAppNameByPath(path) {
    Object.keys(router).forEach((key) => {
      if (router[key].some((route) => route.path === path)) {
        return key;
      }
      return '';
    });
    // Return 'default' app  if the path is not found
    return 'default';
  }
  useEffect(() => {
    if (location.pathname === '/') {
      app.default();
    } else {
      const path = getAppNameByPath(location.pathname);
      app.open(path);
    }
  }, [location]);

  const element = useRoutes(routesList);

  return element;
}
