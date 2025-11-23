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
import crud from '@/redux/crud/actions';

const AddTravelForm = ({ setValue, watch }) => {
  const dispatch = useDispatch();
  const [stops, setStops] = useState([]);
  const vehicles = useSelector(selectVehiclesList);
  const customers = useSelector((store) => store.crud?.listAll?.result?.items?.result);

  const selectedVehicle = watch('vehicle') || null;
  const driverName = watch('driverName') || '';

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
    // customers via generic crud
    dispatch(crud.listAll({ entity: 'customer' }));
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
        plannedStart: s.plannedStart || null,
        plannedEnd: s.plannedEnd || null,
      }))
    );
  }, [stops]);

  const today = dayjs();
  return (
    <Box component="form" id="travel-step-1">
      <Box display="flex" gap={2} mb={3}>
        <Autocomplete
          style={{ width: '350px' }}
          value={selectedVehicle}
          onChange={(event, value) => setValue('vehicle', value)}
          options={vehicles || []}
          getOptionLabel={(option) => option?.plate || ''}
          renderInput={(params) => (
            <TextField {...params} sx={{ m: 0 }} required label="Vehículo" margin="normal" />
          )}
        />
        <TextField
          style={{ width: '400px' }}
          label="Conductor"
          value={driverName}
          onChange={(e) => setValue('driverName', e.target.value)}
        />
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
              <TableCell>
                <Typography variant="overline">Inicio</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Fin</Typography>
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
                <TableCell>
                  <DatePicker
                    value={stop.plannedStart || null}
                    onChange={(date) => updateStop(stop.id, 'plannedStart', date)}
                    renderInput={(params) => (
                      <TextField {...params} size="small" variant="outlined" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <DatePicker
                    value={stop.plannedEnd || null}
                    onChange={(date) => updateStop(stop.id, 'plannedEnd', date)}
                    minDate={stop.plannedStart || null}
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


