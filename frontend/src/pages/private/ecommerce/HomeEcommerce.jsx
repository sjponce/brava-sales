import React from 'react';
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ProductCatalog from './components/ProductCatalog';
import Cart from './components/Cart';

const HomeEcommerce = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box mb={5}>
        <img
          src={isMobile ? 'https://i.ibb.co/f40bFVN/banner-mobile.jpg' : 'https://i.ibb.co/qjF6Kj1/banner-1.jpg'}
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
      <Cart />
    </Container>
  );
};

export default HomeEcommerce;
