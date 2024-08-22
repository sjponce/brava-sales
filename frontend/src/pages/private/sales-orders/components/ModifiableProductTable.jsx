import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Autocomplete,
  MenuItem,
  Select,
  Box,
  Typography,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import sales from '@/redux/sales/actions';
import { getOrderOptions } from '@/redux/sales/selectors';

const ModifiableProductTable = ({ setValue, watch, control }) => {
  const products = useSelector((store) => store.stock.listAll);
  const dispatch = useDispatch();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  let currentOptions = useSelector(getOrderOptions);

  const handlerUpdateOptions = (nameOption, dataOptions) => {
    currentOptions = { ...currentOptions, [nameOption]: dataOptions };
    dispatch(sales.updateOrderOptions({ ...currentOptions }));
  };

  const handleAddRow = () => {
    append({ product: '', price: 0 });
  };

  const handleDeleteRow = (index) => {
    remove(index);
  };

  useEffect(() => {
  }, [watch('products')]);

  const sumQuantity = (quantity) => {
    if (!quantity) return 0;
    return quantity.reduce((sum, q) => sum + q, 0);
  };

  const totalAmount = fields.reduce((sum, field, index) => {
    const price = watch(`products.${index}.price`) || 0;
    const quantity = watch(`products.${index}.sizes`)?.map((item) => item.quantity) || [];
    return sum + price * sumQuantity(quantity);
  }, 0);

  useEffect(() => {
    setValue('totalAmount', totalAmount);
  }, [totalAmount]);

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2.5 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="overline">Detalles de orden</Typography>
            </TableCell>
            {/* <TableCell>Cantidad</TableCell> */}
            <TableCell> </TableCell>
            <TableCell align="right">
              <Typography variant="overline">Unitario</Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="overline">Subtotal</Typography>
            </TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <TableRow>
                <TableCell sx={{ borderBottom: 'none' }}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    id={`products.${index}.product`}
                    value={watch(`products.${index}`)}
                    style={{ width: '160px' }}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setValue(`products.${index}.product`, newValue._id);
                        setValue(`products.${index}.price`, newValue.price);
                        setValue(`products.${index}.stockId`, newValue.stockId);
                        setValue(`products.${index}.color`, '');
                        setValue(`products.${index}.sizes`, []);
                        handlerUpdateOptions(`sizes-${index}`, newValue.sizes);
                        handlerUpdateOptions(`variations-${index}`, newValue.variations);
                      } else {
                        setValue(`products.${index}.product`, null);
                        setValue(`products.${index}.price`, '');
                        setValue(`products.${index}.stockId`, '');
                        setValue(`products.${index}.color`, '');
                        setValue(`products.${index}.sizes`, []);
                        handlerUpdateOptions(`sizes-${index}`, []);
                        handlerUpdateOptions(`variations-${index}`, []);
                      }
                    }}
                    options={products.result.items.result}
                    getOptionLabel={(option) => option?.stockId || ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?.product
                      || value?.product === null
                      || value?.product === ''}
                    renderInput={(params) => (
                      <TextField {...params} required label="Producto" margin="none" />
                    )}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  <Select
                    size="small"
                    value={watch(`products.${index}.color`) || ''}
                    onChange={(event) => setValue(`products.${index}.color`, event.target.value)}
                    required
                    margin="none"
                    sx={{ width: '160px' }}>
                    {(currentOptions[`variations-${index}`] || []).map((variation) => (
                      <MenuItem key={variation.id} value={variation.color}>
                        {variation.color}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }} align="right">
                  $
                  {watch(`products.${index}.price`) || 0}
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }} align="right">
                  $
                  {(watch(`products.${index}.price`) || 0)
                    * sumQuantity(watch(`products.${index}.sizes`)?.map((item) => item.quantity) || [])}
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  <IconButton data-test-id="DeleteIcon" onClick={() => handleDeleteRow(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell size="small">
                  <Select
                    size="small"
                    value={watch(`products.${index}.sizes`)?.map((item) => item.size) || []}
                    onChange={(event) => {
                      const selectedSizes = event.target.value;
                      const currentSizes = watch(`products.${index}.sizes`) || [];
                      const newSizes = selectedSizes.map((size) => {
                        const existingSize = currentSizes.find((item) => item.size === size);
                        return existingSize || { size, quantity: 0 };
                      });
                      setValue(`products.${index}.sizes`, newSizes);
                    }}
                    required
                    sx={{ width: '160px' }}
                    multiple>
                    {(currentOptions[`sizes-${index}`] || []).map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell colSpan={4}>
                  <Box display="flex" gap={2}>
                    {watch(`products.${index}.sizes`)?.map((item, sizeIndex) => (
                      <Box key={item.size}>
                        <TextField
                          size="small"
                          sx={{ width: '50px' }}
                          value={item.quantity || ''}
                          onChange={(event) => {
                            const { value } = event.target;
                            const currentSizes = watch(`products.${index}.sizes`) || [];
                            const newSizes = [...currentSizes];
                            if (/^\d+$/.test(value) && parseInt(value, 10) > 0) {
                              newSizes[sizeIndex].quantity = parseInt(value, 10);
                            } else {
                              newSizes[sizeIndex].quantity = 0;
                            }
                            setValue(`products.${index}.sizes`, newSizes);
                          }}
                          label={item.size}
                          required
                          InputLabelProps={{ shrink: true, required: false }}
                        />
                      </Box>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: 2 }}>
        <Typography variant="h6">
          Total: $
          {watch('totalAmount')?.toFixed(2) || 0}
        </Typography>
        <Button
          onClick={handleAddRow}
          startIcon={<Add />}
          variant="contained"
          color="primary"
          size="small">
          Agregar
        </Button>
      </Box>
    </TableContainer>
  );
};

export default ModifiableProductTable;
