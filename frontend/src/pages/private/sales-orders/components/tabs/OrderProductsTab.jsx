import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import sales from '@/redux/sales/actions';
import { getStockProducts } from '@/redux/stock/selectors';

const OrderProductsTab = ({ saleData }) => {
  const stockData = useSelector(getStockProducts)?.result;
  const [productsReservations, setProductsReservations] = useState({});
  const [productsStock, setProductsStock] = useState({});
  const [dialogData, setDialogData] = useState({ open: false, productId: '' });
  const dispatch = useDispatch();

  const calculateStockAvailable = () => {
    const stockMap = {};
    Object.keys(stockData).forEach((idStock) => {
      stockMap[idStock] = {};
      stockData[idStock].forEach((size) => {
        stockMap[idStock][size.number] = size.stock;
      });
    });
    setProductsStock(stockMap);
  };

  const handleCancel = () => {
    setDialogData({ open: false, productId: '' });
  };

  const openDialog = (productId) => {
    setDialogData({ open: true, productId });
  };

  const handleAccept = async (productId) => {
    setDialogData({ open: false, productId: null });
    const jsonData = { orderId: saleData._id, productId };
    try {
      await dispatch(sales.reserveStock({ jsonData }));
    } finally {
      setDialogData({ open: false, productId: null });
    }
  };

  const calculateReservationsForAllProducts = () => {
    const productReservationsMap = {};
    saleData.products.forEach((product) => {
      const reservedMap = {};
      product.reservations.forEach((reservation) => {
        reservation.sizes.forEach((size) => {
          if (reservedMap[size.size]) {
            reservedMap[size.size] += size.quantity;
          } else {
            reservedMap[size.size] = size.quantity;
          }
        });
      });
      productReservationsMap[product._id] = reservedMap;
    });
    setProductsReservations(productReservationsMap);
  };

  useEffect(() => {
    if (saleData) calculateReservationsForAllProducts();
    if (stockData) calculateStockAvailable();
  }, [saleData, stockData]);

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2.5, overflow: { xs: 'auto', md: 'auto' } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Producto</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Talle</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Total</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Faltan</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Stock</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Reservado</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {saleData?.products?.map((p) => (
              <React.Fragment key={p._id}>
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="subtitle2">{`${p.product.stockId} ${p.color}`}</Typography>
                  </TableCell>
                  <TableCell>
                    <Button variant="text" fullWidth onClick={() => openDialog(p._id)}>
                      Asignar stock
                    </Button>
                  </TableCell>
                </TableRow>
                {p.sizes.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell />
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.size}`}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.quantity}`}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.quantity - (productsReservations[p._id]?.[item.size] ?? 0)}`}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">
                        {productsStock[p.idStock]?.[item.size] ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">
                        {productsReservations[p._id]?.[item.size] ?? 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <CustomDialog
        isOpen={dialogData.open}
        title="Confirmar reserva de stock"
        text="¿Desea asignar el stock disponible al producto seleccionado?"
        onCancel={() => handleCancel()}
        onAccept={() => handleAccept(dialogData.productId)}
      />
    </Box>
  );
};

export default OrderProductsTab;
