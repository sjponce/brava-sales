import {
  Box,
  Button,
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
  styled,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '@/utils/formatDate';
import translatePaymentMethod from '@/utils/translatePaymentMethod';
import InstallmentPaymentForm from '@/forms/InstallmentPaymentForm';
import CustomDialog from '@/components/customDialog/CustomDialog.component';
import sales from '@/redux/sales/actions';
import { selectCurrentItem } from '@/redux/sales/selectors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ModalInstallmentDetails = ({ installmentId = '', open, handlerOpen }) => {
  const dispatch = useDispatch();

  const createPayment = (data) => {
    const body = {
      paymentData: { ...data },
      installmentId,
    };
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
  const updatedPaymentResult = useSelector((state) => state.sales.createPayment.result);
  const handleDialogCancel = () => {
    setDialogOpen(false);
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

  const installment = useSelector(selectCurrentItem)?.result.installments.find(
    (i) => i._id === installmentId
  );
  const payedAmount = installment?.payments?.reduce(
    (sum, currentPayment) => sum + currentPayment.amount,
    0
  );
  const paymentDifference = (installment?.amount ?? 0) - payedAmount;
  const { isLoading } = useSelector((state) => state.sales.createPayment);
  useEffect(() => {
    if (updatedPaymentResult) {
      reset();
    }
  }, [updatedPaymentResult]);

  return (
    <StyledModal open={open}>
      <Box
        width={{ xs: '100%', sm: 800 }}
        height="auto"
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" mb={2} display="flex" justifyContent="space-between">
          <Typography variant="h4" color="primary">
            Registrar pago
          </Typography>
          <IconButton data-test-id="CloseIcon" onClick={() => handleClose()}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box display="flex" mt={2} mb={2} justifyContent="space-between">
          <Box component="form" id="step-1" onSubmit={preSubmit}>
            <InstallmentPaymentForm
              control={control}
              watch={watch}
              setValue={setValue}
              register={register}
            />
            <Box display="flex" justifyContent="flex-end" fullWidth>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isLoading || !isValid || !watch('photo') || !watch('paymentMethod')}
                size="medium">
                <Typography variant="button">Añadir pago</Typography>
              </Button>
            </Box>
            <CustomDialog
              title={`Añadir pago a cuota ${installment?.installmentNumber}?`}
              text="Esta acción no se puede deshacer, ¿Desea continuar?"
              isOpen={dialogOpen}
              onAccept={handleSubmit(onSubmit)}
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
                      <Typography variant="subtitle2">${installment?.amount}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Pagado:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">${payedAmount}</Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography variant="overline">Por pagar:</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle2">
                        {paymentDifference >= 0 ? Math.abs(paymentDifference) : 0}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box maxHeight={400}>
          <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'auto' }}>
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
                </TableRow>
              </TableHead>

              <TableBody>
                {installment?.payments?.map((p) => (
                  <React.Fragment key={p._id}>
                    <TableRow>
                      <TableCell>
                        <Typography align="center" variant="subtitle2">
                          {p.amount}
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
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </StyledModal>
  );
};

export default ModalInstallmentDetails;