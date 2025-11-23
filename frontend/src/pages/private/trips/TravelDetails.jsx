import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Divider,
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
import { PlayArrowRounded, DoneAllRounded, RocketLaunchRounded, AssignmentTurnedInRounded, Inventory2Rounded } from '@mui/icons-material';
import travelsRequest from '@/request/travelsRequest';
import stockRequest from '@/request/stockRequest';
import formatDate from '@/utils/formatDate';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import AssignOrdersModal from './components/AssignOrdersModal';
import ExtraStockModal from './components/ExtraStockModal';
import StopDeliveriesModal from './components/StopDeliveriesModal';

const sumBultos = (items = []) =>
  items.reduce(
    (acc, it) =>
      acc +
      (it.sizes || []).reduce((s, sz) => s + Number(sz.quantity || 0), 0),
    0
  );

const TravelDetails = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [dialog, setDialog] = useState({ open: false, title: '', onAccept: null });
  const [stockMap, setStockMap] = useState({});
  const [deliveriesOpen, setDeliveriesOpen] = useState(false);
  const [currentStop, setCurrentStop] = useState(null);
  const capacityUsedPct = useMemo(() => {
    if (!travel) return 0;
    const total = sumBultos(travel?.items || []) + sumBultos(travel?.extraStockItems || []);
    const cap = Number(travel.capacityBultos || 0) || 0;
    return cap > 0 ? Math.min(100, Math.round((total * 100) / cap)) : 0;
  }, [travel]);

  const load = async () => {
    const { result } = await travelsRequest.getDetails(id);
    setTravel(result);
    // fetch stock availability for all idStock involved
    try {
      const ids = Array.from(
        new Set([
          ...((result?.items || []).map((it) => it.idStock)),
          ...((result?.extraStockItems || []).map((it) => it.idStock)),
        ])
      ).filter((v) => v !== undefined && v !== null);
      if (ids.length > 0) {
        const res = await stockRequest.getStockProducts({ entity: '/stock', ids });
        setStockMap(res?.result || {});
      } else {
        setStockMap({});
      }
    } catch (_) {
      setStockMap({});
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const confirm = (title, onAccept) => setDialog({ open: true, title, onAccept });
  const closeDialog = () => setDialog({ open: false, title: '', onAccept: null });

  const handleStart = async () => {
    await travelsRequest.startTravel(id);
    await load();
  };
  const handleComplete = async () => {
    await travelsRequest.completeTravel(id);
    await load();
  };

  // Group items by sales order for display and unassign selection
  const groupedByOrder = useMemo(() => {
    const map = {};
    (travel?.items || []).forEach((it) => {
      const key = String(it.salesOrder?._id || it.salesOrder);
      if (!key) return;
      if (!map[key]) {
        map[key] = { order: it.salesOrder, code: it.salesOrder?.salesOrderCode, items: [] };
      }
      map[key]?.items?.push(it);
    });
    return map;
  }, [travel]);

  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedExtraIdStocks, setSelectedExtraIdStocks] = useState({});

  const toggleOrderSelect = (orderId) =>
    setSelectedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  const toggleExtraSelect = (idStock) =>
    setSelectedExtraIdStocks((prev) => ({ ...prev, [idStock]: !prev[idStock] }));

  const removeSelectedOrders = async () => {
    const orderIds = Object.keys(selectedOrders).filter((k) => selectedOrders[k]);
    if (orderIds.length === 0) return;
    await travelsRequest.unassignOrders(id, orderIds);
    await load();
    setSelectedOrders({});
  };

  const removeSelectedExtra = async () => {
    const idStocks = Object.keys(selectedExtraIdStocks)
      .filter((k) => selectedExtraIdStocks[k])
      .map((k) => Number(k));
    if (idStocks.length === 0) return;
    await travelsRequest.removeExtraStock(id, idStocks);
    await load();
    setSelectedExtraIdStocks({});
  };

  if (!travel) return null;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <Typography variant="h5">Viaje</Typography>

      <Paper variant="outlined">
        <Box display="flex" gap={3} p={2} flexWrap="wrap">
          <Chip label={`Estado: ${travel.status}`} color="primary" />
          <Chip label={`Inicio: ${formatDate(travel.startDate)}`} />
          <Chip label={`Fin: ${formatDate(travel.endDate)}`} />
          <Chip label={`Vehículo: ${travel.vehicle?.plate || ''}`} />
          <Chip label={`Conductor: ${travel.driverName || ''}`} />
          <Chip label={`Capacidad: ${travel.capacityBultos || 0} bultos`} />
          <Chip label={`Uso de capacidad: ${capacityUsedPct}%`} />
        </Box>
      </Paper>

      <Box display="flex" gap={2} flexWrap="wrap">
        {travel.status === 'PLANNED' || travel.status === 'RESERVED' && (
          <Button
            variant="outlined"
            startIcon={<AssignmentTurnedInRounded />}
            onClick={() => setAssignOpen(true)}
          >
            Asignar pedidos
          </Button>
        )}
        {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && (
          <Button
            variant="outlined"
            startIcon={<Inventory2Rounded />}
            onClick={() => setExtraOpen(true)}
          >
            Cargar stock adicional
          </Button>
        )}
        {travel.status === 'RESERVED' && (
          <Button
            variant="contained"
            startIcon={<PlayArrowRounded />}
            onClick={() => confirm('Iniciar viaje', handleStart)}
          >
            Comenzar viaje
          </Button>
        )}
        {travel.status === 'IN_TRANSIT' && (
          <Button
            variant="contained"
            color="success"
            startIcon={<DoneAllRounded />}
            onClick={() => confirm('Finalizar viaje', handleComplete)}
          >
            Finalizar viaje
          </Button>
        )}
      </Box>

      <Divider />

      <Typography variant="h6">Paradas</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Llegada</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(travel.stops || []).map((stop, idx) => (
              <TableRow key={stop._id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{stop.name}</TableCell>
                <TableCell>{stop.customer?.name || '-'}</TableCell>
                <TableCell>{stop.arrivedAt ? formatDate(stop.arrivedAt) : '-'}</TableCell>
                <TableCell align="right">
                  {travel.status === 'IN_TRANSIT' && !stop.arrivedAt && (
                    <IconButton
                      color="primary"
                      onClick={async () => {
                        await travelsRequest.arriveStop(id, stop._id);
                        await load();
                      }}
                    >
                      <RocketLaunchRounded />
                    </IconButton>
                  )}
                  {travel.status === 'IN_TRANSIT' && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCurrentStop(stop);
                        setDeliveriesOpen(true);
                      }}
                    >
                      Entregar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">Items</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Pedido</TableCell>
              <TableCell>Producto</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Talles</TableCell>
              <TableCell>Stock disp.</TableCell>
              {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && <TableCell align="right">Seleccionar</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(travel?.items || []).map((it) => (
              <TableRow key={it._id}>
                <TableCell>{it.salesOrder?.salesOrderCode}</TableCell>
                <TableCell>{it.product?.name || it.idStock}</TableCell>
                <TableCell>{it.color}</TableCell>
                <TableCell>
                  {(it.sizes || [])
                    .map((s) => `${s.size}(${s.quantity}) D:${s.delivered || 0} F:${s.failed || 0}`)
                    .join(', ')}
                </TableCell>
                <TableCell>
                  {(it.sizes || [])
                    .map((s) => {
                      const row = (stockMap?.[it.idStock] || []).find((ss) => ss.number === Number(s.size));
                      const available = row ? Number(row.stock) : 0;
                      return `${s.size}(${available})`;
                    })
                    .join(', ')}
                </TableCell>
                {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && (
                  <TableCell align="right">
                    <input
                      type="checkbox"
                      checked={!!selectedOrders[String(it.salesOrder?._id || it.salesOrder)]}
                      onChange={() => toggleOrderSelect(String(it.salesOrder?._id || it.salesOrder))}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && (
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="error" onClick={removeSelectedOrders} disabled={Object.values(selectedOrders).every((v) => !v)}>
            Quitar pedidos seleccionados
          </Button>
        </Box>
      )}

      <Typography variant="h6">Stock adicional cargado</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>ID Stock</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Talles</TableCell>
              <TableCell>Stock disp.</TableCell>
              {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && <TableCell align="right">Seleccionar</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {(travel.extraStockItems || []).map((it, idx) => (
              <TableRow key={`${it.idStock}-${idx}`}>
                <TableCell>{it.product?.name || '-'}</TableCell>
                <TableCell>{it.idStock}</TableCell>
                <TableCell>{it.color}</TableCell>
                <TableCell>
                  {(it.sizes || []).map((s) => `${s.size}(${s.quantity})`).join(', ')}
                </TableCell>
                <TableCell>
                  {(it.sizes || [])
                    .map((s) => {
                      const row = (stockMap?.[it.idStock] || []).find((ss) => ss.number === Number(s.size));
                      const available = row ? Number(row.stock) : 0;
                      return `${s.size}(${available})`;
                    })
                    .join(', ')}
                </TableCell>
                {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && (
                  <TableCell align="right">
                    <input
                      type="checkbox"
                      checked={!!selectedExtraIdStocks[String(it.idStock)]}
                      onChange={() => toggleExtraSelect(String(it.idStock))}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {(travel.status === 'PLANNED' || travel.status === 'RESERVED') && (
        <Box display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="error" onClick={removeSelectedExtra} disabled={Object.values(selectedExtraIdStocks).every((v) => !v)}>
            Quitar stock adicional seleccionado
          </Button>
        </Box>
      )}

      <CustomDialog
        title={dialog.title}
        text="Esta acción no se puede deshacer, ¿Desea continuar?"
        isOpen={dialog.open}
        onAccept={async () => {
          await dialog.onAccept?.();
          setDialog({ open: false, title: '', onAccept: null });
        }}
        onCancel={closeDialog}
      />
      <AssignOrdersModal
        open={assignOpen}
        onClose={() => setAssignOpen(false)}
        travelId={id}
        onAssigned={async () => {
          await load();
          setAssignOpen(false);
        }}
        capacityBultos={Number(travel.capacityBultos || 0)}
        currentBultos={sumBultos(travel.items) + sumBultos(travel.extraStockItems)}
      />
      <ExtraStockModal
        open={extraOpen}
        onClose={() => setExtraOpen(false)}
        travelId={id}
        onAdded={async () => {
          await load();
          setExtraOpen(false);
        }}
        capacityBultos={Number(travel.capacityBultos || 0)}
        currentBultos={sumBultos(travel.items) + sumBultos(travel.extraStockItems)}
        extraItems={travel.extraStockItems || []}
      />
      {deliveriesOpen && currentStop && (
        <StopDeliveriesModal
          open={deliveriesOpen}
          onClose={() => setDeliveriesOpen(false)}
          travel={travel}
          stop={currentStop}
          onDelivered={async () => {
            await load();
            setDeliveriesOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default TravelDetails;


