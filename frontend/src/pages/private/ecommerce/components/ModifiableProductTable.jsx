import React, { useEffect } from 'react';
import {
  Paper,
  TextField,
  IconButton,
  MenuItem,
  Select,
  Box,
  Avatar,
  ListItemText,
  Grid,
  Tooltip,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import { RemoveShoppingCart } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import cart from '@/redux/cart/actions';
import { selectCartProducts } from '@/redux/cart/selectors';

const ModifiableProductTable = ({ setValue, watch }) => {
  const products = useSelector(selectCartProducts);
  const dispatch = useDispatch();

  const handleRemoveFromCart = (product) => {
    dispatch(cart.removeFromCart(product));
  };

  const sumQuantity = (quantity) => {
    if (!quantity) return 0;
    return quantity.reduce((sum, q) => sum + q, 0);
  };

  const totalAmount = products.reduce((sum, product) => {
    const price = product.price || 0;
    const quantity = product.sizes?.map((item) => item.quantity) || [];
    return sum + price * sumQuantity(quantity);
  }, 0);

  const updateProduct = (product) => {
    dispatch(cart.updateProductInCart(product));
  };

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [totalAmount]);

  return (
    <Paper sx={{ borderRadius: 2.5, padding: 2 }}>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid container item xs={12} key={`${product.stockId} ${product.color}`} spacing={2} sx={{ borderBottom: '1px solid #e0e0e0', paddingBottom: 2, marginBottom: 2 }}>
            <Grid item xs={12} display="flex" alignItems="center" justifyContent="space-between">
              <Avatar src={product.imageUrl} sx={{ width: 48, height: 48, marginRight: 2 }} />
              <ListItemText primary={`${product.name} ${product.color}`} secondary={`$ ${product.price}`} />
              <Tooltip title="Eliminar del carrito" placement="top">
                <IconButton data-test-id="DeleteIcon" onClick={() => handleRemoveFromCart(product)}>
                  <RemoveShoppingCart />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel size="small" id="size-select">Numeración</InputLabel>
                <Select
                  label="Numeración"
                  size="small"
                  labelId="size-select"
                  value={product.sizes?.map((item) => item.size) || []}
                  onChange={(event) => {
                    const selectedSizes = event.target.value;
                    const currentSizes = product.sizes || [];
                    const newSizes = selectedSizes.map((size) => {
                      const existingSize = currentSizes.find((item) => item.size === size);
                      return existingSize || { size, quantity: 0 };
                    });

                    newSizes.sort((a, b) => String(a.size).localeCompare(String(b.size)));

                    const updatedProduct = { ...product, sizes: newSizes };
                    updateProduct(updatedProduct);
                  }}
                  required
                  sx={{ width: '100%' }}
                  multiple>
                  {(product.optionSizes || []).map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="space-between" gap={2}>
              <Box display="flex" gap={2} flexWrap="wrap">
                {product.sizes?.map((item, sizeIndex) => (
                  <Box key={item.size}>
                    <TextField
                      size="small"
                      sx={{ width: '50px' }}
                      value={item.quantity || ''}
                      onChange={(event) => {
                        const { value } = event.target;
                        const currentSizes = product.sizes || [];
                        const newSizes = [...currentSizes];
                        if (/^\d+$/.test(value) && parseInt(value, 10) > 0) {
                          newSizes[sizeIndex] = { ...item, quantity: parseInt(value, 10) };
                        } else {
                          newSizes[sizeIndex] = { ...item, quantity: 0 };
                        }
                        const updatedProduct = { ...product, sizes: newSizes };
                        updateProduct(updatedProduct);
                      }}
                      label={item.size}
                      required
                      InputLabelProps={{ shrink: true, required: false }}
                    />
                  </Box>
                ))}
              </Box>
              <Typography variant="overline" alignContent="center" color="secondary">
                $
                {(product.price || 0)
                * sumQuantity(product.sizes?.map((item) => item.quantity) || [])}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6" color="primary">
          Total:
        </Typography>
        <Typography variant="h6" color="primary">
          ${watch('totalAmount')?.toFixed(2) || 0}
        </Typography>
      </Box>
    </Paper>
  );
};

export default ModifiableProductTable;
