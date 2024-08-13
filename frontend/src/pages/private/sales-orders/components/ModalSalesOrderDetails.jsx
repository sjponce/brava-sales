import styled from '@emotion/styled';
import {
  Box,
  Divider,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import React, { useState } from 'react';
import { Close, Download, Payment, PrintOutlined } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import docs from '@/redux/docs/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import { selectCurrentItem } from '@/redux/sales/selectors';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';

const SytledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalSalesOrderDetails = ({ open, handlerOpen }) => {
  const saleData = useSelector(selectCurrentItem)?.result;
  const dispatch = useDispatch();

  const [openDetailsModal] = useState(false);

  const handleModalClose = () => {
    handlerOpen(false);
  };

  const handleDownload = (id) => {
    dispatch(docs.generate({ docName: 'installment', body: { id } }));
  };

  const handlePayment = (id) => {
    console.log('payment', id);
  };

  return (
    <SytledModal
      open={open}
      aria-labelledby="modal-modal-title"
      maxheai
      aria-describedby="modal-modal-description">
      <Box
        maxHeight="95vh"
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
            Resumen de orden de venta
          </Typography>
          <Box display="flex" alignItems="center">
            <IconButton onClick={() => window.print()}>
              <PrintOutlined />
            </IconButton>
            <IconButton data-test-id="DeleteIcon" onClick={() => handleModalClose()}>
              <Close />
            </IconButton>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box display="flex" gap={2} maxHeight={400}>
          <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'visible' }}>
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
            sx={{ borderRadius: 2.5, overflow: { xs: 'visible', md: 'auto' } }}>
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
        <Box marginTop={2}>
          <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'visible' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="button" color="primary">
                      Cuotas
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="overline">Número</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="overline">Estado</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="overline">Fecha de Vencimiento</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="overline">Fecha de Pago</Typography>
                  </TableCell>
                  <TableCell align="center" />
                </TableRow>
              </TableHead>
              <TableBody>
                {saleData?.installments?.map((i) => (
                  <React.Fragment key={i.installmentNumber}>
                    <TableRow>
                      <TableCell>
                        <Typography align="center" variant="subtitle2">
                          {i.installmentNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align="center" variant="subtitle2">
                          {translateStatus(i.status)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align="center" variant="subtitle2">
                          {formatDate(i.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography align="center" variant="subtitle2">
                          {formatDate(i.paymentDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => handleDownload(i._id)}>
                          <Download />
                        </IconButton>
                        <IconButton size="small" onClick={() => handlePayment(i._id)}>
                          <Payment />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <CustomDialog
          title="Editar producto"
          text="Esta acción no se puede deshacer, ¿Desea continuar?"
          isOpen={openDetailsModal}
        />
      </Box>
    </SytledModal>
  );
};

export default ModalSalesOrderDetails;
