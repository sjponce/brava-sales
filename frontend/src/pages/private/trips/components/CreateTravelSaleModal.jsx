import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stepper,
  Step,
  StepLabel,
  Autocomplete,
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
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import salesRequest from '@/request/salesRequest';
import stockRequest from '@/request/stockRequest';
import crud from '@/redux/crud/actions';
import request from '@/request/request';
import travelsRequest from '@/request/travelsRequest';

const sumBultos = (items) => {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const sizes = Array.isArray(item.sizes) ? item.sizes : [];
    const qty = sizes.reduce((s, sz) => s + (Number(sz.quantity) || 0), 0);
    return sum + qty;
  }, 0);
};

const CreateTravelSaleModal = ({ open, onClose, travel, stop, onCreated }) => {
  const dispatch = useDispatch();
  const admin = useSelector(selectCurrentAdmin);
  const [selection, setSelection] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const customers = useSelector((store) => store.crud?.listAll?.result?.items?.result) || [];
  const [customerAddress, setCustomerAddress] = useState(null);

  const extraItems = useMemo(
    () => (Array.isArray(travel?.extraStockItems) ? travel.extraStockItems : []),
    [travel]
  );
  const canSell = Boolean(selectedCustomer?._id || selectedCustomer);

  useEffect(() => {
    if (!open) return;
    dispatch(crud.listAll({ entity: 'customer' }));
    setSelectedCustomer(stop?.customer || null);
  }, [open]);

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const id = selectedCustomer?._id || selectedCustomer;
        if (!id) {
          setCustomerAddress(null);
          return;
        }
        const res = await request.read({ entity: 'customer', id });
        const addr = res?.result?.address || null;
        setCustomerAddress(addr);
      } catch (_) {
        setCustomerAddress(null);
      }
    };
    loadCustomer();
  }, [selectedCustomer]);
  const handleQtyChange = (idStock, size, max, value) => {
    const num = Math.max(0, Math.min(max, Number(value || 0)));
    setSelection((prev) => {
      const next = { ...prev };
      if (!next[idStock]) next[idStock] = {};
      next[idStock][size] = num;
      return next;
    });
  };

  const [priceMap, setPriceMap] = useState({});

  useEffect(() => {
    const fetchPrices = async () => {
      if (!open) return;
      const items = Array.isArray(travel?.extraStockItems) ? travel.extraStockItems : [];
      const ids = Array.from(
        new Set(
          items.map((it) => (it.product?._id || it.product)).filter(Boolean)
        )
      );
      if (ids.length === 0) return;
      const next = {};
      // primero utilizar precios ya poblados
      items.forEach((it) => {
        const pid = String(it.product?._id || it.product || '');
        if (!pid) return;
        if (typeof next[pid] === 'number') return;
        if (it.product && typeof it.product.price === 'number' && it.product.price > 0) {
          next[pid] = Number(it.product.price);
        }
      });
      // luego pedir faltantes en paralelo
      const missing = ids.filter((pid) => next[String(pid)] === undefined);
      if (missing.length > 0) {
        const responses = await Promise.all(
          missing.map((pid) => stockRequest.read({ entity: 'stock', id: pid }).catch(() => null))
        );
        responses.forEach((res, idx) => {
          const pid = String(missing[idx]);
          const price = typeof res?.result?.price === 'number' ? Number(res.result.price) : 0;
          if (price > 0) next[pid] = price;
        });
      }
      if (Object.keys(next).length > 0) setPriceMap((prev) => ({ ...prev, ...next }));
    };
    fetchPrices();
  }, [open, travel]);

  const getUnitPrice = (productId, fallback) => {
    const key = String(productId || '');
    if (priceMap[key] !== undefined) return Number(priceMap[key] || 0);
    if (typeof fallback === 'number') return Number(fallback || 0);
    return 0;
  };

  const selectedItems = useMemo(() => {
    const result = [];
    extraItems.forEach((it) => {
      const sizeMap = selection[it.idStock] || {};
      const sizes = (it.sizes || [])
        .map((s) => ({ size: s.size, quantity: Number(sizeMap[s.size] || 0) }))
        .filter((s) => s.quantity > 0);
      if (sizes.length > 0) {
        const pid = it.product?._id || it.product;
        result.push({
          product: pid,
          idStock: it.idStock,
          color: it.color,
          price: getUnitPrice(pid, it.product?.price),
          sizes,
        });
      }
    });
    return result;
  }, [extraItems, selection, priceMap]);

  const totalBultos = useMemo(() => sumBultos(selectedItems), [selectedItems]);
  const subtotal = useMemo(() => selectedItems.reduce((sum, p) => {
    const qty = p.sizes.reduce((s, sz) => s + Number(sz.quantity || 0), 0);
    return sum + Number(p.price || 0) * qty;
  }, 0), [selectedItems]);
  const discountFromPercent = useMemo(() => {
    const pct = Math.max(0, Math.min(100, Number(discountPercent || 0)));
    return Math.round((subtotal * pct) / 100);
  }, [subtotal, discountPercent]);
  const discountFixed = Math.max(0, Number(discountAmount || 0));
  const total = Math.max(0, subtotal - discountFromPercent - discountFixed);

  const createOrder = async () => {
    if (!canSell || selectedItems.length === 0) return;
    const percent = Math.max(0, Math.min(100, Number(discountPercent || 0)));
    const payload = {
      orderDate: new Date(),
      customer: selectedCustomer?._id || selectedCustomer,
      responsible: admin?._id,
      products: selectedItems.map((p) => ({
        product: p.product,
        idStock: p.idStock,
        color: p.color,
        price: Number(p.price || 0),
        sizes: p.sizes.map((s) => ({ size: s.size, quantity: Number(s.quantity) })),
      })),
      discount: percent,
      installmentsCount: 1,
      shippingMethod: 'tripDelivery',
      shippingAddress: customerAddress || undefined,
    };
    const res = await salesRequest.create({ entity: 'sales', jsonData: payload });
    if (res?.success) {
      const createdId = res.result?.salesOrder?._id || res.result?._id;
      if (createdId) {
        try {
          // mark delivered via travel endpoint and attach to travel
          await travelsRequest.markSaleDelivered(travel?._id, createdId);
          await travelsRequest.attachTravelSale(travel?._id, createdId);
          // consume extra stock used in this sale
          const consumptions = selectedItems.map((p) => ({
            idStock: p.idStock,
            sizes: p.sizes.map((s) => ({ size: s.size, quantity: Number(s.quantity) })),
          }));
          await travelsRequest.consumeExtraStock(travel?._id, consumptions);
        } catch (_) {
          // ignore status update failure
        }
      }
      onCreated?.(res.result);
      onClose?.();
      setSelection({});
      setCurrentStep(0);
      setDiscountPercent(0);
      setDiscountAmount(0);
    }
  };

  const steps = [
    { label: 'Stock y cliente' },
    { label: 'Descuentos' },
    { label: 'Resumen' },
  ];

  const canNextFromStep1 = canSell && selectedItems.length > 0;

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Crear venta desde stock del viaje</DialogTitle>
      <DialogContent>
        <Stepper activeStep={currentStep} sx={{ mb: 2 }}>
          {steps.map((s) => (
            <Step key={s.label}>
              <StepLabel>
                <Typography sx={{ display: { xs: 'none', sm: 'flex' } }}>{s.label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {currentStep === 0 && (
          <Box>
            <Typography variant="overline">Cliente</Typography>
            <Box mb={2} mt={0.5}>
              <Autocomplete
                size="small"
                value={selectedCustomer}
                onChange={(_, value) => setSelectedCustomer(value)}
                options={customers}
                getOptionLabel={(option) => {
                  if (!option) return '';
                  return option.name || option.businessName || option?.user?.email || '';
                }}
                isOptionEqualToValue={(option, value) => String(option?._id) === String(value?._id)}
                renderInput={(params) => <TextField {...params} label="Seleccionar cliente" />}
              />
            </Box>
            <Typography variant="overline">Stock disponible en el viaje (extra)</Typography>
            <TableContainer component={Paper} sx={{ mt: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>ID Stock</TableCell>
                    <TableCell>Color</TableCell>
                    <TableCell>Talles (Disponible → Vender)</TableCell>
                    <TableCell align="right">Unitario</TableCell>
                    <TableCell align="right">Acumulado</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {extraItems.map((it) => {
                    const pid = it.product?._id || it.product;
                    const unit = getUnitPrice(pid, it.product?.price);
                    const selectedQty = Object.values(selection[it.idStock] || {}).reduce(
                      (sum, qty) => sum + Number(qty || 0),
                      0
                    );
                    const accumulated = unit * selectedQty;
                    return (
                      <TableRow key={`${it.idStock}`}>
                        <TableCell>{it.product?.name || it.product?.stockId || '-'}</TableCell>
                        <TableCell>{it.idStock}</TableCell>
                        <TableCell>{it.color}</TableCell>
                        <TableCell>
                          <Box display="flex" gap={1} flexWrap="wrap">
                            {(it.sizes || []).map((s) => {
                              const max = Number(s.quantity || 0);
                              const current = Number(selection[it.idStock]?.[s.size]);
                              return (
                                <Box
                                  key={`${it.idStock}-${s.size}`}
                                  display="flex"
                                  alignItems="center"
                                  gap={1}
                                >
                                  <Typography variant="caption">
                                    {s.size}({max}) →
                                  </Typography>
                                  <TextField
                                    size="small"
                                    type="number"
                                    value={current}
                                    onChange={(e) => handleQtyChange(
                                      it.idStock,
                                      s.size,
                                      max,
                                      e.target.value
                                    )}
                                    inputProps={{ min: 0, max }}
                                    sx={{ width: 80 }}
                                  />
                                </Box>
                              );
                            })}
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          ${unit.toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          ${accumulated.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {extraItems.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        No hay stock adicional cargado en el viaje.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {currentStep === 1 && (
          <Box
            id="step-2"
            height="99%"
            gap={2}
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
          >
            <Box width="100%">
              <Typography variant="overline">Descuentos</Typography>
              <Box display="flex" gap={2} mt={1} alignItems="center" flexWrap="wrap">
                <TextField
                  label="Descuento %"
                  size="small"
                  type="number"
                  sx={{ width: 180 }}
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(e.target.value)}
                  inputProps={{ min: 0, max: 100 }}
                />
                <TextField
                  label="Descuento fijo ($)"
                  size="small"
                  type="number"
                  sx={{ width: 180 }}
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  inputProps={{ min: 0 }}
                />
              </Box>
              <Box mt={2}>
                <Typography variant="body2">Método de envío: En viaje (entrega finalizada)</Typography>
              </Box>
            </Box>
            <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'visible' }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Monto base</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" variant="h6">
                        ${subtotal?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Cantidad total</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" variant="h6">
                        {totalBultos} [u]
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Desc. %</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" variant="h6">
                        ${discountFromPercent?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Desc. fijo</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" variant="h6">
                        ${discountFixed?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Monto final</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography color="primary" variant="h6">
                        ${total?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {currentStep === 2 && (
          <Box
            id="step-3"
            display="flex"
            height="99%"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={2}
          >
            <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: { xs: 'visible', md: 'auto' } }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={5} align="center">
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
                    <TableCell align="right">
                      <Typography variant="overline">Unitario</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="overline">Subtotal</Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems.map((p) => {
                    const unit = Number(p.price || 0);
                    return (
                      <React.Fragment key={`${p.idStock} ${p.color}`}>
                        <TableRow>
                          <TableCell colSpan={5}>
                            <Typography variant="subtitle2">{`${p.idStock} ${p.color}`}</Typography>
                          </TableCell>
                        </TableRow>
                        {p.sizes.map((item) => {
                          const sub = unit * Number(item.quantity || 0);
                          return (
                            <TableRow key={item.size}>
                              <TableCell />
                              <TableCell align="center">
                                <Typography variant="subtitle2">{`${item.size}`}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Typography variant="subtitle2">{`${item.quantity}`}</Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="subtitle2">
                                  ${unit?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Typography variant="subtitle2">
                                  ${sub?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
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
                        ${subtotal?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Desc. %</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        ${discountFromPercent.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Desc. fijo</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        ${discountFixed?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Monto final</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        ${total?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Envío</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        En viaje (entrega finalizada)
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        {currentStep > 0 && (
          <Button variant="text" onClick={() => setCurrentStep(currentStep - 1)}>
            Atrás
          </Button>
        )}
        {currentStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={(currentStep === 0 && !canNextFromStep1)}
          >
            Siguiente
          </Button>
        ) : (
          <Button variant="contained" onClick={createOrder} disabled={!canSell || selectedItems.length === 0}>
            Confirmar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CreateTravelSaleModal;
