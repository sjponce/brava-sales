import {
  Box,
  Button,
  IconButton,
  Modal,
  Step,
  StepLabel,
  Stepper,
  Typography,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleOutlineOutlined, Close, ErrorOutlineOutlined } from '@mui/icons-material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCurrentStep } from '@/redux/sales/selectors';
import sales from '@/redux/sales/actions';
import OrderDataStep from './steps/OrderDataStep';
import PaymentDataStep from './steps/PaymentDataStep';
import crud from '@/redux/crud/actions';
import stock from '@/redux/stock/actions';
import SumaryDataStep from './steps/SummaryDataStep';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddSalesOrderModal = ({ open, handlerOpen }) => {
  const dispatch = useDispatch();
  const {
    register, handleSubmit, setValue, watch, control, reset,
  } = useForm();

  const createOrderState = useSelector((store) => store.sales.create);

  const steps = [
    {
      label: 'Datos del pedido',
      content: (
        <OrderDataStep
          register={register}
          setValue={setValue}
          watch={watch}
          control={control}
        />
      ),
    },
    {
      label: 'Configurar pagos',
      content: (
        <PaymentDataStep
          setValue={setValue}
          watch={watch}
          control={control}
        />
      ),
    },
    {
      label: 'Resumen',
      content: <SumaryDataStep watch={watch} handleSubmit={handleSubmit} />,
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
    dispatch(sales.updateOrderOptions({}));
    dispatch(sales.updatePaymentOptions({}));
  };

  const handleClose = () => {
    handleReset();
    handlerOpen(false);
  };

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(stock.listAll({ entity: 'stock' }));
    dispatch(crud.list({ entity: 'promotion', options: { items: 100 } }));
  }, []);

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
        <Box alignItems="center" display="flex" mb={3} justifyContent="space-between">
          <Typography variant="h4" color="primary">Crear orden de venta</Typography>
          <IconButton data-test-id="CloseIcon" onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Stepper activeStep={currentStep}>
          {steps.map((step) => (
            <Step key={step.label}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {currentStep === steps.length ? (
            <>
              <Box display="flex" height="55vh" justifyContent="center" alignItems="center">
                <Typography color="primary" variant="h5">
                  { createOrderState.isSuccess ? <CheckCircleOutlineOutlined color="primary" sx={{ fontSize: 200 }} /> : <ErrorOutlineOutlined color="primary" sx={{ fontSize: 200 }} /> }
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                  disabled={currentStep === 0 || currentStep === steps.length}
                  variant="text"
                  onClick={handleBack}>
                  Atrás
                </Button>
                <Button type="reset" variant="contained" onClick={handleReset}>
                  Nuevo pedido
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Box paddingX={1} paddingY={3} height="auto">
                {steps[currentStep]?.content}
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Button disabled={currentStep === 0} variant="text" onClick={handleBack}>
                  Atrás
                </Button>
                <Button variant="text" type="submit" form={`step-${currentStep + 1}`}>
                  {currentStep === steps.length - 1 ? 'Confirmar' : 'Siguiente'}
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </StyledModal>
  );
};

AddSalesOrderModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handlerOpen: PropTypes.func.isRequired,
};

export default AddSalesOrderModal;
