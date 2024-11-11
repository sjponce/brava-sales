import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import AddCustomerModal from './components/AddCustomerModal';
import DataTableCustomers from './components/DataTableCustomers';

const Customers = () => {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const userState = useSelector((store) => store.auth.current);

  return (
    <Box display="flex" flexDirection="column" height="100%" maxWidth={{ lg: '85vw', md: '89vw', xs: '80vw' }}>
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px">
        <Typography variant="h4" color="primary">Clientes</Typography>
        <Button
          onClick={handleClickOpen}
          disabled={userState.role !== 'admin'}
          variant="text"
          size="large"
          color="primary"
          startIcon={<AddCircle />}>
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Nuevo cliente
          </Typography>
        </Button>
      </Box>
      <AddCustomerModal open={open} handlerOpen={handleClose} idCustomer="" />
      <DataTableCustomers />
    </Box>
  );
};

export default Customers;
