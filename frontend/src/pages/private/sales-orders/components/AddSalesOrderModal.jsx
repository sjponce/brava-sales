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
  styled,
  useMediaQuery,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from '@mui/icons-material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { getCurrentStep } from '@/redux/sales/selectors';
import sales from '@/redux/sales/actions';
import OrderDataStep from './steps/OrderDataStep';
import PaymentDataStep from './steps/PaymentDataStep';
import crud from '@/redux/crud/actions';
import stock from '@/redux/stock/actions';
import SumaryDataStep from './steps/SummaryDataStep';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import FinalMessaje from './FinalMessaje';

const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const AddSalesOrderModal = ({ open, handlerOpen, ecommerce = false, handlerDetails = null }) => {
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery('(max-width:450px)');
  const { register, handleSubmit, setValue, watch, control, reset } = useForm();

  const user = useSelector(selectCurrentAdmin);
  const customerData = useSelector((store) => store.crud.read.result);

  const createOrderState = useSelector((store) => store.sales.create);

  const steps = [
    {
      label: ecommerce ? 'Composición del pedido' : 'Datos del pedido',
      content: (
        <OrderDataStep
          register={register}
          setValue={setValue}
          watch={watch}
          control={control}
          ecommerce={ecommerce}
        />
      ),
    },
    {
      label: ecommerce ? 'Cuotas' : 'Datos de pago',
      content: (
        <PaymentDataStep
          setValue={setValue}
          watch={watch}
          control={control}
          ecommerce={ecommerce}
        />
      ),
    },
    {
      label: 'Resumen',
      content: <SumaryDataStep watch={watch} handleSubmit={handleSubmit} ecommerce={ecommerce} />,
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
    if (!ecommerce) {
      dispatch(sales.updateOrderOptions({}));
      dispatch(sales.updatePaymentOptions({}));
    }
  };

  const handleClose = () => {
    handleReset();
    handlerOpen(false);
  };

  const handleSeeOrder = () => {
    const { _id } = createOrderState.result.salesOrder;
    handleClose();
    handlerDetails(_id);
  };

  useEffect(() => {
    if (user.customer) {
      dispatch(crud.read({ entity: 'customer', id: user.customer }));
    }
    setValue('responsible', user._id);
  }, [open]);

  useEffect(() => {
    if (customerData) {
      setValue('customer', customerData);
    }
  }, [customerData]);

  useEffect(() => {
    dispatch(crud.listAll({ entity: 'customer' }));
    dispatch(stock.listAll({ entity: 'stock' }));
    dispatch(crud.list({ entity: 'promotion', options: { items: 100 } }));
  }, []);

  return (
    <StyledModal open={open}>
      <Box
        width={{ xs: '100%', sm: 800 }}
        height={{ xs: '100%', sm: 'auto' }}
        bgcolor="background.default"
        p={3}
        borderRadius={2.5}
        display="flex"
        flexDirection="column">
        <Box alignItems="center" display="flex" mb={3} justifyContent="space-between">
          <Typography variant={isSmallScreen ? 'h5' : 'h4'} color="primary">
            {ecommerce ? 'Configurar pedido' : 'Crear orden de venta'}
          </Typography>
          <Box>
            <Tooltip title="Cerrar" arrow>
              <IconButton data-test-id="CloseIcon" onClick={handleClose}>
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
            <Box display="flex" justifyContent="space-between" flexDirection="column" width="100%">
              <Box display="flex" justifyContent="center" alignItems="center" height="68vh">
                <FinalMessaje orderState={createOrderState} ecommerce={ecommerce} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {!ecommerce ? (
                  <>
                    <Button
                      variant="text"
                      disabled={currentStep === 0 || currentStep === steps.length}
                      onClick={handleBack}>
                      Atrás
                    </Button>
                    <Button type="reset" variant="contained" onClick={handleReset}>
                      Nuevo pedido
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={handleSeeOrder}
                      disabled={createOrderState.isLoading || !createOrderState.isSuccess}>
                      Ver pedido
                    </Button>
                    <Button type="reset" variant="contained" onClick={handleClose}>
                      Volver al catálogo
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" width="100%" justifyContent="space-between">
              <Box pt={2} height="68vh" mb={2} overflow="auto">
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
            </Box>
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
