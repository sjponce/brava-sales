import { useEffect, useState, useMemo } from 'react';
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
import { PlayArrowRounded, DoneAllRounded, RocketLaunchRounded, Inventory2Rounded } from '@mui/icons-material';
import travelsRequest from '@/request/travelsRequest';
import stockRequest from '@/request/stockRequest';
import formatDate from '@/utils/formatDate';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import AssignOrdersModal from './components/AssignOrdersModal';
import ExtraStockModal from './components/ExtraStockModal';
// import StopDeliveriesModal from './components/StopDeliveriesModal';
import CreateTravelSaleModal from './components/CreateTravelSaleModal';
import translateStatus from '@/utils/translateSalesStatus';

const TravelDetails = () => {
  const { id } = useParams();
  const [travel, setTravel] = useState(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [dialog, setDialog] = useState({ open: false, title: '', onAccept: null });
  // const [deliveriesOpen, setDeliveriesOpen] = useState(false);
  const [currentStop, setCurrentStop] = useState(null);
  const [saleOpen, setSaleOpen] = useState(false);
  const currentStopIndex = useMemo(() => {
    if (!travel || !Array.isArray(travel.stops)) return -1;
    const nextIdx = travel.stops.findIndex((s) => !s?.arrivedAt);
    return nextIdx === -1 ? travel.stops.length - 1 : nextIdx - 1;
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
        return res?.result || {};
      }
      return {};
    } catch (_) {
      return {};
    }
  };

  useEffect(() => {
    load();
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

  const [selectedExtraIdStocks, setSelectedExtraIdStocks] = useState({});

  const toggleExtraSelect = (idStock) => setSelectedExtraIdStocks((prev) => ({
    ...prev,
    [idStock]: !prev[idStock],
  }));

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
          <Chip label={`Estado: ${translateStatus(travel.status) || ''}`} color="primary" />
          <Chip label={`Inicio: ${formatDate(travel.startDate)}`} />
          <Chip label={`Fin: ${formatDate(travel.endDate)}`} />
          <Chip label={`Vehículo: ${travel.vehicle?.plate || ''}`} />
          <Chip label={`Conductor: ${travel.driverName || ''}`} />
        </Box>
      </Paper>

      <Box display="flex" gap={2} flexWrap="wrap">
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
              <TableCell>Llegada planeada</TableCell>
              <TableCell>Llegada</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(travel.stops || []).map((stop, idx) => (
              <TableRow key={stop._id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{stop.name}</TableCell>
                <TableCell>{stop.plannedStart ? formatDate(stop.plannedStart) : '-'}</TableCell>
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
                  {travel.status === 'IN_TRANSIT' && idx === currentStopIndex && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setCurrentStop(stop);
                        setSaleOpen(true);
                      }}
                    >
                      Crear venta
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">Ventas realizadas en viaje</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>OV</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(travel.travelSalesOrders || []).map((so) => (
              <TableRow key={so._id || String(so)}>
                <TableCell>{so.salesOrderCode || '-'}</TableCell>
                <TableCell>{so.customer?.name || so.customer?.businessName || '-'}</TableCell>
                <TableCell align="right">${Number(so.finalAmount || 0).toFixed(2)}</TableCell>
                <TableCell>{so.status || '-'}</TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => window.location.assign(`/sales-orders?orderId=${so._id || so}`)}>
                    Ver pedidos
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!travel.travelSalesOrders || travel.travelSalesOrders.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} align="center">Sin ventas registradas en este viaje.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6">Stock cargado</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>ID Stock</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Talles</TableCell>
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
      {saleOpen && currentStop && (
        <CreateTravelSaleModal
          open={saleOpen}
          onClose={() => setSaleOpen(false)}
          travel={travel}
          stop={currentStop}
          onCreated={async () => {
            await load();
            setSaleOpen(false);
          }}
        />
      )}
    </Box>
  );
};

export default TravelDetails;
