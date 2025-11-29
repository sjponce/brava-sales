import { useMemo, useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import travelsRequest from '@/request/travelsRequest';

const StopDeliveriesModal = ({ open, onClose, travel, stop, onDelivered }) => {
  const [quantities, setQuantities] = useState({});

  const itemsForStop = useMemo(() => {
    const customerId = String(stop?.customer?._id || '');
    return (travel?.items || []).filter((it) => String(it?.salesOrder?.customer?._id || it?.salesOrder?.customer || '') === customerId);
  }, [travel, stop]);

  const remainingByKey = useMemo(() => {
    const map = {};
    itemsForStop.forEach((it) => {
      (it.sizes || []).forEach((s) => {
        const planned = Number(s.quantity) || 0;
        const delivered = Number(s.delivered) || 0;
        const failed = Number(s.failed) || 0;
        const remaining = Math.max(planned - delivered - failed, 0);
        const key = `${it.salesOrder?._id || it.salesOrder}-${it.idStock}-${s.size}`;
        map[key] = remaining;
      });
    });
    return map;
  }, [itemsForStop]);

  const setQty = (key, val) => {
    const n = /^\d+$/.test(val) ? parseInt(val, 10) : 0;
    const max = remainingByKey[key] || 0;
    setQuantities((prev) => ({ ...prev, [key]: Math.min(n, max) }));
  };

  const totalToDeliver = useMemo(
    () => Object.values(quantities).reduce((sum, v) => sum + (Number(v) || 0), 0),
    [quantities]
  );

  const submit = async () => {
    const deliveries = [];
    Object.entries(quantities).forEach(([key, qty]) => {
      const [salesOrderId, idStock, size] = key.split('-');
      const q = Number(qty) || 0;
      if (q > 0) {
        deliveries.push({ salesOrderId, idStock: Number(idStock), size, quantity: q });
      }
    });
    if (deliveries.length === 0) return;
    await travelsRequest.recordDeliveries(travel._id, deliveries);
    await onDelivered?.();
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Entregas - {stop?.name}</DialogTitle>
      <DialogContent>
        {itemsForStop.length === 0 ? (
          <Typography variant="body2">No hay items para este cliente.</Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Pedido</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Talle</TableCell>
                  <TableCell>Restante</TableCell>
                  <TableCell>Entregar</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {itemsForStop.map((it) =>
                  (it.sizes || []).map((s) => {
                    const key = `${it.salesOrder?._id || it.salesOrder}-${it.idStock}-${s.size}`;
                    const remaining = remainingByKey[key] || 0;
                    return (
                      <TableRow key={key}>
                        <TableCell>{it.salesOrder?.salesOrderCode}</TableCell>
                        <TableCell>{it.product?.name || it.idStock}</TableCell>
                        <TableCell>{it.color}</TableCell>
                        <TableCell>{s.size}</TableCell>
                        <TableCell>{remaining}</TableCell>
                        <TableCell>
                          <TextField
                            size="small"
                            sx={{ width: 80 }}
                            value={quantities[key] ?? ''}
                            onChange={(e) => setQty(key, e.target.value)}
                            inputProps={{ min: 0 }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <Box mt={2}>
          <Typography variant="body2">Total a entregar: {totalToDeliver}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={submit} disabled={totalToDeliver === 0}>
          Registrar entregas
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StopDeliveriesModal;


