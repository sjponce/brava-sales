import { Box, Typography } from '@mui/material';
import DataTableProducts from './components/DataTableProducts';

const Products = () => (
  <Box display="flex" flexDirection="column" height="100%" sx={{ flex: 1 }}>
    <Typography variant="overline" color="primary" align="center">
      Productos
    </Typography>
    <Box sx={{ flex: 1, minHeight: 0 }}>
      <DataTableProducts />
    </Box>
  </Box>
);

export default Products;
