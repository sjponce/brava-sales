import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Add, Remove } from '@mui/icons-material';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import sales from '@/redux/sales/actions';
import { getStockProducts } from '@/redux/stock/selectors';

const OrderProductsTab = ({ saleData }) => {
  const stockData = useSelector(getStockProducts)?.result;
  const reservationsData = useSelector((store) => store.crud.filter)?.result?.result;
  const [reservedProducts, setReservedProducts] = useState({});
  const [productsStock, setProductsStock] = useState({});
  const [dialogData, setDialogData] = useState({ open: false });
  const [quantities, setQuantities] = useState({});
  const dispatch = useDispatch();

  const calculateStockAvailable = () => {
    const stockMap = {};
    Object.keys(stockData).forEach((idStock) => {
      stockMap[idStock] = {};
      stockData[idStock]?.forEach((size) => {
        stockMap[idStock][size.number] = size.stock;
      });
    });
    setProductsStock(stockMap);
  };

  const handleQuantityChange = (productId, size, value, max) => {
    let newValue = Number.isNaN(value) ? 0 : value;
    if (newValue > max) newValue = max;
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: {
        ...prevQuantities[productId],
        [size]: newValue,
      },
    }));
  };

  const incrementQuantity = (productId, size, pending) => {
    const currentQuantity = quantities[productId]?.[size] ?? 0;
    const stockQuantity = productsStock[productId]?.[size] ?? 0;
    if (currentQuantity < pending && currentQuantity < stockQuantity) {
      handleQuantityChange(productId, size, currentQuantity + 1, pending);
    }
  };

  const decrementQuantity = (productId, size) => {
    const currentQuantity = quantities[productId]?.[size] ?? 0;
    if (currentQuantity > 0) {
      handleQuantityChange(productId, size, currentQuantity - 1, currentQuantity);
    }
  };

  const handleCancel = () => {
    setDialogData({ open: false });
  };

  const preSubmit = (e) => {
    e.preventDefault();
    if (Object.values(quantities)
      .some((product) => Object.values(product).some((quantity) => quantity > 0))) {
      setDialogData({ open: true });
    }
  };

  const handleAccept = async () => {
    setDialogData({ open: false });
    const products = saleData.products.map((product) => ({
      productId: product._id,
      sizes: Object.keys(quantities[product.idStock] ?? {})
        .filter((size) => quantities[product.idStock][size] > 0)
        .map((size) => ({
          size,
          quantity: quantities[product.idStock][size],
        })),
      color: product.color,
      idStock: product.idStock,
      stockId: product.product.stockId
    }));
    const jsonData = {
      orderId: saleData._id,
      products,
    };
    try {
      await dispatch(sales.reserveStock({ jsonData }));
    } finally {
      setDialogData({ open: false, productId: null });
      setQuantities({});
    }
  };

  const calculateReservationsForAllProducts = () => {
    const productReservationsMap = {};
    reservationsData.forEach((reservation) => {
      reservation.products.forEach((product) => {
        if (!productReservationsMap[product.idStock]) {
          productReservationsMap[product.idStock] = {};
        }
        product.sizes.forEach((size) => {
          if (!productReservationsMap[product.idStock][size.size]) {
            productReservationsMap[product.idStock][size.size] = 0;
          }
          productReservationsMap[product.idStock][size.size] += size.quantity;
        });
      });
    });
    setReservedProducts(productReservationsMap);
  };

  useEffect(() => {
    if (saleData) calculateReservationsForAllProducts();
    if (stockData) calculateStockAvailable();
  }, [saleData, stockData]);

  return (
    <Box component="form" onSubmit={preSubmit}>
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
                <Typography variant="overline">Reservar</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {saleData?.products?.map((p) => (
              <React.Fragment key={p._id}>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="subtitle2">{`${p.product.stockId} ${p.color}`}</Typography>
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
                      <Typography variant="subtitle2">{`${item.quantity - (reservedProducts[p.idStock]?.[item.size] ?? 0)}`}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">
                        {productsStock[p.idStock]?.[item.size] ?? 0}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton onClick={() => decrementQuantity(p.idStock, item.size)}>
                        <Remove />
                      </IconButton>
                      <TextField
                        value={quantities[p.idStock]?.[item.size] ?? 0}
                        onChange={(e) => handleQuantityChange(
                          p.idStock,
                          item.size,
                          Math.min(
                            parseInt(e.target.value, 10),
                            item.quantity - (reservedProducts[p.idStock]?.[item.size] ?? 0),
                            productsStock[p.idStock]?.[item.size] ?? 0
                          )
                        )}
                        variant="outlined"
                        size="small"
                        style={{ width: '60px' }}
                      />
                      <IconButton onClick={() => incrementQuantity(
                        p.idStock,
                        item.size,
                        item.quantity - (reservedProducts[p.idStock]?.[item.size] ?? 0)
                      )}>
                        <Add />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box mt={2}>
        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={
            Object.values(quantities)
              .every((product) => Object.values(product).every((quantity) => quantity === 0))
          }
          color="primary">
          Reservar stock
        </Button>
      </Box>
      <CustomDialog
        isOpen={dialogData.open}
        title="Confirmar reserva de stock"
        text="¿Desea asignar el stock disponible al producto seleccionado?"
        onCancel={() => handleCancel()}
        onAccept={() => handleAccept()}
      />
    </Box>
  );
};

export default OrderProductsTab;
