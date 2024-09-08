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
import { Close, PrintOutlined } from '@mui/icons-material';

import { useSelector } from 'react-redux';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import { selectCurrentItem } from '@/redux/sales/selectors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalSalesOrderDetails = ({ open, handlerOpen }) => {
  const saleData = useSelector(selectCurrentItem)?.result;
  const [openDetailsModal] = useState(false);

  const handleModalClose = () => {
    handlerOpen(false);
  };

  return (
    <StyledModal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        maxHeight="95vh"
        bgcolor="background.default"
        width={{ xs: '100%', sm: 800 }}
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
        <Divider sx={{ mb: 1 }} />
        <CustomDialog
          title="Editar producto"
          text="Esta acción no se puede deshacer, ¿Desea continuar?"
          isOpen={openDetailsModal}
        />
      </Box>
    </StyledModal>
  );
};

export default ModalSalesOrderDetails;
