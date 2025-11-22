import { Box, Typography } from '@mui/material';
// import DataTableProducts from './components/DataTableProducts';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductsCatalog from './components/ProductCatalog';
import stock from '@/redux/stock/actions';
import Loading from '@/components/Loading';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import ModalProductDetails from './components/ModalProductDetails';

const Products = () => {
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({
    id: '',
    name: '',
    stockId: '',
  });

  const dispatch = useDispatch();
  const productState = useSelector((store) => store.stock.listAll);
  const readProductState = useSelector((store) => store.stock.read);
  const updateProductState = useSelector((store) => store.stock.update);

  const handleDialogCancel = () => {
    setOpenCreateDialog(false);
  };

  const handleDialogAccept = async () => {
    await dispatch(stock.delete({ entity: 'stock', id: selectedProduct.id }));
    setOpenCreateDialog(false);
  };

  const handleProductModal = async (id, update, stockId) => {
    setSelectedProduct({ ...selectedProduct, id, stockId });
    await dispatch(stock.read({ entity: 'stock', id }));
    setIsUpdate(update);
    setOpenDetailsModal(true);
  };

  useEffect(() => {
    dispatch(stock.listAll({ entity: 'stock' }));
    console.log('Products mounted');
  }, [updateProductState]);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="overline" color="primary" align="center">
        Productos
      </Typography>
      <Box sx={{ flex: 1, minHeight: 0 }}>
        {!productState?.isLoading && (
          <ProductsCatalog handleModal={handleProductModal} />
        )}
      </Box>
      <CustomDialog
        title={`Deshabilitar: ${selectedProduct.name}`}
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={openCreateDialog}
        onAccept={handleDialogAccept}
        onCancel={handleDialogCancel}
      />
      <ModalProductDetails
        productId={selectedProduct.id}
        handlerOpen={setOpenDetailsModal}
        open={openDetailsModal}
        isUpdate={isUpdate}
        stockId={selectedProduct.stockId}
      />
      <Loading isLoading={
        productState?.isLoading
        || readProductState?.isLoading
        || updateProductState?.isLoading
        } />
    </Box>
  );
};

export default Products;
