import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { ArrowBackIosNew, Cancel, Check, Image } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '@/utils/formatDate';
import translatePaymentMethod from '@/utils/translatePaymentMethod';
import InstallmentPaymentForm from '@/forms/InstallmentPaymentForm';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import sales from '@/redux/sales/actions';
import { selectCurrentItem } from '@/redux/sales/selectors';
import translateStatus from '@/utils/translateSalesStatus';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const InstallmentDetailsForm = ({ installmentId = '', open, handlerOpen }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentAdmin);

  const createPayment = (data) => {
    const body = {
      paymentData: { ...data },
      installmentId,
    };
    if (data.paymentMethod === 'MercadoPago') {
      dispatch(sales.createMPLink({ entity: 'sales', body }));
      return;
    }
    dispatch(sales.createPayment({ entity: 'sales', body }));
  };

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    register,
    reset,
    formState: { isValid },
  } = useForm();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const handleDialogCancel = () => {
    setStatusDialogOpen(false);
  };
  const handleClose = () => {
    handlerOpen(false);
  };

  const preSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    setDialogOpen(true);
  };

  const onSubmit = async (data) => {
    createPayment(data);
    setDialogOpen(false);
  };

  const installment = useSelector(selectCurrentItem)?.result?.installments?.find(
    (i) => i._id === installmentId
  );
  const payedAmount = installment?.payments?.reduce(
    (sum, currentPayment) => (currentPayment.status === 'Approved' ? sum + currentPayment.amount : sum),
    0
  );
  const paymentDifference = (installment?.amount ?? 0) - payedAmount;
  const { isLoading } = useSelector((state) => state.sales.createPayment);
  const mpLink = useSelector((state) => state.sales.createMPLink.result);

  const [selectedRow, setSelectedRow] = useState({
    id: '',
  });

  useEffect(() => {
    if (open) {
      reset();
    }
  }, [open, reset]);

  useEffect(() => {
    if (mpLink) {
      window.location.href = mpLink;
    }
  }, [mpLink]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(location.search);
      const installmentParam = searchParams?.get('installment');
      const salesOrderParam = searchParams?.get('salesOrder');
      const amountParam = searchParams?.get('amount');
      const { pathname } = location;
      if (installmentParam && salesOrderParam && amountParam) {
        const body = {
          paymentData: { paymentMethod: 'MercadoPago', amount: amountParam },
          mercadoPagoData: {
            collection_id: searchParams?.get('collection_id'),
            collection_status: searchParams?.get('collection_status'),
            payment_id: searchParams?.get('payment_id'),
            status: searchParams?.get('status'),
            external_reference: searchParams?.get('external_reference'),
            payment_type: searchParams?.get('payment_type'),
            merchant_order_id: searchParams?.get('merchant_order_id'),
            preference_id: searchParams?.get('preference_id'),
            site_id: searchParams?.get('site_id'),
            processing_mode: searchParams?.get('processing_mode'),
            merchant_account_id: searchParams?.get('merchant_account_id'),
          },
          installmentId,
        };
        dispatch(sales.createPayment({ entity: 'sales', body }));
        navigate(pathname, { replace: true });
      }
    };

    fetchData();
  }, [location]);

  const handleApproval = (id, status) => {
    setSelectedRow({
      ...selectedRow,
      id,
      status,
    });
    setStatusDialogOpen(true);
  };

  const handleDialogAccept = () => {
    const body = {
      paymentData: {
        paymentId: selectedRow.id,
        status: selectedRow.status
      },
      installmentId,
    };
    dispatch(sales.updatePayment({ entity: 'sales', body }));
    setStatusDialogOpen(false);
  };

  return (
    <Box height="auto" borderRadius={2.5} p={2} pt={0} display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Button startIcon={<ArrowBackIosNew />} onClick={handleClose}>
          Volver
        </Button>
        <Typography variant="overline">{`Detalle de cuota ${installment?.installmentNumber}`}</Typography>
      </Box>
      <Box display="flex" mt={2} mb={2} justifyContent="space-between" gap={2}>
        <Box component="form" id="step-1" onSubmit={preSubmit} width="100%">
          <Paper sx={{ borderRadius: 2.5, padding: 2, height: '100%' }}>
            <InstallmentPaymentForm
              control={control}
              watch={watch}
              setValue={setValue}
              register={register}
              reset={reset}
            />
            <Box display="flex" justifyContent="flex-end" fullWidth>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={
                  isLoading
                  || !isValid
                  || (watch('paymentMethod') !== 'MercadoPago' && !watch('photo'))
                  || !watch('paymentMethod')
                }
                size="medium">
                <Typography variant="button">Añadir pago</Typography>
              </Button>
            </Box>
          </Paper>
          <CustomDialog
            title={`Añadir pago a cuota ${installment?.installmentNumber}?`}
            text="Esta acción no se puede deshacer, ¿Desea continuar?"
            isOpen={dialogOpen}
            onAccept={handleSubmit(onSubmit)}
            onCancel={handleDialogCancel}
          />
          <CustomDialog
            title={`${selectedRow.status === 'Rejected' ? 'Rechazar' : 'Aprobar'} Pago`}
            text="Esta acción no se puede deshacer, ¿Desea continuar?"
            isOpen={statusDialogOpen}
            onAccept={handleDialogAccept}
            onCancel={handleDialogCancel}
          />
        </Box>
        <Box display="flex" gap={2} maxHeight={400}>
          <TableContainer
            component={Paper}
            maxHeight={400}
            sx={{ borderRadius: 2.5, overflow: 'auto' }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography variant="overline">Total:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">${installment?.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="overline">Pagado:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">${payedAmount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography variant="overline">Pendiente:</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle2">
                      ${paymentDifference >= 0 ? Math.abs(paymentDifference).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 0}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Box maxHeight={400}>
        <TableContainer
          component={Paper}
          sx={{ maxHeight: 400, borderRadius: 2.5, overflow: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="button" color="primary">
                    Pagos
                  </Typography>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="center">
                  <Typography variant="overline">Monto</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="overline">Fecha de pago</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="overline">Método de pago</Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="overline">Estado</Typography>
                </TableCell>
                <TableCell align="center">
                  {' '}
                  <Typography variant="overline">Acción</Typography>{' '}
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody maxHeight={400}>
              {installment?.payments?.map((p) => (
                <React.Fragment key={p._id}>
                  <TableRow>
                    <TableCell>
                      <Typography align="center" variant="subtitle2">
                        ${p.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center" variant="subtitle2">
                        {formatDate(p.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center" variant="subtitle2">
                        {translatePaymentMethod(p.paymentMethod)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography align="center" variant="subtitle2">
                        {translateStatus(p.status)}
                      </Typography>
                    </TableCell>
                    <TableCell p={8}>
                      <Box display="flex" justifyContent="center">
                        <Tooltip title="Ver comprovante">
                          <IconButton
                            disabled={!p.photo}
                            onClick={() => window.open(p.photo, '_blank')}>
                            <Image color={p.photo ? '' : 'disabled'} />
                          </IconButton>
                        </Tooltip>
                        {currentUser.role !== 'customer' && (
                          <>
                            <Tooltip title="Aprobar pago">
                              <IconButton
                                disabled={p.status === 'Approved'}
                                onClick={() => handleApproval(p._id, 'Approved')}
                                size="small">
                                <Check color={p.status !== 'Approved' ? '' : 'disabled'} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Rechazar pago">
                              <IconButton
                                disabled={p.status === 'Rejected'}
                                onClick={() => handleApproval(p._id, 'Rejected')}
                                size="small">
                                <Cancel />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default InstallmentDetailsForm;
