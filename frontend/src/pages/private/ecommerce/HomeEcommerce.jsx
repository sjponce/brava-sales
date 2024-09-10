import React from 'react';
import {
  Container,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import ProductCatalog from './components/ProductCatalog';

const HomeEcommerce = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Box mb={5}>
        <img
          src={isMobile ? 'https://i.ibb.co/LYpzdYn/Dise-o-banner-mobile.png' : 'https://i.ibb.co/KyXZhqL/Dise-o-banner-4k.png'}
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
    </Container>
  );
};

export default HomeEcommerce;
