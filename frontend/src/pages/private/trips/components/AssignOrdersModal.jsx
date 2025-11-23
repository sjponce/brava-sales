import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
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
import crud from '@/redux/crud/actions';
import travelsRequest from '@/request/travelsRequest';
import stockRequest from '@/request/stockRequest';

const bultosFromOrder = (order) => {
  if (!order?.products) return 0;
  return order.products.reduce(
    (sum, p) => sum + (p.sizes || []).reduce((s, sz) => s + Number(sz.quantity || 0), 0),
    0
  );
};

const AssignOrdersModal = ({ open, onClose, travelId, onAssigned, capacityBultos, currentBultos }) => {
  const dispatch = useDispatch();
  const listState = useSelector((store) => store.crud.listAll);
  const [selected, setSelected] = useState({});
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingStock, setLoadingStock] = useState(false);
  const [stockMap, setStockMap] = useState({});
  const [expanded, setExpanded] = useState({});
  const [reservedOrderIds, setReservedOrderIds] = useState(new Set());

  useEffect(() => {
    if (open) {
      dispatch(crud.listAll({ entity: 'salesorder' }));
      setSelected({});
    }
  }, [open]);

  const orders = useMemo(() => {
    const all = listState?.result?.items?.result || [];
    return all.filter((o) => o.status === 'Pending');
  }, [listState]);

  useEffect(() => {
    const computeAvailability = async () => {
      if (!open) return;
      const pending = orders;
      if (!pending || pending.length === 0) {
        setFilteredOrders([]);
        setStockMap({});
        return;
      }
      try {
        setLoadingStock(true);
        // fetch travels in RESERVED/IN_TRANSIT to exclude already assigned orders
        try {
          const travelsResp = await travelsRequest.listTravels();
          const travelList = travelsResp?.result || [];
          const reservedIds = new Set();
          (travelList || [])
            .filter((t) => t.status === 'RESERVED' || t.status === 'IN_TRANSIT')
            .forEach((t) => {
              (t.assignedOrders || []).forEach((oid) => {
                const idStr = String(oid?._id || oid);
                if (idStr) reservedIds.add(idStr);
              });
            });
          setReservedOrderIds(reservedIds);
        } catch (e) {
          setReservedOrderIds(new Set());
        }
        // collect unique idStock
        const idSet = new Set();
        pending.forEach((o) => {
          (o.products || []).forEach((p) => idSet.add(p.idStock));
        });
        const ids = Array.from(idSet);
        const stockRes = await stockRequest.getStockProducts({ entity: '/stock', ids });
        const stockDataMap = stockRes?.result || {};

        const hasSufficientStock = (order) => {
          for (const prod of order.products || []) {
            const sizes = prod.sizes || [];
            const stockSizes = stockDataMap[prod.idStock] || [];
            for (const sz of sizes) {
              const availableRow = stockSizes.find((s) => s.number === Number(sz.size));
              const availableQty = availableRow ? Number(availableRow.stock) : 0;
              if (availableQty < Number(sz.quantity)) {
                return false;
              }
            }
          }
          return true;
        };

        // filter out orders already assigned to a RESERVED / IN_TRANSIT travel
        const next = pending
          .filter((o) => !reservedOrderIds.has(String(o._id)))
          .filter(hasSufficientStock);
        setFilteredOrders(next);
        setStockMap(stockDataMap);
      } catch (_) {
        // fallback: if stock fails, show none to avoid overpromising
        setFilteredOrders([]);
        setStockMap({});
      } finally {
        setLoadingStock(false);
      }
    };
    computeAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, open]);

  const totalSelectedBultos = useMemo(
    () =>
      filteredOrders
        .filter((o) => selected[o._id])
        .reduce((sum, o) => sum + bultosFromOrder(o), 0),
    [filteredOrders, selected]
  );

  const overCapacity = currentBultos + totalSelectedBultos > capacityBultos;

  const toggle = (id) => setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleAssign = async () => {
    const orderIds = Object.keys(selected).filter((k) => selected[k]);
    if (orderIds.length === 0) return;
    try {
      await travelsRequest.assignOrders(travelId, orderIds);
      await onAssigned?.();
    } catch (e) {
      // handled globally
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Asignar pedidos</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} mb={2} flexWrap="wrap">
          <Typography variant="body2">Capacidad vehículo: {capacityBultos}</Typography>
          <Typography variant="body2">Bultos actuales: {currentBultos}</Typography>
          <Typography variant="body2">Seleccionados: {totalSelectedBultos}</Typography>
          {overCapacity && (
            <Typography variant="body2" color="error">
              Excede capacidad
            </Typography>
          )}
        </Box>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Pedido</TableCell>
                <TableCell>Cliente</TableCell>
                <TableCell>Bultos</TableCell>
                <TableCell>Importe</TableCell>
                <TableCell align="right">Detalles</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((o) => (
                <>
                  <TableRow key={o._id}>
                    <TableCell>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!selected[o._id]}
                            onChange={() => toggle(o._id)}
                          />
                        }
                      />
                    </TableCell>
                    <TableCell>{o.salesOrderCode}</TableCell>
                    <TableCell>{o.customer?.name}</TableCell>
                    <TableCell>{bultosFromOrder(o)}</TableCell>
                    <TableCell>{o.finalAmount?.toLocaleString()}</TableCell>
                    <TableCell align="right">
                      <Button size="small" onClick={() => toggleExpand(o._id)}>
                        {expanded[o._id] ? 'Ocultar' : 'Ver'}
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expanded[o._id] && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Producto</TableCell>
                              <TableCell>Color</TableCell>
                              <TableCell>Talles requeridos</TableCell>
                              <TableCell>Disponible</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {(o.products || []).map((p, idx) => {
                              const stockSizes = stockMap[p.idStock] || [];
                              const requiredStr = (p.sizes || [])
                                .map((s) => `${s.size}(${s.quantity})`)
                                .join(', ');
                              const availableStr = (p.sizes || [])
                                .map((s) => {
                                  const row = stockSizes.find((ss) => ss.number === Number(s.size));
                                  const available = row ? Number(row.stock) : 0;
                                  return `${s.size}(${available})`;
                                })
                                .join(', ');
                              return (
                                <TableRow key={`${p.idStock}-${idx}`}>
                                  <TableCell>{p.product?.name || p.idStock}</TableCell>
                                  <TableCell>{p.color}</TableCell>
                                  <TableCell>{requiredStr}</TableCell>
                                  <TableCell>{availableStr}</TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleAssign} disabled={overCapacity}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignOrdersModal;


