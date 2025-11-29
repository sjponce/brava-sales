import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  InsertChartOutlined,
  WorkOutlineRounded,
  LocalShippingOutlined,
  AirportShuttleOutlined,
} from '@mui/icons-material';

const MobileOptionsMenu = ({ anchorEl, open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userState = useSelector((store) => store.auth.current);

  if (!isMobile) return null;
  const getAdditionalOptions = () => {
    if (userState.role === 'admin') {
      return [
        { title: 'Vendedores', icon: <WorkOutlineRounded />, path: '/sellers' },
        { title: 'Viajes', icon: <AirportShuttleOutlined />, path: '/trips' },
        { title: 'Entregas', icon: <LocalShippingOutlined />, path: '/shipping' },
        { title: 'Reporte Productos', icon: <InsertChartOutlined />, path: '/productsReport' },
        { title: 'Reporte Clientes', icon: <InsertChartOutlined />, path: '/clientsReport' },
      ];
    }

    if (userState.role === 'seller') {
      return [
        { title: 'Viajes', icon: <AirportShuttleOutlined />, path: '/trips' },
        { title: 'Entregas', icon: <LocalShippingOutlined />, path: '/shipping' },
        { title: 'Reporte Productos', icon: <InsertChartOutlined />, path: '/productsReport' },
        { title: 'Reporte Clientes', icon: <InsertChartOutlined />, path: '/clientsReport' },
      ];
    }

    return [];
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const additionalOptions = getAdditionalOptions();

  return (
    <Menu
      id="mobile-options-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{
        'aria-labelledby': 'mobile-more-button',
      }}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          minWidth: '200px',
          maxWidth: '280px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        },
      }}
      transformOrigin={{ horizontal: 'center', vertical: 'bottom' }}
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
    >
      <MenuItem disabled sx={{ opacity: 1, cursor: 'default' }}>
        <Typography
          variant="caption"
          color="primary"
          fontWeight="bold"
          sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
        >
          Más opciones
        </Typography>
      </MenuItem>
      <Divider sx={{ my: 0.5 }} />

      {additionalOptions.length > 0 ? (
        additionalOptions.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleNavigation(option.path)}
            selected={isActive(option.path)}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: '8px',
              mx: 0.5,
              mb: 0.5,
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isActive(option.path) ? 'inherit' : 'primary.main',
                minWidth: '40px',
              }}
            >
              {option.icon}
            </ListItemIcon>
            <ListItemText
              primary={option.title}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: isActive(option.path) ? 600 : 400,
              }}
            />
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled sx={{ opacity: 0.7, fontStyle: 'italic' }}>
          <ListItemText
            primary="Todas las opciones están en el menú principal"
            primaryTypographyProps={{
              fontSize: '0.85rem',
              color: 'text.secondary',
            }}
          />
        </MenuItem>
      )}
    </Menu>
  );
};

export default MobileOptionsMenu;
