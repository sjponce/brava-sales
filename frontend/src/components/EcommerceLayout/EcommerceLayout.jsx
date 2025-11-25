import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  CssBaseline,
  Container,
} from '@mui/material';
import Navbar from './navbar/Navbar';
import Filters from './filters/Filters';

const EcommerceLayout = () => {
  const [open, setOpen] = React.useState(false);
  const productState = useSelector((store) => store.stock.listAllCatalog);
  const products = productState?.result?.items?.result || [];

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Box display="flex" justifyContent="center">
      <CssBaseline />
      <Navbar toggleDrawer={toggleDrawer} />
      <Filters open={open} toggleDrawer={toggleDrawer} products={products} />
      <Box>
        <Container>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default EcommerceLayout;
