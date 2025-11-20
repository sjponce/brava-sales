import {
  Autocomplete,
  Box,
  Checkbox,
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
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';
import { vehiclesActions } from '@/redux/vehicles';
import { selectVehiclesList } from '@/redux/vehicles/selectors';

const AddTravelForm = ({ setValue, watch }) => {
  const dispatch = useDispatch();
  const [stops, setStops] = useState([]);
  const vehicles = useSelector(selectVehiclesList);
  const customers = useSelector((store) => store.crud?.search?.result?.items?.result);

  const selectedVehicle = watch('vehicle') || null;
  const driverName = watch('driverName') || '';
  const startDate = watch('startDate') || null;
  const endDate = watch('endDate') || null;
  const useExtraStock = watch('useExtraStock') || false;

  const addStop = () => {
    setStops((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        address: '',
        customer: null,
      },
    ]);
  };

  const removeStop = (id) => {
    setStops(stops?.filter((s) => s.id !== id));
  };

  const updateStop = (id, field, value) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  useEffect(() => {
    dispatch(vehiclesActions.listAll());
    // customers still via generic crud for now
    // dispatch(crud.listAll({ entity: 'customer' }));
    setStops([]);
  }, []);

  useEffect(() => {
    setValue(
      'stops',
      stops.map((s, idx) => ({
        sequence: idx,
        name: s.name,
        address: s.address,
        customer: s.customer?._id || null,
      }))
    );
  }, [stops]);

  const today = dayjs();
  return (
    <Box component="form" id="travel-step-1">
      <Box display="flex" gap={2} mb={3}>
        <Autocomplete
          fullWidth
          value={selectedVehicle}
          onChange={(event, value) => setValue('vehicle', value)}
          options={vehicles || []}
          getOptionLabel={(option) => option?.plate || ''}
          renderInput={(params) => (
            <TextField {...params} sx={{ m: 0 }} required label="Vehículo" margin="normal" />
          )}
        />
        <TextField
          fullWidth
          label="Conductor"
          value={driverName}
          onChange={(e) => setValue('driverName', e.target.value)}
          margin="normal"
        />
        <DatePicker
          label="Fecha inicio"
          value={startDate}
          onChange={(date) => setValue('startDate', date)}
          minDate={today}
          renderInput={(params) => <TextField {...params} required margin="normal" />}
        />
        <DatePicker
          label="Fecha fin"
          value={endDate}
          onChange={(date) => setValue('endDate', date)}
          minDate={startDate || today}
          renderInput={(params) => <TextField {...params} required margin="normal" />}
        />
      </Box>

      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Checkbox
          checked={!!useExtraStock}
          onChange={(e) => setValue('useExtraStock', e.target.checked)}
        />
        <Typography variant="body2">Lleva stock adicional</Typography>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Typography variant="overline">Paradas</Typography>
        <IconButton color="primary" onClick={addStop} size="small">
          <Add />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2.5 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Nombre</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Dirección</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Cliente</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Acciones</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stops.map((stop) => (
              <TableRow key={`stop-${stop.id}`}>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={stop.name}
                    onChange={(e) => updateStop(stop.id, 'name', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    size="small"
                    value={stop.address}
                    onChange={(e) => updateStop(stop.id, 'address', e.target.value)}
                  />
                </TableCell>
                <TableCell>
                  <Autocomplete
                    fullWidth
                    value={stop.customer}
                    onChange={(event, value) => updateStop(stop.id, 'customer', value)}
                    options={customers || []}
                    getOptionLabel={(option) => option?.name || ''}
                    renderInput={(params) => (
                      <TextField {...params} size="small" variant="outlined" />
                    )}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => removeStop(stop.id)} color="error" size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddTravelForm;
