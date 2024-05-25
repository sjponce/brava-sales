import { Button } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
export default function DashboardModule() {
  const navigate = useNavigate();
  return (
    <>
      <Content>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh',
          }}
        >
          <span>Logged in!</span>

          <Button
            type="primary"
            onClick={() => {
              navigate('/logout');
            }}
          >
            {'Logout'}
          </Button>
        </div>
      </Content>
    </>
  );
}
