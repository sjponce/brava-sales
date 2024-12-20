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
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px">
        <Typography variant="h4" color="primary">Vendedores</Typography>
        <Button
          onClick={handleClickOpen}
          disabled={userState.role !== 'admin'}
          variant="text"
          size="large"
          color="primary"
          startIcon={<AddCircle />}>
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Nuevo vendedor
          </Typography>
        </Button>
      </Box>
      <AddSellerModal open={open} handlerOpen={handleClose} idSeller="" />
      <SellersDataTable />
    </Box>
  );
};

export default Sellers;
