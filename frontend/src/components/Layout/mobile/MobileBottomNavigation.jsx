import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { BottomNavigation, BottomNavigationAction, Paper, useTheme, useMediaQuery } from '@mui/material';
import {
  HomeOutlined,
  PeopleAltOutlined,
  SellOutlined,
  ShoppingBagOutlined,
  MoreHoriz,
} from '@mui/icons-material';

const MobileBottomNavigation = ({ onMoreClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const userState = useSelector((store) => store.auth.current);

  if (!isMobile) return null;

  const getMobileMenuItems = () => {
    const baseItems = [
      {
        label: 'Inicio',
        icon: <HomeOutlined />,
        path: '/',
      },
    ];

    if (userState.role === 'admin') {
      return [
        ...baseItems,
        {
          label: 'Productos',
          icon: <SellOutlined />,
          path: '/products',
        },
        {
          label: 'Pedidos',
          icon: <ShoppingBagOutlined />,
          path: '/sales-orders',
        },
        {
          label: 'Clientes',
          icon: <PeopleAltOutlined />,
          path: '/customers',
        },
        {
          label: 'Más',
          icon: <MoreHoriz />,
          path: null,
          isAction: true,
        },
      ];
    }

    if (userState.role === 'seller') {
      return [
        ...baseItems,
        {
          label: 'Productos',
          icon: <SellOutlined />,
          path: '/products',
        },
        {
          label: 'Pedidos',
          icon: <ShoppingBagOutlined />,
          path: '/sales-orders',
        },
        {
          label: 'Clientes',
          icon: <PeopleAltOutlined />,
          path: '/customers',
        },
        {
          label: 'Más',
          icon: <MoreHoriz />,
          path: null,
          isAction: true,
        },
      ];
    }

    return [
      ...baseItems,
      {
        label: 'Clientes',
        icon: <PeopleAltOutlined />,
        path: '/customers',
      },
      {
        label: 'Pedidos',
        icon: <ShoppingBagOutlined />,
        path: '/sales-orders',
      },
      {
        label: 'Más',
        icon: <MoreHoriz />,
        path: null,
        isAction: true,
      },
    ];
  };

  const mobileMenuItems = getMobileMenuItems();

  const getActiveIndex = () => {
    const currentPath = location.pathname;

    const moreOptionsRoutes = [
      '/sellers',
      '/trips',
      '/shipping',
      '/productsReport',
      '/clientsReport',
      '/ordersReport'
    ];

    if (moreOptionsRoutes.some((route) => currentPath.startsWith(route))) {
      const moreButtonIndex = mobileMenuItems.findIndex((item) => item.isAction);
      return moreButtonIndex >= 0 ? moreButtonIndex : 0;
    }

    const activeIndex = mobileMenuItems.findIndex((item) => {
      if (item.path === '/' && currentPath === '/') return true;
      if (item.path !== '/' && item.path && currentPath.startsWith(item.path)) return true;
      return false;
    });

    return activeIndex >= 0 ? activeIndex : 0;
  };

  const handleNavigation = (event, newValue) => {
    const selectedItem = mobileMenuItems[newValue];
    if (selectedItem) {
      if (selectedItem.isAction && onMoreClick) {
        onMoreClick(event);
      } else if (selectedItem.path) {
        navigate(selectedItem.path);
      }
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderRadius: '16px 16px 0 0',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '4px',
          backgroundColor: theme.palette.grey[300],
          borderRadius: '2px',
          marginTop: '8px',
        },
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActiveIndex()}
        onChange={handleNavigation}
        showLabels
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: '16px 16px 0 0',
          paddingTop: '12px',
          paddingBottom: '8px',
          height: '70px',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px 8px',
            '&.Mui-selected': {
              color: 'primary.main',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 600,
              },
            },
            '&:not(.Mui-selected)': {
              color: 'text.secondary',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.7rem',
            marginTop: '4px',
          },
          '& .MuiSvgIcon-root': {
            fontSize: '1.5rem',
          },
        }}
      >
        {mobileMenuItems.map((item, index) => (
          <BottomNavigationAction
            key={index}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default MobileBottomNavigation;
