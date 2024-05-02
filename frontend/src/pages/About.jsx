import { Button, Result } from 'antd';

import useLanguage from '@/locale/useLanguage';

const About = () => {
  const translate = useLanguage();
  return (
    <Result
      status="info"
      title={'brava-sales'}
      subTitle={translate('Do you need help on customize of this app')}
      extra={
        <>
          <p>
            Website : <a href="https://www.brava-salesapp.com">www.brava-salesapp.com</a>{' '}
          </p>
          <p>
            GitHub :{' '}
            <a href="https://github.com/brava-sales/brava-sales-erp-crm">
              https://github.com/brava-sales/brava-sales-erp-crm
            </a>
          </p>
          <Button
            type="primary"
            onClick={() => {
              window.open(`https://www.brava-salesapp.com/contact-us/`);
            }}
          >
            {translate('Contact us')}
          </Button>
        </>
      }
    />
  );
};

export default About;
