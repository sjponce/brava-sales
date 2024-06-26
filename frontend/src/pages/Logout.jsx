import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout as logoutAction } from '@/redux/auth/actions';
import PageLoader from '@/components/PageLoader';

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function asyncLogout() {
    dispatch(logoutAction());
  }

  useEffect(() => {
    asyncLogout();
    navigate('/login');
  }, []);

  return <PageLoader />;
};
export default Logout;
