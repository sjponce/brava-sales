import {
  Avatar,
  AvatarGroup,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getProductImages } from '@/redux/stock/selectors';
import { selectOpenOrderDialog } from '@/redux/cart/selectors';
import cart from '@/redux/cart/actions';
import translateStatus from '@/utils/translateSalesStatus';

const OrdersDialog = ({ handleAction }) => {
  const ordersRaw = useSelector((store) => store.crud.filter)?.result?.result;
  const orderDialogOpen = useSelector(selectOpenOrderDialog);
  const productImageMap = useSelector(getProductImages);
  const dispatch = useDispatch();

  const orders = ordersRaw ? [...ordersRaw].sort((a, b) => {
    const codeA = a.salesOrderCode || '';
    const codeB = b.salesOrderCode || '';
    return codeB.localeCompare(codeA, undefined, { numeric: true });
  }) : [];

  const toggleDialog = () => {
    dispatch(cart.openOrderDialog());
  };

  const handleSelectOrder = (order) => {
    toggleDialog();
    handleAction(order._id);
  };

  return (
    <Dialog
      open={orderDialogOpen}
      fullWidth
      maxWidth="sm"
      onClose={() => toggleDialog()}
      PaperProps={{ sx: { maxHeight: '80vh' } }}
    >
      <DialogTitle color="secondary" variant="h4">Mis pedidos</DialogTitle>
      <DialogContent>
        <List>
          {orders?.map((order) => (
            <ListItem disableGutters key={order._id}>
              <ListItemButton onClick={() => handleSelectOrder(order)} sx={{ borderRadius: 2.5 }}>
                <Box display="flex" gap={2} alignItems="center">
                  <ListItemAvatar sx={{ alignContent: 'center' }}>
                    <AvatarGroup max={4}>
                      {order.products.map((product) => (
                        <Avatar
                          key={product.idStock}
                          src={productImageMap ? productImageMap[product.idStock] : ''}
                        />
                      ))}
                    </AvatarGroup>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`Orden ${order.salesOrderCode}`}
                    secondary={`Fecha: ${new Date(order.orderDate).toLocaleDateString()} - Estado: ${translateStatus(order.status)}`}
                  />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default OrdersDialog;
