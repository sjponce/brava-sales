import { useEffect, useMemo } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import travelsRequest from '@/request/travelsRequest';
import stock from '@/redux/stock/actions';
import ModifiableProductTableTrips from '../../sales-orders/components/ModifiableProductTableTrips';

const ExtraStockModal = ({ open, onClose, travelId, onAdded, extraItems = [] }) => {
  const dispatch = useDispatch();
  const { control, setValue, watch, reset } = useForm();

  const totalQtyPlanned = useMemo(() => {
    const products = watch('products') || [];
    return products.reduce(
      (sum, p) => sum + (p.sizes || []).reduce((s, sz) => s + Number(sz.quantity || 0), 0),
      0
    );
  }, [watch('products')]);

  const confirm = async () => {
    const products = watch('products') || [];
    if (products?.length === 0) return;
    // map products -> items for extra stock
    const items = products.map((p) => ({
      product: p.product,
      idStock: p.idStock,
      color: p.color,
      sizes: (p.sizes || []).map((s) => ({ size: s.size, quantity: Number(s.quantity || 0) })),
    }));
    const res = await travelsRequest.addExtraStock(travelId, items);
    if (res?.success) {
      onAdded?.();
      reset({ products: [] });
    }
  };

  useEffect(() => {
    if (!open) return;
    // load stock list for product selector just like AddSalesOrderModal
    dispatch(stock.listAll({ entity: 'stock' }));
  }, [open]);

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cargar stock adicional</DialogTitle>
      <DialogContent>
        <Typography variant="overline">Seleccionar productos y talles</Typography>
        <Box mt={1}>
          <ModifiableProductTableTrips setValue={setValue} watch={watch} control={control} />
        </Box>
        <Box display="flex" gap={2} mt={2} alignItems="center">
          <Typography variant="body2">Total bultos a cargar: {totalQtyPlanned}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={confirm} disabled={(watch('products') || []).length === 0}>
          Confirmar
        </Button>
      </DialogActions>
      {Array.isArray(extraItems) && extraItems.length > 0 && (
        <Box px={3} pb={3}>
          <Typography variant="overline">Stock adicional cargado</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell>ID Stock</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Talles</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {extraItems.map((it, idx) => (
                  <TableRow key={`${it.idStock}-${idx}`}>
                    <TableCell>{it.product?.name || '-'}</TableCell>
                    <TableCell>{it.idStock}</TableCell>
                    <TableCell>{it.color}</TableCell>
                    <TableCell>
                      {(it.sizes || []).map((s) => `${s.size}(${s.quantity})`).join(', ')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}
    </Dialog>
  );
};

export default ExtraStockModal;
