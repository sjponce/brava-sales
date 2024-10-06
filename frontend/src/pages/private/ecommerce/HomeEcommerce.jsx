import React from 'react';
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';
import SalesOrder from './SalesOrder';

const HomeEcommerce = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box mb={5} width="100%">
        <img
          src={isMobile ? 'https://i.ibb.co/yP9T6Xy/banner-mobile-1.jpg' : 'https://i.ibb.co/qjF6Kj1/banner-1.jpg'}
          alt="Ecommerce"
          style={{
            borderEndStartRadius: '10px',
            borderEndEndRadius: '10px',
            objectFit: 'cover',
            width: '100%',
            height: 'auto',
          }}
        />
      </Box>
      <ProductCatalog />
      <Cart setOpen={setOpen} />
      <SalesOrder open={open} handlerOpen={setOpen} />
    </Container>
  );
};

export default HomeEcommerce;
