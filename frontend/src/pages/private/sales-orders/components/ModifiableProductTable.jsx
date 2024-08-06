import React, { useState } from 'react';
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
import { useSelector } from 'react-redux';
import { useFieldArray } from 'react-hook-form';

const ModifiableProductTable = ({
  setValue, watch, control, register,
}) => {
  const products = useSelector((store) => store.stock.listAll);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'products',
  });

  const handleAddRow = () => {
    append({ product: '', quantity: 1, price: 0 });
  };

  const handleDeleteRow = (index) => {
    remove(index);
  };

  const [rowSizesList, setRowSizesList] = useState({});

  const totalAmount = fields.reduce((sum, field, index) => {
    const price = watch(`products.${index}.price`) || 0;
    const quantity = watch(`products.${index}.quantity`) || 0;
    return sum + price * quantity;
  }, 0);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Producto</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Talle</TableCell>
            <TableCell>Precio unitario</TableCell>
            <TableCell>Precio agrupado</TableCell>
            <TableCell> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fields.map((field, index) => (
            <TableRow key={field.id}>
              <TableCell>
                <Autocomplete
                  fullWidth
                  size="small"
                  id={`products.${index}.product`}
                  style={{ width: '160px' }}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setValue(`products.${index}.product`, newValue._id);
                      setValue(`products.${index}.price`, newValue.price);
                      setRowSizesList((prev) => ({ ...prev, [index]: newValue.sizes || [] }));
                    }
                  }}
                  options={products.result.items.result}
                  getOptionLabel={(option) => option?.stockId || ''}
                  filterSelectedOptions
                  isOptionEqualToValue={(option, value) => option._id === value._id}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      required
                      variant="outlined"
                      label="Producto"
                      margin="normal"
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                <TextField
                  {...register(`products.${index}.quantity`, {
                    required: true,
                    min: 1,
                    valueAsNumber: true,
                  })}
                  style={{ width: '80px' }}
                  size="small"
                  type="number"
                  inputProps={{ min: 1 }}
                  margin="normal"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Select
                  size="small"
                  value={watch(`products.${index}.sizes`) || []}
                  onChange={(event) => setValue(`products.${index}.sizes`, [event.target.value])}
                  required
                  style={{ width: '80px', marginTop: '8px' }}>
                  {(rowSizesList[index] || []).map((size) => (
                    <MenuItem key={size} value={size}>
                      {size}
                    </MenuItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell>{watch(`products.${index}.price`) || 0}</TableCell>
              <TableCell>
                {(watch(`products.${index}.price`) || 0)
                  * (watch(`products.${index}.quantity`) || 0)}
              </TableCell>
              <TableCell>
                <IconButton data-test-id="DeleteIcon" onClick={() => handleDeleteRow(index)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ padding: 2 }}>
        <Typography variant="h6">
          Total: $
          {totalAmount.toFixed(2)}
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
