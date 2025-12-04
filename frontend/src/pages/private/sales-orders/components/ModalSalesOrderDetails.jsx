import styled from '@emotion/styled';
import {
  Box,
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
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import { Close, Download, Payment, PrintOutlined } from '@mui/icons-material';

import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import docs from '@/redux/docs/actions';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import { selectCurrentItem } from '@/redux/sales/selectors';
import formatDate from '@/utils/formatDate';
import translateStatus from '@/utils/translateSalesStatus';
import OrderDetailsTab from '@/pages/private/sales-orders/components/tabs/OrderDetailsTab';
import OrderProductsTab from './tabs/OrderProductsTab';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import InstallmentDetailsForm from '../../../../forms/InstallmentDetailsForm';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalSalesOrderDetails = ({ open, handlerOpen }) => {
  const saleData = useSelector(selectCurrentItem)?.result;
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentAdmin);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openDetailsModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});
  const [currentOptions, setCurrentOptions] = useState({ option: 'sumary' });

  const handlerUpdateOptions = (event, newOption) => {
    if (newOption !== null) {
      setCurrentOptions({ ...currentOptions, option: newOption });
    }
    setOpenDetailsDialog(false);
  };

  const handleModalClose = () => {
    setCurrentOptions({ option: 'sumary' });
    handlerOpen(false);
  };

  const handleDownload = (id) => {
    dispatch(docs.generate({ docName: 'installment', body: { id } }));
  };

  const handlePayment = (id) => {
    setSelectedRow(id);
    setOpenDetailsDialog(true);
  };

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const installment = searchParams?.get('installment');
      const salesOrder = searchParams?.get('salesOrder');
      if (installment && salesOrder) {
        setSelectedRow(installment);
        setCurrentOptions({ option: 'installment' });
        setOpenDetailsDialog(true);
      }
    };

    fetchData();
  }, [location]);

  return (
    <StyledModal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description">
      <Box
        bgcolor="background.default"
        width={{ xs: '100%', sm: 800 }}
        height={{ xs: '100%', sm: 'auto' }}
        color="text.primary"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        sx={{ '@media print': { color: 'black' } }}>
        <Box alignItems="center" display="flex" marginBottom={2} justifyContent="space-between">
          <Typography variant="h4" color="primary">
            {currentUser.role === 'customer' ? 'Datos del pedido' : 'Resumen de orden de venta'}
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
        <ToggleButtonGroup
          fullWidth
          color="primary"
          exclusive
          size="small"
          value={currentOptions.option}
          onChange={handlerUpdateOptions}
          aria-label="payment type">
          <ToggleButton value="sumary" aria-label="sumary">
            Resumen
          </ToggleButton>
          <ToggleButton value="installment" aria-label="installments">
            Pagos
          </ToggleButton>
          {currentUser?.role !== 'customer' && (
            <ToggleButton value="products" aria-label="products">
              Productos
            </ToggleButton>
          )}
        </ToggleButtonGroup>
        <Box display="flex" flexDirection="column" width="100%" justifyContent="space-between">
          <Box pt={2} height="75vh" mb={2} overflow="auto">
            {currentOptions?.option === 'sumary' && <OrderDetailsTab saleData={saleData} />}
            {currentUser.role !== 'customer'
            && currentOptions?.option === 'products'
            && <OrderProductsTab saleData={saleData} />}
            {currentOptions?.option === 'installment' && (
              !openDetailsDialog ? (
                <Box>
                  {/* Vista Mobile - Cards */}
                  <Box sx={{ display: { xs: 'flex', md: 'none' }, flexDirection: 'column', gap: 2 }}>
                    <Typography variant="button" color="primary" align="center" mb={1}>
                      Cuotas
                    </Typography>
                    {saleData?.installments?.map((i) => (
                      <Paper key={i.installmentNumber} sx={{ p: 2, borderRadius: 2.5 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography variant="h6" color="primary">
                            Cuota #{i.installmentNumber}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              bgcolor: i.status === 'Paid' ? 'success.dark' : 'warning.dark',
                              color: '#fff',
                              fontWeight: 500
                            }}>
                            {translateStatus(i.status)}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                          <Typography variant="body2" color="text.secondary">
                            Monto:
                          </Typography>
                          <Typography variant="h6" color="primary" fontWeight="bold">
                            ${i.amount?.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Typography>
                        </Box>
                        <Box display="flex" flexDirection="column" gap={1} mb={2}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption" color="text.secondary">
                              Vencimiento:
                            </Typography>
                            <Typography variant="body2">
                              {formatDate(i.dueDate)}
                            </Typography>
                          </Box>
                          {i.totalPaymentDate && (
                            <Box display="flex" justifyContent="space-between">
                              <Typography variant="caption" color="text.secondary">
                                Fecha de pago:
                              </Typography>
                              <Typography variant="body2">
                                {formatDate(i.totalPaymentDate)}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Box display="flex" gap={1} justifyContent="flex-end">
                          <Tooltip title="Descargar">
                            <IconButton size="small" onClick={() => handleDownload(i._id)}>
                              <Download />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Pagar">
                            <IconButton size="small" onClick={() => handlePayment(i._id)} disabled={i.status === 'Paid'}>
                              <Payment />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Paper>
                    ))}
                  </Box>

                  {/* Vista Desktop - Tabla */}
                  <TableContainer
                    component={Paper}
                    sx={{
                      display: { xs: 'none', md: 'block' },
                      borderRadius: 2.5,
                      overflow: 'auto'
                    }}>
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
                                  {formatDate(i.totalPaymentDate)}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Tooltip title="Descargar">
                                  <IconButton size="small" onClick={() => handleDownload(i._id)}>
                                    <Download />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Pagar">
                                  <IconButton size="small" onClick={() => handlePayment(i._id)}>
                                    <Payment />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ) : (
                <InstallmentDetailsForm
                  open={openDetailsDialog}
                  handlerOpen={setOpenDetailsDialog}
                  installmentId={selectedRow} />
              )
            )}
          </Box>
        </Box>
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
