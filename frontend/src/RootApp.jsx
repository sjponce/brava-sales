import './style/global.scss';
import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { lightTheme, darkTheme } from './theme/theme';
import { current } from '@reduxjs/toolkit';

const BravaSalesOs = lazy(() => import('./apps/BravaSalesOs'));

export default function RoutApp() {
  return (
    <Suspense fallback={<PageLoader />}>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<PageLoader />}>
            <BravaSalesOs />
          </Suspense>
        </Provider>
      </BrowserRouter>
      <CssBaseline />
    </Suspense>
  );
}
