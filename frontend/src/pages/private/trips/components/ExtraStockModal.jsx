import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import { Add, Delete } from '@mui/icons-material';
import stockRequest from '@/request/stockRequest';
import travelsRequest from '@/request/travelsRequest';

const ExtraStockModal = ({ open, onClose, travelId, onAdded, capacityBultos, currentBultos }) => {
  const [idStockInput, setIdStockInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [sizesAvailable, setSizesAvailable] = useState([]);
  const [sizesQty, setSizesQty] = useState({});
  const [items, setItems] = useState([]);
  const [stockProducts, setStockProducts] = useState([]);
  // const [stockLoading, setStockLoading] = useState(false);
  const [stockFilter, setStockFilter] = useState('');

  const totalQtyPlanned = useMemo(
    () => items.reduce(
      (sum, it) => sum + (it.sizes || []).reduce((s, sz) => s + Number(sz.quantity || 0), 0),
      0
    ),
    [items]
  );
  const willExceedCapacity = currentBultos + totalQtyPlanned > capacityBultos;

  const fetchSizes = async () => {
    const id = Number(idStockInput);
    if (!id) return;
    const res = await stockRequest.getStockProducts({ entity: '/stock', ids: [id] });
    const data = res?.result?.[id] || [];
    setSizesAvailable(data);
    setSizesQty({});
  };

  const addItem = () => {
    const idStock = Number(idStockInput);
    if (!idStock) return;
    const sizes = Object.entries(sizesQty)
      // eslint-disable-next-line no-unused-vars
      .filter(([_, q]) => Number(q) > 0)
      .map(([size, quantity]) => ({ size, quantity: Number(quantity) }));
    if (sizes.length === 0) return;
    setItems((prev) => [
      ...prev,
      { idStock, color: colorInput || '', sizes },
    ]);
    setIdStockInput('');
    setColorInput('');
    setSizesAvailable([]);
    setSizesQty({});
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const confirm = async () => {
    if (items.length === 0 || willExceedCapacity) return;
    const res = await travelsRequest.addExtraStock(travelId, items);
    if (res?.success) {
      setItems([]);
      onAdded?.();
    }
  };

  useEffect(() => {
    if (!open) {
      setItems([]);
      setSizesAvailable([]);
      setSizesQty({});
      setIdStockInput('');
      setColorInput('');
    }
  }, [open]);

  useEffect(() => {
    const loadStock = async () => {
      if (!open) return;
      try {
        // setStockLoading(true);
        const res = await stockRequest.listAll({ entity: '/stock' });
        setStockProducts(res?.result || []);
      } catch (_) {
        setStockProducts([]);
      } finally {
        // setStockLoading(false);
      }
    };
    loadStock();
  }, [open]);

  const filteredStock = useMemo(() => {
    if (!stockFilter) return stockProducts;
    const q = stockFilter.toLowerCase();
    return (stockProducts || []).filter((p) => {
      const name = (p?.name || '').toLowerCase();
      const stockId = String(p?.stockId || '');
      const colors = (p?.variations || []).map((v) => v.color?.toLowerCase() || '');
      return name.includes(q) || stockId.includes(q) || colors.some((c) => c.includes(q));
    });
  }, [stockProducts, stockFilter]);

  return (
    <Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
      <DialogTitle>Cargar stock adicional</DialogTitle>
      <DialogContent>
        <Box display="flex" gap={2} alignItems="center" mb={2} flexWrap="wrap">
          <TextField
            label="ID Stock"
            value={idStockInput}
            onChange={(e) => setIdStockInput(e.target.value)}
            size="small"
          />
          <TextField
            label="Color"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            size="small"
          />
          <Button variant="outlined" onClick={fetchSizes} startIcon={<Add />}>
            Buscar talles
          </Button>
        </Box>

        <Box mb={2}>
          <Typography variant="overline">Buscar en stock disponible</Typography>
          <Box display="flex" gap={2} alignItems="center" mb={1}>
            <TextField
              placeholder="Filtrar por nombre, color o ID Stock"
              size="small"
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              fullWidth
            />
          </Box>
          <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 240 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID Stock</TableCell>
                  <TableCell>Producto</TableCell>
                  <TableCell>Variaciones</TableCell>
                  <TableCell align="right">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(filteredStock || []).map((p) => (
                  <TableRow key={p._id || p.stockId}>
                    <TableCell>{p.stockId}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      {(p.variations || [])
                        .map((v) => `${v.color}: ${v.stock}`)
                        .join(' | ')}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        onClick={() => {
                          setIdStockInput(String(p.stockId || ''));
                          setColorInput('');
                          setSizesAvailable([]);
                          setSizesQty({});
                          // fetch sizes for quick view
                          setTimeout(fetchSizes, 0);
                        }}
                      >
                        Seleccionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {sizesAvailable.length > 0 && (
          <>
            <Typography variant="overline">Disponibilidad</Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Talle</TableCell>
                    <TableCell>Disponible</TableCell>
                    <TableCell>Cargar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sizesAvailable.map((s) => (
                    <TableRow key={s.number}>
                      <TableCell>{s.number}</TableCell>
                      <TableCell>{s.stock}</TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          size="small"
                          inputProps={{ min: 0, max: s.stock }}
                          value={sizesQty[s.number] ?? ''}
                          onChange={(e) => setSizesQty(
                            (prev) => ({ ...prev, [s.number]: e.target.value })
                          )}
                          sx={{ width: 100 }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button variant="contained" onClick={addItem}>
              Agregar a la carga
            </Button>
          </>
        )}

        <Box mt={3}>
          <Typography variant="overline">Carga preparada</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID Stock</TableCell>
                  <TableCell>Color</TableCell>
                  <TableCell>Talles</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((it, idx) => (
                  <TableRow key={`${it.idStock}-${idx}`}>
                    <TableCell>{it.idStock}</TableCell>
                    <TableCell>{it.color}</TableCell>
                    <TableCell>
                      {(it.sizes || []).map((s) => `${s.size}(${s.quantity})`).join(', ')}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => removeItem(idx)} color="error" size="small">
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" gap={2} mt={2} alignItems="center">
            <Typography variant="body2">Total bultos a cargar: {totalQtyPlanned}</Typography>
            {willExceedCapacity && (
              <Typography variant="body2" color="error">
                Excede capacidad ({currentBultos + totalQtyPlanned}/{capacityBultos})
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={confirm} disabled={items.length === 0 || willExceedCapacity}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExtraStockModal;
