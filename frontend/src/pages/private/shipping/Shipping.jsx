import { Box, Typography } from '@mui/material';
import ShippingDataTable from './components/ShippingDataTable';

const Shipping = () => (
  <Box display="flex" flexDirection="column" height="100%">
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      borderRadius={2}
      marginBottom="20px">
      <Typography variant="h4">Entregas</Typography>
    </Box>
    <ShippingDataTable />
  </Box>
);

export default Shipping;
