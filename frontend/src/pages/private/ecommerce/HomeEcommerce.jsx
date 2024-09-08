import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  styled,
  Box,
} from '@mui/material';

const StyledCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%', // 16:9 aspect ratio
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const featuredProducts = [
  {
    id: 1,
    name: 'Product 1',
    description: 'Description for Product 1',
    image: 'https://source.unsplash.com/random/800x600?product',
  },
  {
    id: 2,
    name: 'Product 2',
    description: 'Description for Product 2',
    image: 'https://source.unsplash.com/random/800x600?electronics',
  },
  {
    id: 3,
    name: 'Product 3',
    description: 'Description for Product 3',
    image: 'https://source.unsplash.com/random/800x600?fashion',
  },
];

const HomeEcommerce = () => (
  <Container maxWidth="lg" sx={{ mb: 4 }}>
    <Box mb={5}>
      <img
        src="https://florsheimcl.vteximg.com.br/arquivos/FL_BANNER_BOTINES.jpg"
        alt="Ecommerce"
        style={{
          borderEndStartRadius: '10px',
          borderEndEndRadius: '10px',
          objectFit: 'cover',
          width: '100%',
        }}
      />
    </Box>
    <Grid container spacing={4}>
      {featuredProducts.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <StyledCard>
            <StyledCardMedia image={product.image} title={product.name} />
            <StyledCardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {product.name}
              </Typography>
              <Typography>{product.description}</Typography>
            </StyledCardContent>
            <CardContent>
              <Button variant="contained" color="primary" fullWidth>
                View Details
              </Button>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default HomeEcommerce;
