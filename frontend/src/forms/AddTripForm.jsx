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
  Button,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector, useDispatch } from 'react-redux';
import { DatePicker } from '@mui/x-date-pickers';
import crud from '@/redux/crud/actions';

const CITIES = [
  { id: 1, name: 'Córdoba' },
  { id: 2, name: 'Alta Gracia' },
  { id: 3, name: 'Carlos Paz' },
];

const AddTripForm = ({ setValue, watch }) => {
  const dispatch = useDispatch();
  const [destinations, setDestinations] = useState([]);
  const sellers = useSelector((store) => store.crud?.listAll?.result?.items?.result);
  const selectedSeller = watch('seller') || null;
  const startDate = watch('startDate') || null;
  const endDate = watch('endDate') || null;

  const addDestination = () => {
    setDestinations([
      ...destinations,
      {
        id: Date.now(),
        city: '',
        arrivalDate: null,
      },
    ]);
  };

  const removeDestination = (id) => {
    setDestinations(destinations?.filter((dest) => dest.id !== id));
  };

  const updateDestination = (id, field, value) => {
    setDestinations(
      destinations.map((dest) => (dest.id === id ? { ...dest, [field]: value } : dest))
    );
  };

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'seller' }));
    setDestinations([]);
  }, []);

  useEffect(() => {
    setValue('destinations', destinations);
  }, [destinations]);

  const today = dayjs();
  return (
    <Box component="form" id="trip-step-1">
      <Box display="flex" gap={2} mb={3}>
        <Autocomplete
          fullWidth
          m={0}
          value={selectedSeller}
          onChange={(event, value) => setValue('seller', value)}
          options={sellers}
          getOptionLabel={(option) => option?.name || ''}
          renderInput={(params) => (
            <TextField {...params} sx={{ m: 0 }} required label="Vendedor" margin="normal" />
          )}
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

      <Button variant="contained" startIcon={<Add />} onClick={addDestination} sx={{ mb: 2 }}>
        Agregar Destino
      </Button>

      <TableContainer component={Paper} sx={{ borderRadius: 2.5 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Localidad</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="overline">Fecha de llegada</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Acciones</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {destinations.map((destination, index) => (
              <TableRow key={`destination-${index}`}>
                <TableCell>
                  <Autocomplete
                    fullWidth
                    value={destination.city}
                    onChange={(event, value) => updateDestination(destination.id, 'city', value)}
                    options={CITIES}
                    getOptionLabel={(option) => option?.name || ''}
                    renderInput={(params) => (
                      <TextField {...params} size="small" variant="outlined" />
                    )}
                  />
                </TableCell>
                <TableCell>
                  <DatePicker
                    value={destination.arrivalDate}
                    onChange={(date) => updateDestination(destination.id, 'arrivalDate', date)}
                    minDate={startDate || today}
                    maxDate={endDate}
                    renderInput={(params) => (
                      <TextField {...params} size="small" variant="outlined" />
                    )}
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => removeDestination(destination.id)} color="error">
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

export default AddTripForm;
