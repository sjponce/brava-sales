/* eslint-disable import/no-unresolved */
import './style/app.css';
import { Suspense, lazy } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from '@/redux/store';
import PageLoader from '@/components/PageLoader';

const BravaSalesOs = lazy(() => import('./apps/BravaSalesOs'));
export default function RootApp() {
  return (
    <BrowserRouter>
      <Provider store={store}>
        <Suspense fallback={<PageLoader />}>
          <BravaSalesOs />
        </Suspense>
      </Provider>
    </BrowserRouter>
  );
}
