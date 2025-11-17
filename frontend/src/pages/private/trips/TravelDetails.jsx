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
import formatDate from '@/utils/formatDate';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import AssignOrdersModal from './components/AssignOrdersModal';
import ExtraStockModal from './components/ExtraStockModal';

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
  const capacityUsedPct = useMemo(() => {
    if (!travel) return 0;
    const total = sumBultos(travel.items) + sumBultos(travel.extraStockItems);
    const cap = Number(travel.capacityBultos || 0) || 0;
    return cap > 0 ? Math.min(100, Math.round((total * 100) / cap)) : 0;
  }, [travel]);

  const load = async () => {
    const { result } = await travelsRequest.getDetails(id);
    setTravel(result);
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
        {travel.status === 'PLANNED' && (
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
            </TableRow>
          </TableHead>
          <TableBody>
            {(travel.items || []).map((it) => (
              <TableRow key={it._id}>
                <TableCell>{it.salesOrder?.salesOrderCode}</TableCell>
                <TableCell>{it.product?.name || it.idStock}</TableCell>
                <TableCell>{it.color}</TableCell>
                <TableCell>
                  {(it.sizes || [])
                    .map((s) => `${s.size}(${s.quantity}) D:${s.delivered || 0} F:${s.failed || 0}`)
                    .join(', ')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
      />
    </Box>
  );
};

export default TravelDetails;


