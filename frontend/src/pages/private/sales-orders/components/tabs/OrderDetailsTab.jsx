import {
  Box,
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
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';

const OrderDetailsTab = ({ saleData }) => (
  <Box display="flex" gap={2} maxHeight={400}>
    <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'auto' }}>
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
    <TableContainer
      component={Paper}
      sx={{ borderRadius: 2.5, overflow: { xs: 'auto', md: 'auto' } }}>
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
            <React.Fragment key={p.product.stockId}>
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="subtitle2">{`${p.product.stockId} ${p.color}`}</Typography>
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
  </Box>
);
export default OrderDetailsTab;
