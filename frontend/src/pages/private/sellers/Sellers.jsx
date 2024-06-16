import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import DataTableSellers from './components/DataTableSellers';
import AddSellerDialog from './components/AddSellerDialog';

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
        <Typography variant="h4">Vendedores</Typography>
        <Button
          onClick={handleClickOpen}
          disabled={userState.role !== 'ADMIN'}
          variant="text"
          size="large"
          color="primary"
          startIcon={<AddCircle />}>
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Nuevo vendedor
          </Typography>
        </Button>
      </Box>
      <AddSellerDialog isOpen={open} onCancel={handleClose} idSeller="" />
      <DataTableSellers />
    </Box>
  );
};

export default Sellers;
