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
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RemoveShoppingCart } from '@mui/icons-material';
import cart from '@/redux/cart/actions';
import { selectCartProducts, selectOpenCart } from '@/redux/cart/selectors';

const drawerWidth = 350;

const Cart = () => {
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
      <Toolbar />
      <Box sx={{ overflow: 'auto', width: drawerWidth }}>
        <List subheader={<ListSubheader>Carrito de compras</ListSubheader>}>
          <>
            {cartProductsStatus.map((product) => (
              <ListItem
                key={product.id}
              >
                <Avatar src={product.imageUrl} sx={{ width: 56, height: 56, marginRight: 2 }} />
                <ListItemText primary={product.name} secondary={`$${product.price}`} />
                <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveFromCart(product)}>
                  <RemoveShoppingCart />
                </IconButton>
              </ListItem>
            ))}
          </>
        </List>
        <Button variant="outlined" type="primary" fullWidth disabled={(cartProductsStatus.length === 0)}>
          Ir pedido
        </Button>
      </Box>
    </Drawer>
  );
};

export default Cart;
