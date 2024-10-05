import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import 'dayjs/locale/en-gb';

const BravaSalesOs = lazy(() => import('./apps/BravaSalesOs'));

const RootApp = () => (
  <Suspense fallback={<PageLoader />}>
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
            <BravaSalesOs />
          </LocalizationProvider>
        </Suspense>
      </Provider>
    </BrowserRouter>
    <CssBaseline />
  </Suspense>
);
export default RootApp;
