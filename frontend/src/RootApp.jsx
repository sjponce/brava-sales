import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import PageLoader from '@/components/PageLoader';
import store from '@/redux/store';

const BravaSalesOs = lazy(() => import('./apps/BravaSalesOs'));

const RootApp = () => (
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
export default RootApp;
