import React, { useContext, useEffect } from 'react';
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import AddSalesOrderModal from '../sales-orders/components/AddSalesOrderModal';
import crud from '@/redux/crud/actions';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import OrdersDialog from './components/OrdersDialog';
import { ModalSalesOrderContext } from '@/context/modalSalesOrderContext/ModalSalesOrderContext';

const HomeEcommerce = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState({ id: '' });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { openModal } = useContext(ModalSalesOrderContext);

  const readSalesOrderState = useSelector((store) => store.sales.read);
  const currentUser = useSelector(selectCurrentAdmin);

  const handleDetails = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    openModal(id);
  };

  useEffect(() => {
    if (currentUser.customer) {
      dispatch(crud.filter({ entity: 'salesOrder', options: { filter: 'customer', equal: currentUser.customer } }));
    }
  }, [readSalesOrderState]);

  const location = useLocation();

  useEffect(() => {
    if (!location.search) return;
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const salesOrder = searchParams.get('salesOrder');
      console.log('salesOrder from URL:', salesOrder);
      if (!salesOrder || salesOrder === 'null') return;
      handleDetails(salesOrder);
    };
    fetchData();
  }, [dispatch, location]);

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box mb={5} width="100%">
        <img
          src={isMobile ? 'https://i.ibb.co/yP9T6Xy/banner-mobile-1.jpg' : 'https://i.ibb.co/qjF6Kj1/banner-1.jpg'}
          alt="Ecommerce"
          style={{
            borderEndStartRadius: '10px',
            borderEndEndRadius: '10px',
            objectFit: 'cover',
            width: '100%',
            height: 'auto',
          }}
        />
      </Box>
      <ProductCatalog />
      <Cart setOpen={setOpen} />
      <AddSalesOrderModal
        open={open}
        handlerOpen={setOpen}
        handlerDetails={handleDetails}
        ecommerce
      />
      <OrdersDialog handleAction={handleDetails} />
    </Container>
  );
};

export default HomeEcommerce;
