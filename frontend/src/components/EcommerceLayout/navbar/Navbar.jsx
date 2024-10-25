import {
  DarkMode,
  FilterList,
  LightMode,
  LocalMall,
  Notifications,
  ShoppingCart,
} from '@mui/icons-material';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  styled,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toggleTheme } from '@/redux/themeReducer';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import cart from '@/redux/cart/actions';
import { selectCartProducts } from '@/redux/cart/selectors';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const StyledToolbar = styled(Toolbar)({
  paddingRight: '20px',
  paddingLeft: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  height: '64px',
  boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .1)',
});

const Logo = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  '& img': {
    width: '30px',
    height: '30px',
    objectFit: 'cover',
  },
}));

const Navbar = ({ toggleDrawer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

  const user = useSelector((state) => state.auth.current);
  const theme = useSelector((state) => state.theme);
  const cartProductStatus = useSelector(selectCartProducts);
  const orders = useSelector((store) => store.crud.filter)?.result?.result;
  const currentUser = useSelector(selectCurrentAdmin);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleOpenCart = () => {
    dispatch(cart.openCart());
  };

  const handleOpenOrderDialog = () => {
    if (!currentUser.customer) return;
    dispatch(cart.openOrderDialog());
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack position="fixed" sx={{ zIndex: 1 }}>
      <StyledToolbar
        sx={{ backgroundColor: 'background.paper', borderRadius: 2.5, margin: 1.5, opacity: 0.9 }}
        disableGutters>
        <Tooltip title="Filtrar" arrow>
          <IconButton onClick={() => toggleDrawer(true)}>
            <FilterList />
          </IconButton>
        </Tooltip>
        <Logo>
          <Typography
            variant="overline"
            sx={{ display: { xs: 'none', sm: 'flex', opacity: '0.7' }, mr: 2, ml: 1 }}>
            aderis
          </Typography>
        </Logo>
        <Box gap={1} display="flex" alignItems="center">
          <Divider orientation="vertical" flexItem variant="middle" />
          <Tooltip title="Carrito" arrow>
            <IconButton onClick={handleOpenCart} color="primary">
              <Badge
                badgeContent={cartProductStatus.length}
                color="info"
                invisible={cartProductStatus.length === 0}>
                <ShoppingCart />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title="Notificaciones" arrow>
            <IconButton color="warning">
              <Notifications />
            </IconButton>
          </Tooltip>
          <Tooltip title="Mis pedidos" arrow>
            <IconButton onClick={handleOpenOrderDialog} color="secondary">
              <Badge
                badgeContent={orders?.length}
                color="info"
                invisible={orders?.length === 0}>
                <LocalMall />
              </Badge>
            </IconButton>
          </Tooltip>
          <Tooltip title={`Modo ${theme === 'dark' ? 'oscuro' : 'claro'}`} arrow>
            <IconButton onClick={handleToggleTheme}>
              {theme === 'dark' ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem variant="middle" />
          <IconButton onClick={handleClick}>
            <Avatar src={user.photo} sx={{ width: 30, height: 30 }} />
          </IconButton>
        </Box>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
          <MenuItem onClick={handleClose}>Perfil</MenuItem>
          <MenuItem onClick={() => setDialogOpen(true)}>Cerrar sesión</MenuItem>
        </Menu>
      </StyledToolbar>
      <CustomDialog
        title="Cerrar sesión"
        text="¿Estás seguro de que deseas cerrar sesión?"
        isOpen={dialogOpen}
        onCancel={() => setDialogOpen(false)}
        onAccept={() => navigate('/logout')}
      />
    </Stack>
  );
};

export default Navbar;
