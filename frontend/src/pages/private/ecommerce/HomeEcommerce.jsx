import React, { useEffect } from 'react';
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import sales from '@/redux/sales/actions';
import AddSalesOrderModal from '../sales-orders/components/AddSalesOrderModal';
import ModalSalesOrderDetails from '../sales-orders/components/ModalSalesOrderDetails';
import Loading from '@/components/Loading';
import crud from '@/redux/crud/actions';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import OrdersDialog from './components/OrdersDialog';

const HomeEcommerce = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState({ id: '' });
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const readSalesOrderState = useSelector((store) => store.sales.read);
  const updateSalesOrderState = useSelector((store) => store.sales.update);
  const currentUser = useSelector(selectCurrentAdmin);

  const handleDetails = async (id) => {
    setSelectedRow({ ...selectedRow, id });
    await dispatch(sales.read({ entity: 'sales', id }));
    setOpenDetails(true);
  };

  const updatedPayment = useSelector((state) => state.sales.createPayment);
  const crudUpdate = useSelector((state) => state.crud.update);

  useEffect(() => {
    dispatch(crud.filter({ entity: 'salesOrder', options: { filter: 'customer', equal: currentUser.customer } }));
  }, [readSalesOrderState]);

  useEffect(() => {
    if (!updatedPayment.result && !crudUpdate?.result) return;
    if (updatedPayment.isLoading && crudUpdate?.isLoading) return;
    dispatch(sales.read({ entity: 'sales', id: selectedRow.id }));
  }, [updatedPayment, crudUpdate]);

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
      <ModalSalesOrderDetails open={openDetails} handlerOpen={setOpenDetails} />
      <Loading isLoading={readSalesOrderState?.isLoading || updateSalesOrderState?.isLoading} />
    </Container>
  );
};

export default HomeEcommerce;
