import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Modal,
  Step,
  StepLabel,
  Stepper,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  Close,
  ProductionQuantityLimits,
} from '@mui/icons-material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import styled from '@emotion/styled';
import { getCurrentStep } from '@/redux/sales/selectors';
import sales from '@/redux/sales/actions';
import crud from '@/redux/crud/actions';
import OrderDataStep from './components/steps/OrderDataStep';
import PaymentDataStep from './components/steps/PaymentDataStep';
import SummaryDataStep from './components/steps/SummaryDataStep';
import cart from '@/redux/cart/actions';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const SalesOrder = ({ open, handlerOpen }) => {
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery('(max-width:450px)');
  const { register, handleSubmit, setValue, watch, control, reset } = useForm();

  const createOrderState = useSelector((store) => store.sales.create);
  const user = useSelector(selectCurrentAdmin);
  const customerData = useSelector((store) => store.crud.read.result);

  const steps = [
    {
      label: 'Composición del pedido',
      content: (
        <OrderDataStep register={register} setValue={setValue} watch={watch} control={control} />
      ),
    },
    {
      label: 'Cuotas',
      content: <PaymentDataStep setValue={setValue} watch={watch} control={control} />,
    },
    {
      label: 'Resumen',
      content: <SummaryDataStep watch={watch} handleSubmit={handleSubmit} setValue={setValue} />,
    },
  ];

  const currentStep = useSelector(getCurrentStep);

  const handleBack = () => {
    dispatch(sales.setCurrentStep(currentStep - 1));
  };

  const handleReset = () => {
    reset();
    dispatch(sales.setCurrentStep(0));
    dispatch(sales.resetState());
  };

  const handlerClose = () => {
    handleReset();
    handlerOpen(false);
  };

  const handleResetCart = () => {
    dispatch(cart.resetState());
    dispatch(sales.resetState());
    handlerOpen(false);
  };

  useEffect(() => {
    if (user.customer) dispatch(crud.read({ entity: 'customer', id: user.customer }));
    setValue('responsible', user._id);
  }, [open]);

  useEffect(() => {
    if (customerData) {
      setValue('customer', customerData);
    }
  }, [customerData]);

  return (
    <StyledModal open={open}>
      <Box
        width="100%"
        height="100%"
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" display="flex" mb={3} justifyContent="space-between">
          <Typography variant={isSmallScreen ? 'h5' : 'h4'} color="primary">
            Configurar pedido
          </Typography>
          <Box>
            <Tooltip title="Vaciar carrito" arrow>
              <IconButton data-test-id="CloseIcon" onClick={handleResetCart}>
                <ProductionQuantityLimits />
              </IconButton>
            </Tooltip>
            <Tooltip title="Cerrar" arrow>
              <IconButton data-test-id="CloseIcon" onClick={handlerClose}>
                <Close />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        <Stepper activeStep={currentStep}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>
                <Typography sx={{ display: { xs: 'none', sm: 'flex' } }}>{step.label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box display="flex" height="100%">
          {currentStep === steps.length ? (
            <Box display="flex" justifyContent="space-between" flexDirection="column">
              <Box display="flex" height="70vh" justifyContent="center" alignItems="center">
                {createOrderState.isLoading && (
                  <CircularProgress color="primary" sx={{ fontSize: 200 }} />
                )}
                {!createOrderState.isLoading && createOrderState.isSuccess && (
                  <Typography color="primary.light" variant="h5" align="center">
                    Por favor, dirígete a la sección
                    {' '}
                    &quot;Mis pedidos&quot; para continuar con el pago y
                    elegir tu método de envío.
                  </Typography>
                )}
                {!createOrderState.isLoading && !createOrderState.isSuccess && (
                  <Typography color="primary" variant="h5">
                    No se pudo generar el pedido, intente nuevamente más tarde.
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={createOrderState.isLoading || !createOrderState.isSuccess}
                  >
                  Mis pedidos
                </Button>
                <Button type="reset" variant="contained" onClick={handlerClose}>
                  Volver al catálogo
                </Button>
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" width="100%" justifyContent="space-between">
              <Box paddingX={1}>{steps[currentStep]?.content}</Box>
              <Box display="flex" justifyContent="space-between">
                <Button disabled={currentStep === 0} variant="text" onClick={handleBack}>
                  Atrás
                </Button>
                <Button variant="text" type="submit" form={`step-${currentStep + 1}`}>
                  {currentStep === steps.length - 1 ? 'Confirmar' : 'Siguiente'}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </StyledModal>
  );
};
export default SalesOrder;
