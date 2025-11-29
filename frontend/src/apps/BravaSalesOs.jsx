import { useSelector } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lazy } from 'react';
import { selectAuth, selectCurrentAdmin } from '@/redux/auth/selectors';
import { AppContextProvider } from '@/context/appContext';
import { lightTheme, darkTheme } from '../theme/theme';
import AuthRouter from '@/router/AuthRouter';
import GlobalDownloadManager from '../utils/GlobalDownloadManager';
import ModalSalesOrderDetailsGlobal from '@/pages/private/sales-orders/components/ModalSalesOrderDetailsGlobal';
import { ModalSalesOrderProvider } from '@/context/modalSalesOrderContext/ModalSalesOrderContext';
import { ProductsProvider } from '@/context/productsContext/ProducsContext';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <AppContextProvider>
    <ProductsProvider>
      <ModalSalesOrderProvider>
        <ErpApp />
        <GlobalDownloadManager />
        <ModalSalesOrderDetailsGlobal />
      </ModalSalesOrderProvider>
    </ProductsProvider>
  </AppContextProvider>
);

const BravaSalesOs = () => {
  const { isLoggedIn } = useSelector(selectAuth);
  const { forcePasswordReset } = useSelector(selectCurrentAdmin);
  const themeMode = useSelector((state) => state.theme);

  const currentTheme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {!isLoggedIn || forcePasswordReset ? <AuthRouter /> : <DefaultApp />}
    </ThemeProvider>
  );
};
export default BravaSalesOs;
