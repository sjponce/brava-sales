import { createContext, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import crud from '@/redux/crud/actions';
import sales from '@/redux/sales/actions';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

export const ModalSalesOrderContext = createContext();

export const ModalSalesOrderProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSalesOrderId, setSelectedSalesOrderId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const salesState = useSelector((store) => store.sales.read);
  const crudFilterState = useSelector((store) => store.crud.filter);
  const createdPayment = useSelector((state) => state.sales.createPayment);
  const updatedPayment = useSelector((state) => state.sales.updatePayment);
  const crudUpdate = useSelector((state) => state.crud.update);
  const currentUser = useSelector(selectCurrentAdmin);

  useEffect(() => {
    if (!createdPayment?.result && !crudUpdate?.result && !updatedPayment?.result) return;
    if (createdPayment?.isLoading && crudUpdate?.isLoading && updatedPayment?.isLoading) return;
    if (!selectedSalesOrderId) return;
    dispatch(sales.read({ entity: 'sales', id: selectedSalesOrderId }));
  }, [updatedPayment, crudUpdate, createdPayment]);

  // ← Monitorear cuando las requests terminen
  useEffect(() => {
    if (!salesState?.isLoading && !crudFilterState?.isLoading) {
      setIsLoading(false);
    }
  }, [salesState?.isLoading, crudFilterState?.isLoading]);

  const openModal = useCallback(async (salesOrderId) => {
    if (!salesOrderId) return;
    setIsLoading(true);
    setSelectedSalesOrderId(salesOrderId);
    await dispatch(sales.read({ entity: 'sales', id: salesOrderId }));
    if (currentUser.role !== 'customer') {
      await dispatch(
        crud.filter({
          entity: 'stockReservation',
          options: { filter: 'salesOrder', equal: salesOrderId },
        })
      );
    }
    setModalOpen(true);
  }, [dispatch, currentUser]);

  const closeModal = useCallback(() => {
    setSelectedSalesOrderId(null);
    setModalOpen(false);
    setIsLoading(false);
  }, []);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    modalOpen,
    selectedSalesOrderId,
    openModal,
    closeModal,
    isLoading,
  };

  return (
    <ModalSalesOrderContext.Provider value={contextValue}>
      {children}
    </ModalSalesOrderContext.Provider>
  );
};
