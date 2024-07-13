import { Box, Typography } from '@mui/material';
import DataTableProducts from './components/DataTableProducts';

const Products = () => (
  <Box display="flex" flexDirection="column">
    <Box
      display="flex"
      justifyContent="space-between"
      width="100%"
      borderRadius={2}
      marginBottom="20px">
      <Typography variant="h4">Productos</Typography>
    </Box>
    <DataTableProducts />
  </Box>
);

export default Products;
