import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import sales from '@/redux/sales/actions';
import Loading from '@/components/Loading';
import { getCurrentStep } from '@/redux/sales/selectors';
import { selectCartProducts } from '@/redux/cart/selectors';

const SummaryDataStep = ({ watch, handleSubmit, setValue }) => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogCancel = () => {
    setDialogOpen(false);
  };

  const createSalesState = useSelector((store) => store.sales.create);
  const currentStep = useSelector(getCurrentStep);
  const products = useSelector(selectCartProducts);

  const createSalesOrder = async (data) => {
    const orderData = {
      orderDate: new Date(),
      products: data.products,
      totalAmount: data.totalAmount,
      discount: data.discount || 0,
      installmentsCount: data.installments,
      finalAmount: data.finalAmount,
      customer: data.customer._id,
      shippingAddress: data.customer.address,
      responsible: data.responsible,
      ecommerce: true,
    };
    try {
      dispatch(
        sales.create({
          entity: 'sales',
          jsonData: orderData,
        }),
      );
    } catch (error) {
      console.log(error);
    } finally {
      if (!createSalesState.isLoading) {
        setDialogOpen(false);
        dispatch(sales.setCurrentStep(currentStep + 1));
      }
    }
  };

  const parseProducts = () => {
    const parseData = products.map((product) => ({
      product: product.id,
      color: product.color,
      stockId: product.stockId,
      idStock: product.idStock,
      price: product.price,
      sizes: product.sizes,
    }));
    setValue('products', parseData);
  };

  useEffect(() => {
    parseProducts();
  }, [products]);

  const preSubmit = (e) => {
    e.preventDefault();
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    createSalesOrder(data);
    console.log('createSalesOrder', data);
    dispatch(sales.setCurrentStep(currentStep + 1));
  };

  return (
    <Box
      sx={{ overflowY: 'auto', height: '70vh' }}
      component="form"
      onSubmit={preSubmit}
      mt={2}
      mb={1}
      id="step-3"
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={2}
      >
      <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: { xs: 'visible', md: 'auto' } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography variant="button" color="primary">composición de pedido</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Producto</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Talle</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Cantidad</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <React.Fragment key={`${product.stockId} ${product.color}`}>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="subtitle2">{`${product.name} ${product.color}`}</Typography>
                  </TableCell>
                </TableRow>
                {product.sizes.map((item) => (
                  <TableRow key={item.size}>
                    <TableCell />
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.size}`}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.quantity}`}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'visible' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="button" color="primary">Resumen de pagos</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Monto base</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">
                  $
                  {watch('totalAmount')?.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Descuento</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">
                  {watch('discount') ? `${watch('discount')}%` : '-'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Cuotas</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">
                  {watch('installments')}
                  {' '}
                  de $
                  {(watch('finalAmount') / watch('installments'))?.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Monto final</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">
                  $
                  {watch('finalAmount')?.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <CustomDialog
        title="Confirmar pedido"
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={dialogOpen}
        onCancel={handleDialogCancel}
        onAccept={handleSubmit(onSubmit)}
      />
      <Loading isLoading={!!createSalesState.isLoading} />
    </Box>
  );
};

export default SummaryDataStep;
