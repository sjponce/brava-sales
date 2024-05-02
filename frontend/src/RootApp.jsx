import './style/app.css';

import { Suspense, lazy } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const brava-salesOs = lazy(() => import('./apps/brava-salesOs'));

export default function RoutApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <brava-salesOs />
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}
