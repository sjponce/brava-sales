import { lazy, Suspense } from 'react';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import PageLoader from '@/components/PageLoader';
import AuthRouter from '@/router/AuthRouter';

const ErpApp = lazy(() => import('./ErpApp'));

const DefaultApp = () => (
  <Suspense fallback={<PageLoader />}>
    <ErpApp />
  </Suspense>
);

export default function BravaSalesOs() {
  const { isLoggedIn } = useSelector(selectAuth);

  if (!isLoggedIn) return <AuthRouter />;
  else {
    return <DefaultApp />;
  }
}
