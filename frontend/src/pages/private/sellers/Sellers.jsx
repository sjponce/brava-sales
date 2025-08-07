import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SellersDataTable from './components/SellersDataTable';
import AddSellerModal from './components/AddSellerModal';

const Sellers = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const userState = useSelector((store) => store.auth.current);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="overline" color="primary" align="center">
        Vendedores
      </Typography>
      <AddSellerModal open={open} handlerOpen={handleClose} idSeller="" />
      <SellersDataTable />
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
          border: 1,
          bgcolor: 'background.default',
          ':hover': {
            bgcolor: 'background.alternative',
          },
          alignSelf: 'center',
        }}>
        <AddCircle sx={{ fontSize: 32 }} color="success" />
      </Button>
    </Box>
  );
};

export default Sellers;
