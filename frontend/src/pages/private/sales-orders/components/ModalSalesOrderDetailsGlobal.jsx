// pages/private/sales-orders/components/ModalSalesOrderDetailsGlobal.jsx
import { useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ModalSalesOrderContext } from '@/context/modalSalesOrderContext/ModalSalesOrderContext';
import sales from '@/redux/sales/actions';
import ModalSalesOrderDetails from './ModalSalesOrderDetails';
import Loading from '@/components/Loading';

const ModalSalesOrderDetailsGlobal = () => {
  const dispatch = useDispatch();
  const { modalOpen,
    selectedSalesOrderId, closeModal, isLoading } = useContext(ModalSalesOrderContext);

  const salesReadState = useSelector((store) => store.sales.read);
  const crudFilterState = useSelector((store) => store.crud.filter);
  const createdPayment = useSelector((state) => state.sales.createPayment);
  const createMPLink = useSelector((state) => state.sales.createMPLink);
  const updatedPayment = useSelector((state) => state.sales.updatePayment);
  const crudUpdate = useSelector((state) => state.crud.update);
  const deleteSalesOrderState = useSelector((store) => store.sales.delete);
  const reserveStockState = useSelector((store) => store.sales.reserveStock);

  useEffect(() => {
    if (!createdPayment?.result && !crudUpdate?.result && !updatedPayment?.result) return;
    if (createdPayment?.isLoading && crudUpdate?.isLoading && updatedPayment?.isLoading) return;
    dispatch(sales.read({ entity: 'sales', id: selectedSalesOrderId }));
  }, [updatedPayment, crudUpdate, createdPayment]);

  const loading = isLoading
    || createdPayment?.isLoading
    || updatedPayment?.isLoading
    || crudUpdate?.isLoading
    || createMPLink?.isLoading
    || salesReadState?.isLoading
    || crudFilterState?.isLoading
    || deleteSalesOrderState?.isLoading
    || reserveStockState?.isLoading;

  return (
    <>
      <ModalSalesOrderDetails
        open={modalOpen}
        handlerOpen={closeModal}
      />
      <Loading isLoading={loading}
      />
    </>
  );
};

export default ModalSalesOrderDetailsGlobal;
