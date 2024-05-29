import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '@/theme/theme';

const BravaSalesOs = lazy(() => import('./apps/BravaSalesOs'));

export default function RoutApp() {
  const getTheme = () => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme === 'dark' ? darkTheme : lightTheme;
  };
  return (
    <ThemeProvider theme={getTheme()}>
      <Suspense fallback={<PageLoader />}>
      <BrowserRouter>
        <Provider store={store}>
          <Suspense fallback={<PageLoader />}>
            <BravaSalesOs />
          </Suspense>
        </Provider>
      </BrowserRouter>
      </Suspense>
      <CssBaseline />
    </ThemeProvider>
  );
}
