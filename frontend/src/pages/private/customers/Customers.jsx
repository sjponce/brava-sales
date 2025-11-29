import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
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

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="overline" color="primary" align="center">
        Clientes
      </Typography>
      <AddCustomerModal open={open} handlerOpen={handleClose} idCustomer="" />
      <DataTableCustomers />
      <Button
        variant="outlined"
        color="success"
        data-test-id="add-customer-button"
        fullWidth
        onClick={handleClickOpen}
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

export default Customers;
