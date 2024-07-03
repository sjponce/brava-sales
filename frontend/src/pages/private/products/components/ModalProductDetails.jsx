import styled from '@emotion/styled';
import {
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Autocomplete,
  TextField,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { Close, PrintOutlined } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/stock/selectors';
import stock from '@/redux/stock/actions';
import tags from '@/utils/tags';

const SytledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const tagsList = Object.entries(tags).flatMap(([category, tagItem]) => (
  tagItem.map((tag) => ({ category, tag }))));

// eslint-disable-next-line react/prop-types
const ModalProductDetails = ({ open, handlerOpen, productId }) => {
  const dispatch = useDispatch();
  const [expandedImage, setExpandedImage] = useState('');

  const productData = useSelector(selectCurrentItem);
  const readProductState = useSelector((store) => store.stock.read);

  const getProduct = async () => {
    await dispatch(stock.read({ entity: 'stock', id: productId }));
  };

  useEffect(() => {
    if (productId) {
      getProduct();
    }
  }, [productId]);

  const handleCloseImage = () => {
    setExpandedImage('');
  };

  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const handleModalClose = () => {
    handlerOpen(false);
  };

  return (
    <SytledModal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        width={{ xs: '100%', sm: 800 }}
        height="auto"
        bgcolor="background.default"
        color="text.primary"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ '@media print': { color: 'black' } }}>
        <Box alignItems="center" display="flex" marginBottom={2} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Resumen de producto
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => window.print()}>
              <PrintOutlined />
            </IconButton>
            <IconButton onClick={() => handleModalClose()}>
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 1 }} />
        {readProductState?.isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              height: '70vh',
              alignItems: 'center',
            }}>
            <CircularProgress color="inherit" />
          </Box>
        ) : (
          <Box component="form" sx={{ overflowY: 'auto', height: '70vh', padding: 1 }}>
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
                <Box onClick={() => handleImageClick(productData?.result?.imageUrl)}>
                  <img
                    src={productData?.result?.imageUrl ? productData?.result?.imageUrl : '/noImage.png'}
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
                  <Typography variant="h6">
                    {productData.result?.name}
                    {' '}
                    {productData.result?.color}
                  </Typography>
                  <Typography variant="caption">
                    Precio: $
                    {productData.result?.price}
                  </Typography>
                  <Typography variant="caption">
                    Stock:
                    {productData.result?.stock}
                  </Typography>
                  <Typography variant="caption">
                    Descripción:
                    {productData.result?.description}
                  </Typography>
                </Box>
              </Box>
              {productData.result?.productVariation?.length > 0 ? (
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
                      {productData.result?.productVariation.map(
                        (detail) => detail.stock > 0 && (
                        <TableRow
                          key={detail?.number}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            {detail?.number}
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
              options={tagsList}
              groupBy={(option) => option.category}
              getOptionLabel={(option) => option.tag}
              defaultValue={[tagsList[0], tagsList[7]]}
              readOnly
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  margin="normal"
                />
              )}
              renderTags={(value, getTagProps) => value.map((option, index) => {
                const { key, ...otherProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={`${option.tag}`}
                    {...otherProps}
                  />
                );
              })}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Typography variant="subtitle1">
                    {option.tag}
                  </Typography>
                </Box>
              )}
              />
          </Box>
        )}
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
    </SytledModal>
  );
};

export default ModalProductDetails;
