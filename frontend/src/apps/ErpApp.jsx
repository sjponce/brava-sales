import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import PageLoader from '@/components/PageLoader';

import { settingsAction } from '@/redux/settings/actions';
import { currencyAction } from '@/redux/currency/actions';
import { selectSettings } from '@/redux/settings/selectors';

import AppRouter from '@/router/AppRouter';

export default function ErpCrmApp() {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
    dispatch(currencyAction.list());
  }, []);

  const { isSuccess: settingIsloaded } = useSelector(selectSettings);

  if (settingIsloaded)
    return (
      <Layout>
        <AppRouter />
      </Layout>
    );
  else return <PageLoader />;
}
