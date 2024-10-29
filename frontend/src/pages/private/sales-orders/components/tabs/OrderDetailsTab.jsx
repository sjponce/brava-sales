import {
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import { useSelector } from 'react-redux';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { getProductImages } from '@/redux/stock/selectors';

const OrderDetailsTab = ({ saleData }) => {
  const currentUser = useSelector(selectCurrentAdmin);
  const productImageMap = useSelector(getProductImages);

  const [expandedImage, setExpandedImage] = React.useState('');

  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setExpandedImage('');
  };

  return (
    <Box display="flex" minHeight="99%" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
      <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'visible' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={3} align="center">
                <Typography variant="button" color="primary">
                  Composición de pedido
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Producto</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Talle</Typography>
              </TableCell>
              <TableCell align="center">
                <Typography variant="overline">Cantidad</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {saleData?.products?.map((p) => (
              <React.Fragment key={p.product.stockId + p.product.color}>
                <TableRow>
                  <TableCell colSpan={3}>
                    <Box
                      display="flex"
                      alignItems="center"
                      p={1}
                      gap={2}
                      borderRadius={2.5}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.1)' },
                      }}
                      onClick={() => handleImageClick(productImageMap[p.idStock])}>
                      <Avatar
                        src={productImageMap[p.idStock]}
                        sx={{ width: 48, height: 48 }}
                        />
                      <Typography variant="subtitle2">{
                        currentUser?.role !== 'customer' ? `${p.product.stockId} ${p.color}`
                          : `${p.product.promotionalName} ${p.color}`
                      }
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
                {p.sizes.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell />
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.size}`}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="subtitle2">{`${item.quantity}`}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2.5, overflow: { xs: 'visible', md: 'auto' } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="button" color="primary">
                  Detalle
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Creación</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">{formatDate(saleData?.createdAt)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Estado</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">{translateStatus(saleData?.status)}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Código</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">{saleData?.salesOrderCode}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Cliente</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">{saleData?.customer?.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Monto Base</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">${saleData?.totalAmount}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Descuento</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">%{saleData?.discount}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Cuotas</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">
                  {saleData?.installments?.length} de $
                  {saleData?.installments ? saleData?.installments[0].amount : 0}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Monto final</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2">${saleData?.finalAmount}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
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
export default OrderDetailsTab;
