import { useEffect } from 'react';

import { useLocation, useRoutes } from 'react-router-dom';
import { useAppContext } from '@/context/appContext';

import routes from './routes';

export default function AppRouter() {
  const location = useLocation();
  const { appContextAction } = useAppContext();
  const { app } = appContextAction;

  const routesList = [];

  Object.entries(routes).forEach(([, value]) => {
    routesList.push(...value);
  });

  function getAppNameByPath(path) {
    Object.keys(routes).forEach((key) => {
      if (routes[key].some((route) => route.path === path)) {
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
