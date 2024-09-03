import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import { useState } from 'react';
import SalesOrdersDataTable from './components/SalesOrderDataTable';
// import AddSalesOrderModal from './components/AddSalesOrderModal';
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
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px">
        <Typography variant="h4">Ordenes de venta</Typography>
        <Button
          onClick={handleClickOpen}
          variant="text"
          size="large"
          color="primary"
          startIcon={<AddCircle />}>
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Nueva Orden de Venta
          </Typography>
        </Button>
      </Box>
      <AddOrderSalesModal open={open} handlerOpen={handleClose} idSalesOrder="" />
      <SalesOrdersDataTable />
    </Box>
  );
};

export default SalesOrders;
