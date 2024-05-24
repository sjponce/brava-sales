import { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';
import { AppContextProvider } from '@/context/appContext';

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

  if (!isLoggedIn) return <AuthRouter />;
  else {
    return <DefaultApp />;
  }
}
