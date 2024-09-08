import React from 'react';
import { Outlet } from 'react-router-dom';
import {
  Toolbar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  Container,
} from '@mui/material';
import Navbar from './navbar/Navbar';

const drawerWidth = 300;

const EcommerceLayout = () => {
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    console.log('open');
    setOpen(!open);
  };

  return (
    <Box display="flex" justifyContent="center">
      <CssBaseline />
      <Navbar handlerOpenMenu={handleDrawerOpen} />
      <Drawer anchor="left" open={open} variant="persistent">
        <Toolbar />
        <Box sx={{ overflow: 'auto', width: drawerWidth }}>
          <List>
            {['Filtro 1', 'Filtro 2', 'Filtro 3', 'Filtro 4'].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box>
        <Container>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default EcommerceLayout;
