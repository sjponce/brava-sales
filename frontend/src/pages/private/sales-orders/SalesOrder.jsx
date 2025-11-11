import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
import SalesOrdersDataTable from './components/SalesOrderDataTable';
import AddOrderSalesModal from './components/AddSalesOrderModal';

const SalesOrders = () => {
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
        Órdenes de Venta
      </Typography>
      <AddOrderSalesModal open={open} handlerOpen={handleClose} idSalesOrder="" />
      <SalesOrdersDataTable />
      <Button
        variant="outlined"
        color="success"
        fullWidth
        data-test-id="AddButton"
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

export default SalesOrders;
