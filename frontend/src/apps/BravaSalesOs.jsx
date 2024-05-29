import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material';
import { lazy, Suspense } from 'react';
import { selectAuth } from '@/redux/auth/selectors';
import { AppContextProvider } from '@/context/appContext';
import { lightTheme, darkTheme } from '../theme/theme';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <AppContextProvider>
    <Suspense fallback={<PageLoader />}>
      <ErpApp />
    </Suspense>
  </AppContextProvider>
);

const BravaSalesOs = () => {
  const { isLoggedIn } = useSelector(selectAuth);
  const theme = useSelector((state) => state.theme);

  const getTheme = () => {
    if (theme) {
      return theme === 'light' ? lightTheme : darkTheme;
    }
    return lightTheme;
  };

  return (
    <ThemeProvider theme={getTheme()}>
      {!isLoggedIn ? <AuthRouter /> : <DefaultApp />}
    </ThemeProvider>
  );
};
export default BravaSalesOs;
