import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Toolbar,
  Button,
  Tooltip, Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowForwardIos, ProductionQuantityLimits, RemoveShoppingCart } from '@mui/icons-material';
import cart from '@/redux/cart/actions';
import { selectCartProducts, selectOpenCart } from '@/redux/cart/selectors';

const drawerWidth = 350;

const Cart = ({ setOpen }) => {
  const dispatch = useDispatch();
  const cartOpenStatus = useSelector(selectOpenCart);
  const cartProductsStatus = useSelector(selectCartProducts);

  const toggleDrawer = () => {
    dispatch(cart.openCart());
  };

  const handleResetCart = () => {
    dispatch(cart.resetState());
  };

  const handleRemoveFromCart = (product) => {
    dispatch(cart.removeFromCart(product));
  };

  const handleOpen = () => {
    dispatch(cart.openCart());
    setOpen(true);
  };

  return (
    <Drawer anchor="right" open={cartOpenStatus} variant="temporary" onClose={() => toggleDrawer()}>
      <Box
        sx={{
          overflow: 'auto',
          width: { xs: '100vw', sm: drawerWidth },
          display: 'flex',
          flexDirection: 'column',
        }}>
        <Toolbar>
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
            <Tooltip title="Ocultar" arrow>
              <IconButton aria-label="hide" onClick={() => toggleDrawer()}>
                <ArrowForwardIos />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vaciar carrito" arrow>
              <IconButton data-test-id="CloseIcon" onClick={handleResetCart} color="error">
                <ProductionQuantityLimits />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
        <List subheader={(
          <ListSubheader>
            <Typography variant="h6" color="primary">
              Productos en carrito
            </Typography>
          </ListSubheader>
        )}
        >
          <>
            {cartProductsStatus.map((product) => (
              <ListItem key={`${product.stockId} ${product.color}`} sx={{ padding: 2 }}>
                <Avatar src={product.imageUrl} sx={{ width: 64, height: 64, marginRight: 2 }} />
                <ListItemText primary={product.name} secondary={`$ ${product.price}`} />
                <Tooltip title="Quitar" arrow>
                  <IconButton
                    aria-label="delete"
                    onClick={() => handleRemoveFromCart(product)}>
                    <RemoveShoppingCart />
                  </IconButton>
                </Tooltip>
              </ListItem>
            ))}
          </>
        </List>
      </Box>
      <Button
        size="large"
        color="success"
        fullWidth
        disabled={cartProductsStatus.length === 0}
        onClick={handleOpen}>
        Formular pedido
      </Button>
    </Drawer>
  );
};

export default Cart;
