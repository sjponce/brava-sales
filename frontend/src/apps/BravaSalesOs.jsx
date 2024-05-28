import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import { AppContextProvider } from '@/context/appContext';
import { ThemeProvider } from '@mui/material';
import { lightTheme, darkTheme } from '../theme/theme';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <AppContextProvider>
    <Suspense fallback={<PageLoader />}>
      <ErpApp />
    </Suspense>
  </AppContextProvider>
);

export default function BravaSalesOs() {
  const { isLoggedIn } = useSelector(selectAuth);
  const theme = useSelector((state) => state.theme);
  
  const getTheme = () =>{
    if (theme) {
      return theme === 'light' ? lightTheme : darkTheme;
    }
    return lightTheme;
  }

  return (
    <ThemeProvider theme={getTheme()}>{!isLoggedIn ? <AuthRouter /> : <DefaultApp />}</ThemeProvider>
  );
}
