import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TableContainer,
  Paper,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import sales from '@/redux/sales/actions';
import { getCurrentStep } from '@/redux/sales/selectors';
import AddInstallmentsForm from '@/forms/AddInstallmentsForm';
import { selectCartProducts } from '@/redux/cart/selectors';

const PaymentDataStep = ({ control, watch, setValue }) => {
  const dispatch = useDispatch();
  const currentStep = useSelector(getCurrentStep);
  const products = useSelector(selectCartProducts);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(sales.setCurrentStep(currentStep + 1));
  };

  const calculateQuantity = () => (
    products.map(
      (product) => product.sizes.reduce((acc, size) => acc + size.quantity, 0)
    ).reduce((acc, q) => acc + q, 0)
  );

  return (
    <Box
      sx={{ overflowY: 'auto', height: '70vh' }}
      component="form"
      onSubmit={onSubmit}
      id="step-2"
      gap={2}
      mt={2}
      mb={1}
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      >
      <Box width="100%">
        <AddInstallmentsForm control={control} watch={watch} setValue={setValue} />
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2.5, overflow: 'visible' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Monto base</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="primary" variant="h6">
                  $
                  {watch('totalAmount')?.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Cantidad total</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="primary" variant="h6">
                  {calculateQuantity()}
                  {' '}
                  [u]
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Descuento</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="primary" variant="h6">
                  {watch('discount') ? `${watch('discount')}%` : '-'}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Cantidad de cuotas</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="primary" variant="h6">
                  {watch('installments')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="overline">Monto final</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color="primary" variant="h6">
                  $
                  {watch('finalAmount')?.toFixed(2)}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PaymentDataStep;
