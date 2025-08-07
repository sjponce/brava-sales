import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Card,
  CardActionArea,
  Typography,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Close,
  HomeOutlined,
  PeopleAltOutlined,
  SellOutlined,
  ShoppingBagOutlined,
  InsertChartOutlined,
  WorkOutlineRounded,
  LocalShippingOutlined,
  AirportShuttleOutlined,
} from '@mui/icons-material';

const MobileOptionsPopup = ({ open = false, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userState = useSelector((store) => store.auth.current);

  // Mostrar solo en dispositivos móviles
  if (!isMobile) return null;

  // Función para obtener todas las opciones disponibles según el rol
  const getAllOptions = () => {
    if (userState.role === 'admin') {
      return [
        // Opciones principales (ya están en el bottom nav)
        { title: 'Inicio', icon: <HomeOutlined />, path: '/', category: 'principal' },
        { title: 'Productos', icon: <SellOutlined />, path: '/products', category: 'principal' },
        { title: 'Pedidos', icon: <ShoppingBagOutlined />, path: '/sales-orders', category: 'principal' },
        { title: 'Clientes', icon: <PeopleAltOutlined />, path: '/customers', category: 'principal' },

        // Opciones adicionales (las que aparecen en el popup)
        { title: 'Vendedores', icon: <WorkOutlineRounded />, path: '/sellers', category: 'adicional' },
        { title: 'Viajes', icon: <AirportShuttleOutlined />, path: '/trips', category: 'adicional' },
        { title: 'Entregas', icon: <LocalShippingOutlined />, path: '/shipping', category: 'adicional' },
        { title: 'Reporte Productos', icon: <InsertChartOutlined />, path: '/productsReport', category: 'adicional' },
        { title: 'Reporte Clientes', icon: <InsertChartOutlined />, path: '/clientsReport', category: 'adicional' },
      ];
    }

    if (userState.role === 'seller') {
      return [
        // Opciones principales
        { title: 'Inicio', icon: <HomeOutlined />, path: '/', category: 'principal' },
        { title: 'Productos', icon: <SellOutlined />, path: '/products', category: 'principal' },
        { title: 'Pedidos', icon: <ShoppingBagOutlined />, path: '/sales-orders', category: 'principal' },
        { title: 'Clientes', icon: <PeopleAltOutlined />, path: '/customers', category: 'principal' },

        // Opciones adicionales
        { title: 'Viajes', icon: <AirportShuttleOutlined />, path: '/trips', category: 'adicional' },
        { title: 'Entregas', icon: <LocalShippingOutlined />, path: '/shipping', category: 'adicional' },
      ];
    }

    // Usuario por defecto
    return [
      // Opciones principales
      { title: 'Inicio', icon: <HomeOutlined />, path: '/', category: 'principal' },
      { title: 'Clientes', icon: <PeopleAltOutlined />, path: '/customers', category: 'principal' },
      { title: 'Pedidos', icon: <ShoppingBagOutlined />, path: '/sales-orders', category: 'principal' },

      // Opciones adicionales (limitadas para usuarios básicos)
    ];
  };
  // Obtener solo las opciones adicionales (no las del menú principal)
  const getAdditionalOptions = () => getAllOptions().filter((option) => option.category === 'adicional');

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const additionalOptions = getAdditionalOptions();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          margin: '16px',
          maxHeight: '70vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
        }}
      >
        <Typography variant="h6" color="primary" fontWeight="bold">
          Más opciones
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        {additionalOptions.length > 0 ? (
          <Grid container spacing={2}>
            {additionalOptions.map((option, index) => (
              <Grid item xs={6} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-2px)',
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardActionArea
                    onClick={() => handleNavigation(option.path)}
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minHeight: '100px',
                      backgroundColor: isActive(option.path) ? 'primary.light' : 'transparent',
                      color: isActive(option.path) ? 'primary.contrastText' : 'inherit',
                    }}
                  >
                    <Box
                      sx={{
                        color: isActive(option.path) ? 'inherit' : 'primary.main',
                        mb: 1,
                      }}
                    >
                      {React.cloneElement(option.icon, { fontSize: 'large' })}
                    </Box>
                    <Typography
                      variant="body2"
                      align="center"
                      fontWeight={isActive(option.path) ? 600 : 400}
                      sx={{ fontSize: '0.875rem' }}
                    >
                      {option.title}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 4,
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
            >
              Todas las opciones están disponibles en el menú principal
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MobileOptionsPopup;
