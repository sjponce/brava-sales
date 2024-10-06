import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import sales from '@/redux/sales/actions';
import { getCurrentStep } from '@/redux/sales/selectors';
import ModifiableProductTable from '../ModifiableProductTable';

const OrderDataStep = ({
  watch, setValue,
}) => {
  const dispatch = useDispatch();

  const currentStep = useSelector(getCurrentStep);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(sales.setCurrentStep(currentStep + 1));
  };

  return (
    <Box sx={{ overflowY: 'auto', height: '70vh' }} component="form" id="step-1" onSubmit={onSubmit}>
      <Box mb={1} mt={2}>
        <ModifiableProductTable
          watch={watch}
          setValue={setValue}
        />
      </Box>
    </Box>
  );
};

export default OrderDataStep;
