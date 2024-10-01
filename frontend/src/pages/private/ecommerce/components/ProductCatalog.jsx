import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  styled,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogContent,
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import stock from '@/redux/stock/actions';
import getColors from '@/utils/getColors';
import TwoColorCircle from '@/components/TwoColorCircle';
import cart from '@/redux/cart/actions';

const StyledCard = styled(Card)(() => ({
  height: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '56.25%',
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [imageProducts, setImageProducts] = useState([]);

  const [expandedImage, setExpandedImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setExpandedImage('');
  };

  const productState = useSelector((store) => store.stock.listAll);

  const updateTable = async () => {
    if (productState?.isLoading) return;
    dispatch(stock.listAll({ entity: 'stock' }));
  };

  const handleImageByColor = (stockId, imageUrl, color) => {
    setImageProducts((prevImages) => ({
      ...prevImages,
      [stockId]: {
        imageUrl,
        color,
      },
    }));
  };

  const handleAddToCart = (product) => {
    const dataProduct = {
      id: product._id,
      stockId: product.stockId,
      color: imageProducts[product.stockId].color,
      name: product.promotionalName,
      price: product.price,
      imageUrl: imageProducts[product.stockId].imageUrl,
      sizes: [],
    };
    dispatch(cart.addToCart(dataProduct));
  };

  useEffect(() => {
    if (!productState?.result) return;
    const newRows = productState.result?.items?.result;
    setAllProducts(newRows);
    const images = newRows.reduce((acc, item) => {
      acc[item.stockId] = {
        imageUrl: item.variations[0]?.imageUrl,
        color: item.variations[0]?.color,
      };
      return acc;
    }, {});
    setImageProducts(images);
  }, [productState]);

  useEffect(() => {
    updateTable();
  }, []);

  return (
    <>
      <Grid container spacing={4}>
        {allProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <StyledCard>
              <StyledCardMedia
                image={imageProducts[product.stockId].imageUrl}
                title={product.name}
                onClick={() => handleImageClick(imageProducts[product.stockId].imageUrl)}
                sx={{ cursor: 'pointer' }}
              />
              <StyledCardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {product.promotionalName}
                </Typography>
                <Typography marginBottom={2}>{product.description}</Typography>
                <Typography variant="h5" color="textSecondary">
                  ${product.price}
                </Typography>
              </StyledCardContent>
              <CardContent>
                <Box display="flex" justifyContent="space-between">
                  <Box>
                    {product.variations?.map((variation) => {
                      const colors = variation.color.split('/');
                      return (
                        <Tooltip title={variation.color} key={variation.id}>
                          <IconButton
                            size="medium"
                            onClick={() => handleImageByColor(
                              product.stockId,
                              variation.imageUrl,
                              variation.color
                            )}>
                            <TwoColorCircle
                              color1={getColors(colors[0])}
                              color2={getColors(colors[1])}
                            />
                          </IconButton>
                        </Tooltip>
                      );
                    })}
                  </Box>
                  <Tooltip title="Agregar a carrito">
                    <IconButton size="small" onClick={() => handleAddToCart(product)}>
                      <AddShoppingCart />
                    </IconButton>
                  </Tooltip>
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      {expandedImage && (
        <Dialog open={!!expandedImage} onClose={handleCloseImage}>
          <DialogContent>
            <img
              src={expandedImage}
              alt="Imagen del producto"
              style={{ maxWidth: '100%', maxHeight: '100vh', borderRadius: 6 }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProductCatalog;
