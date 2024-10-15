import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Box,
  CssBaseline,
  Container,
} from '@mui/material';
import Navbar from './navbar/Navbar';
import Filters from './filters/Filters';

const EcommerceLayout = () => {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <Box display="flex" justifyContent="center">
      <CssBaseline />
      <Navbar toggleDrawer={toggleDrawer} />
      <Filters open={open} toggleDrawer={toggleDrawer} />
      <Box>
        <Container>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default EcommerceLayout;
