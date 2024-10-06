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
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowForwardIos, RemoveShoppingCart } from '@mui/icons-material';
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

  const handleRemoveFromCart = (product) => {
    dispatch(cart.removeFromCart(product));
  };

  return (
    <Drawer anchor="right" open={cartOpenStatus} variant="temporary" onClose={() => toggleDrawer()}>
      <Box sx={{ overflow: 'auto', width: { xs: '100vw', sm: drawerWidth }, display: 'flex', flexDirection: 'column' }}>
        <Toolbar>
          <Tooltip title="Ocultar" arrow>
            <IconButton aria-label="hide" onClick={() => toggleDrawer()}>
              <ArrowForwardIos />
            </IconButton>
          </Tooltip>
        </Toolbar>
        <List subheader={<ListSubheader>Productos en carrito</ListSubheader>}>
          <>
            {cartProductsStatus.map((product) => (
              <ListItem
                key={`${product.stockId} ${product.color}`}
                sx={{ padding: 2 }}
              >
                <Avatar src={product.imageUrl} sx={{ width: 64, height: 64, marginRight: 2 }} />
                <ListItemText primary={product.name} secondary={`$ ${product.price}`} />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(product)}>
                  <RemoveShoppingCart />
                </IconButton>
              </ListItem>
            ))}
          </>
        </List>
      </Box>
      <Button
        type="primary"
        size="large"
        fullWidth
        disabled={(cartProductsStatus.length === 0)}
        onClick={() => setOpen(true)}
        >
        Formular pedido
      </Button>
    </Drawer>
  );
};

export default Cart;
