import { useSelector } from 'react-redux';
import { ThemeProvider } from '@mui/material';
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
  const theme = useSelector((state) => state.theme);

  const getTheme = () => {
    if (theme) {
      return theme === 'light' ? lightTheme : darkTheme;
    }
    return lightTheme;
  };

  return (
    <ThemeProvider theme={getTheme()}>
      {!isLoggedIn || forcePasswordReset ? <AuthRouter /> : <DefaultApp />}
    </ThemeProvider>
  );
};
export default BravaSalesOs;
