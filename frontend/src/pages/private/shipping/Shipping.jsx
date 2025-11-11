import { Box, Typography } from '@mui/material';
import ShippingDataTable from './components/ShippingDataTable';

const Shipping = () => (
  <Box display="flex" flexDirection="column" height="100%">
    <Typography variant="overline" color="primary" align="center">
      Entregas
    </Typography>
    <ShippingDataTable />
  </Box>
);

export default Shipping;
