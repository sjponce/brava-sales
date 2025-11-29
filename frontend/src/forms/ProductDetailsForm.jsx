import {
  Autocomplete,
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography,
} from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';

const ProductDetailsForm = ({ watch }) => {
  const [expandedImage, setExpandedImage] = useState('');

  const apiTags = useSelector((store) => store.crud?.listAll?.result?.items?.result) || [];

  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setExpandedImage('');
  };

  return (
    <Box>
      <Box sx={{ overflowY: 'auto', height: '65vh', padding: 1 }}>
        <Box
          display="flex"
          gap={3}
          sx={{ flexDirection: { sm: 'row', xs: 'column' } }}
          alignItems={{ sm: 'inherit', xs: 'center' }}>
          <Box
            bgcolor="background.paper"
            p={2}
            display="flex"
            flexDirection="column"
            borderRadius={2.5}
            maxWidth="232px">
            <Box onClick={() => handleImageClick(watch('imageUrl'))}>
              <img
                src={watch('imageUrl') ? watch('imageUrl') : '/noImage.png'}
                alt=""
                style={{
                  borderRadius: '10px',
                  objectFit: 'cover',
                  width: '200px',
                  cursor: 'zoom-in',
                }}
              />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="space-between" mt={2}>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }} align="center">
                {watch('stockId')}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} align="center">
                {' '}
                {watch('color')}
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption">
                {watch('promotionalName')}
              </Typography>
              <Typography variant="caption">
                Precio: $
                {watch('price')}
              </Typography>
              <Typography variant="caption">
                Stock:
                {watch('stock')}
              </Typography>
              <Typography variant="caption">
                Descripción:
                {watch('description')}
              </Typography>
              <Typography variant="caption">
                Estado:
                {' '}
                {watch('enabled') ? 'Publicado' : 'No Publicado'}
              </Typography>
            </Box>
          </Box>
          {watch('productVariation')?.length > 0 && watch('stock') > 0 ? (
            <Box
              sx={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
              width="100%"
              alignItems="center">
              <Table
                sx={{ backgroundColor: 'background.paper', borderRadius: 2.5 }}
                aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Talle</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {watch('productVariation').map(
                    (detail) => detail.stock > 0 && (
                    <TableRow
                      key={detail?.size}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                        {detail?.size}
                      </TableCell>
                      <TableCell align="right">{detail?.stock}</TableCell>
                    </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" mb={2} width="100%">
              <Typography variant="body1">Sin Stock registrado</Typography>
            </Box>
          )}
        </Box>
        <Divider sx={{ mt: 2 }} />
        <Autocomplete
          multiple
          fullWidth
          id="tags-standard"
          options={apiTags}
          groupBy={(option) => option?.category}
          getOptionLabel={(option) => option?.name || ''}
          value={watch('tags') || []}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          readOnly
          renderInput={(params) => (
            <TextField {...params} variant="outlined" label="Tags" margin="normal" disabled />
          )}
          renderTags={(value, getTagProps) => value.map((option, index) => {
            const { key, ...otherProps } = getTagProps({ index });
            return <Chip key={key} label={`${option.name}`} {...otherProps} />;
          })}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;
            return (
              <Box component="li" key={key} {...otherProps}>
                <Typography variant="subtitle1">{option.name}</Typography>
              </Box>
            );
          }}
        />
      </Box>
      {expandedImage && (
      <Dialog open={!!expandedImage} onClose={handleCloseImage}>
        <DialogContent>
          <img
            src={expandedImage}
            alt="Imagen del producto"
            style={{ maxWidth: '100%', maxHeight: '100vh', borderRadius: 6 }}
          />
        </DialogContent>
      </Dialog>
      )}
    </Box>
  );
};

export default ProductDetailsForm;
