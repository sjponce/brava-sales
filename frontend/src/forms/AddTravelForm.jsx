import {
  Autocomplete,
  Box,
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
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { vehiclesActions } from '@/redux/vehicles';
import { selectVehiclesList } from '@/redux/vehicles/selectors';
import crud from '@/redux/crud/actions';

const CITIES = [
  { id: 1, name: 'Córdoba' },
  { id: 2, name: 'Villa Carlos Paz' },
  { id: 3, name: 'La Rioja' },
  { id: 4, name: 'Chilecito' },
  { id: 5, name: 'San Salvador de Jujuy' },
  { id: 6, name: 'Tilcara' },
  { id: 7, name: 'Salta' },
  { id: 8, name: 'Cafayate' },
  { id: 9, name: 'San Miguel de Tucumán' },
  { id: 10, name: 'Tafí del Valle' },
];

const AddTravelForm = ({ setValue, watch }) => {
  const dispatch = useDispatch();
  const [stops, setStops] = useState([]);
  const vehicles = useSelector(selectVehiclesList);

  const selectedVehicle = watch('vehicle') || null;

  const addStop = () => {
    setStops((prev) => [
      ...prev,
      {
        id: Date.now(),
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
    dispatch(crud.listAll({ entity: 'seller' }));
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
        <Autocomplete
          style={{ width: '400px' }}
          value={watch('seller') || null}
          onChange={(event, value) => {
            setValue('seller', value);
            const fullName = value ? [value.name, value.surname].filter(Boolean).join(' ') : '';
            setValue('driverName', fullName);
          }}
          options={useSelector((store) => store.crud?.listAll?.result?.items?.result) || []}
          getOptionLabel={(option) => {
            if (!option) return '';
            const fullName = [option.name, option.surname].filter(Boolean).join(' ');
            return fullName || option?.user?.email || '';
          }}
          renderInput={(params) => (
            <TextField {...params} sx={{ m: 0 }} label="Vendedor" margin="normal" />
          )}
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
                <Typography variant="overline">Localidad</Typography>
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
            {stops.map((stop, index) => {
              const today = dayjs().startOf('day');
              const prevEnd = (index > 0 && stops[index - 1]?.plannedEnd)
                ? dayjs(stops[index - 1].plannedEnd)
                : null;
              const minStart = (prevEnd && prevEnd.isValid()) ? prevEnd : today;
              const startValue = stop.plannedStart ? dayjs(stop.plannedStart) : null;
              const minEnd = (startValue && startValue.isValid()) ? startValue : today;
              return (
                <TableRow key={`stop-${stop.id}`}>
                  <TableCell sx={{ width: 200 }}>
                    <Autocomplete
                      fullWidth
                      value={stop.name}
                      onChange={(event, value) => updateStop(stop.id, 'name', value?.name)}
                      options={CITIES}
                      getOptionLabel={(option) => option?.name || ''}
                      renderInput={(params) => (
                        <TextField {...params} size="small" variant="outlined" />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      slotProps={{ textField: { sx: { width: '100%', margin: 0 } } }}
                      value={startValue}
                      minDate={minStart}
                      onChange={(date) => updateStop(stop.id, 'plannedStart', date)}
                      renderInput={(params) => (
                        <TextField {...params} size="small" variant="outlined" />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <DatePicker
                      slotProps={{ textField: { sx: { width: '100%', margin: 0 } } }}
                      value={stop.plannedEnd ? dayjs(stop.plannedEnd) : null}
                      onChange={(date) => updateStop(stop.id, 'plannedEnd', date)}
                      minDate={minEnd}
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
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddTravelForm;
