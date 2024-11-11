import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
import AddTripModal from './components/AddTripModal';
import TripsDataTable from './components/TripsDataTable';

const Trips = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px">
        <Typography variant="h4">Viajes</Typography>
        <Button
          onClick={handleClickOpen}
          variant="text"
          size="large"
          color="primary"
          startIcon={<AddCircle />}>
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Nuevo viaje
          </Typography>
        </Button>
      </Box>
      <AddTripModal open={open} handlerOpen={handleClose} idTrip="" />
      <TripsDataTable />
    </Box>
  );
};

export default Trips;
