import { Box, Button, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import DataTableSellers from './components/DataTableSellers';

// eslint-disable-next-line arrow-body-style
const Sellers = () => {
  // const { ModalMaterial, handlerOpen } = AddMaterial()
  // const [update, setUpdate] = useState(false);
  // const updateSellers = () => {
  //   setUpdate(!update);
  // };
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        borderRadius={2}
        marginBottom="20px"
      >
        <Typography variant="h4">Vendedores</Typography>
        <Button variant="text" size="large" color="primary" startIcon={<AddCircle />}>
          <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'flex' } }}>
            Nuevo vendedor
          </Typography>
        </Button>
      </Box>
      {/* <ModalMaterial updateSellers={updateSellers} /> */}
      <DataTableSellers />
    </Box>
  );
};

export default Sellers;
