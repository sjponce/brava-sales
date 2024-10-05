import {
  DarkModeOutlined,
  FilterList,
  LightModeOutlined,
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
  // const openCartStatus = useSelector(selectOpenCart);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const handleOpenCart = () => {
    dispatch(cart.openCart());
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
        <IconButton onClick={() => toggleDrawer(true)}>
          <FilterList />
        </IconButton>
        <Logo>
          <Typography
            variant="overline"
            sx={{ display: { xs: 'none', sm: 'flex', opacity: '0.7' }, mr: 2, ml: 1 }}>
            aderis
          </Typography>
        </Logo>
        <Box gap={1} display="flex" alignItems="center">
          <Divider orientation="vertical" flexItem variant="middle" />
          <IconButton onClick={handleOpenCart}>
            <Badge
              badgeContent={cartProductStatus.length}
              color="secondary"
              invisible={cartProductStatus.length === 0}>
              <ShoppingCart />
            </Badge>
          </IconButton>
          <IconButton>
            <Notifications />
          </IconButton>
          <IconButton onClick={handleToggleTheme}>
            {theme === 'dark' ? <LightModeOutlined /> : <DarkModeOutlined />}
          </IconButton>
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
