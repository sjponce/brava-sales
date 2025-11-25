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
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';
import sales from '@/redux/sales/actions';
import { getOrderOptions } from '@/redux/sales/selectors';
import stockRequest from '@/request/stockRequest';

const ModifiableProductTableTrips = ({ setValue, watch, control, limitByStock = false }) => {
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
                    style={{ width: '170px' }}
                    onChange={(_, newValue) => {
                      if (newValue) {
                        setValue(`products.${index}.product`, newValue._id);
                        setValue(`products.${index}.price`, newValue.price);
                        setValue(`products.${index}.stockId`, newValue.stockId);
                        setValue(`products.${index}.color`, '');
                        setValue(`products.${index}.sizes`, []);
                        // When limiting by stock, don't show sizes until color stock fetched
                        handlerUpdateOptions(`sizes-${index}`, limitByStock ? [] : newValue.sizes);
                        // If limitByStock, keep only variations with stock > 0
                        const nextVariations = limitByStock
                          ? (newValue.variations || []).filter((v) => Number(v.stock) > 0)
                          : (newValue.variations || []);
                        handlerUpdateOptions(`variations-${index}`, nextVariations);
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
                    options={(() => {
                      const raw = products.result?.items?.result || [];
                      if (!limitByStock) return raw;
                      return raw.filter((p) => {
                        const total = (p.variations || []).reduce((sum, v) => sum + Number(v.stock || 0), 0);
                        return total > 0;
                      });
                    })()}
                    getOptionLabel={(option) => option?.stockId || ''}
                    isOptionEqualToValue={(option, value) => option?._id === value?.product
                      || value?.product === null
                      || value?.product === ''}
                    renderInput={(params) => (
                      <TextField {...params} required label="Producto" margin="none" />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option._id}>
                        {option.stockId}
                      </li>
                    )}
                  />
                </TableCell>
                <TableCell sx={{ borderBottom: 'none' }}>
                  <FormControl fullWidth>
                    <InputLabel size="small" id="color-select">Color</InputLabel>
                    <Select
                      size="small"
                      label="Color"
                      labelId="color-select"
                      value={watch(`products.${index}.color`) || ''}
                      onChange={async (event) => {
                        const selectedVariation = currentOptions[`variations-${index}`].find(
                          (variation) => variation.color === event.target.value
                        );
                        setValue(`products.${index}.color`, event.target.value);
                        setValue(`products.${index}.idStock`, selectedVariation.id);
                        try {
                          const res = await stockRequest.getStockProducts({ entity: '/stock', ids: [selectedVariation.id] });
                          const stockMap = res?.result?.[selectedVariation.id] || [];
                          handlerUpdateOptions(`stockSizes-${index}`, stockMap);
                          if (limitByStock) {
                            const availableSizes = stockMap
                              .filter((s) => Number(s.stock) > 0)
                              .map((s) => String(s.number));
                            handlerUpdateOptions(`sizes-${index}`, availableSizes);
                            setValue(`products.${index}.sizes`, []);
                          } else {
                            // keep existing sizes list from product; just refresh labels
                          }
                        } catch (_) {
                          // ignore stock label if fetch fails
                        }
                      }}
                      required
                      margin="none"
                      sx={{ width: '170px' }}>
                      {(currentOptions[`variations-${index}`] || []).map((variation) => {
                        if (limitByStock && !(Number(variation.stock) > 0)) return null;
                        const vStock = typeof variation.stock === 'number' ? ` (${variation.stock})` : '';
                        return (
                          <MenuItem key={variation.id} value={variation.color}>
                            {variation.name ? `${variation.name} - ${variation.color}${vStock}` : `${variation.color}${vStock}`}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
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
              {(!limitByStock || (currentOptions[`sizes-${index}`] || []).length > 0) && (
                <>
                  <TableRow>
                    <TableCell size="small">
                      <FormControl fullWidth>
                        <InputLabel size="small" id="size-select">Numeración</InputLabel>
                        <Select
                          size="small"
                          label="Numeración"
                          labelId="size-select"
                          value={watch(`products.${index}.sizes`)?.map((item) => item.size) || []}
                          onChange={(event) => {
                            const selectedSizes = event.target.value;
                            const currentSizes = watch(`products.${index}.sizes`) || [];
                            const newSizes = selectedSizes.map((size) => {
                              const existingSize = currentSizes.find((item) => item.size === size);
                              return existingSize || { size, quantity: 0 };
                            });

                            newSizes.sort((a, b) => String(a.size).localeCompare(String(b.size)));

                            setValue(`products.${index}.sizes`, newSizes);
                          }}
                          required
                          sx={{ width: '170px' }}
                          multiple>
                          {(currentOptions[`sizes-${index}`] || []).map((size) => (
                            <MenuItem key={size} value={size}>
                              {size}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell colSpan={4}>
                      <Box display="flex" gap={2}>
                        {watch(`products.${index}.sizes`)?.map((item, sizeIndex) => {
                          const stockSizes = currentOptions[`stockSizes-${index}`] || [];
                          const row = stockSizes.find((s) => String(s.number) === String(item.size));
                          const available = row ? Number(row.stock) : 0;
                          const label = `${item.size} (${available})`;
                          return (
                            <Box key={item.size}>
                              <TextField
                                size="small"
                                sx={{ width: '70px' }}
                                value={item.quantity || ''}
                                onChange={(event) => {
                                  const { value } = event.target;
                                  const currentSizes = watch(`products.${index}.sizes`) || [];
                                  const newSizes = [...currentSizes];
                                  let next = 0;
                                  if (/^\d+$/.test(value) && parseInt(value, 10) > 0) {
                                    next = parseInt(value, 10);
                                  }
                                  if (limitByStock && next > available) {
                                    next = available;
                                  }
                                  newSizes[sizeIndex].quantity = next;
                                  setValue(`products.${index}.sizes`, newSizes);
                                }}
                                label={label}
                                required
                                InputLabelProps={{ shrink: true, required: false }}
                                helperText={`Disp: ${available}`}
                              />
                            </Box>
                          );
                        })}
                      </Box>
                    </TableCell>
                  </TableRow>
                </>
              )}
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

export default ModifiableProductTableTrips;
