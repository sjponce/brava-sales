import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AddTripModal from './components/AddTripModal';
import TripsDataTable from './components/TripsDataTable';

const Trips = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const userState = useSelector((store) => store.auth.current);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <AddTripModal open={open} handlerOpen={handleClose} idTrip="" />
      <Typography variant="overline" color="primary" align="center">Viajes</Typography>
      <TripsDataTable />
      <Button
        variant="outlined"
        color="success"
        fullWidth
        onClick={handleClickOpen}
        disabled={userState.role !== 'admin'}
        sx={{
          bottom: 1,
          borderRadius: 3,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          boxShadow: 'none',
          bgcolor: 'background.default',
          ':hover': {
            bgcolor: 'background.alternative',
          },
          alignSelf: 'center',
        }}
      >
        <AddCircle sx={{ fontSize: 32 }} color="success" />
      </Button>
    </Box>
  );
};

export default Trips;
