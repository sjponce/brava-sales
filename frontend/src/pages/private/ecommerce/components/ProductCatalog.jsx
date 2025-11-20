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
  Chip,
} from '@mui/material';
import { AddShoppingCart, RemoveShoppingCart } from '@mui/icons-material';
import stock from '@/redux/stock/actions';
import getColors from '@/utils/getColors';
import TwoColorCircle from '@/components/TwoColorCircle';
import cart from '@/redux/cart/actions';
import { selectCartProducts } from '@/redux/cart/selectors';
import getProductImageMap from '@/utils/getProductImageMap';
import Loading from '@/components/Loading';

const StyledCard = styled(Card)(() => ({
  height: '100%',
  backgroundColor: 'background.default',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.15s ease-in-out',
  '&:hover': { transform: 'scale3d(1.05, 1.05, 1)' },
}));

const StyledCardMedia = styled(CardMedia)({
  paddingTop: '0',
  width: '100%',
  height: 300,
  objectFit: 'cover',
  objectPosition: 'center',
});

const StyledCardContent = styled(CardContent)({
  flexGrow: 1,
});

const ProductCatalog = () => {
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [imageProducts, setImageProducts] = useState([]);
  const cartProducts = useSelector(selectCartProducts);

  const [expandedImage, setExpandedImage] = useState('');

  const handleImageClick = (imageUrl) => {
    setExpandedImage(imageUrl);
  };

  const handleCloseImage = () => {
    setExpandedImage('');
  };

  const productState = useSelector((store) => store.stock.listAllCatalog);

  const updateTable = async () => {
    if (productState?.isLoading) return;
    dispatch(stock.listAllCatalog({ entity: 'stock' }));
  };

  const handleImageByColor = (stockId, imageUrl, color, id, quantity) => {
    setImageProducts((prevImages) => ({
      ...prevImages,
      [stockId]: {
        imageUrl,
        color,
        id,
        quantity,
      },
    }));
  };

  const handleAddToCart = (product) => {
    const dataProduct = {
      id: product._id,
      stockId: product.stockId,
      color: imageProducts[product.stockId].color,
      imageUrl: imageProducts[product.stockId].imageUrl,
      idStock: imageProducts[product.stockId].id,
      name: product.promotionalName,
      price: product.price,
      optionSizes: product.sizes,
      sizes: [],
    };
    dispatch(cart.addToCart(dataProduct));
  };

  const handleRemoveFromCart = (product) => {
    const productToRemove = {
      id: product._id,
      color: imageProducts[product.stockId]?.color,
    };
    dispatch(cart.removeFromCart(productToRemove));
  };

  const isProductInCart = (product) => cartProducts.some(
    (cartProduct) => cartProduct.id === product._id
    && cartProduct.color === imageProducts[product.stockId]?.color
  );

  // Helper para detectar si un producto es nuevo (dentro de 21 días)
  const isProductNew = (createdAt) => {
    if (!createdAt) return false;
    try {
      const productDate = new Date(createdAt);
      const currentDate = new Date();
      const timeDiffMs = currentDate - productDate;
      return timeDiffMs < (21 * 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Error parsing createdAt date:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!productState?.result) return;
    const newRows = productState.result?.items?.result;
    setAllProducts(newRows);
    const images = newRows.reduce((acc, item) => {
      acc[item.stockId] = {
        imageUrl: item.variations[0]?.imageUrl,
        color: item.variations[0]?.color,
        id: item.variations[0]?.id,
        quantity: item.variations[0]?.stock,
      };
      return acc;
    }, {});
    setImageProducts(images);
  }, [productState]);

  useEffect(() => {
    updateTable();
  }, []);

  useEffect(() => {
    if (!productState?.result) return;
    const productImgMap = getProductImageMap(productState?.result.items.result);
    dispatch(stock.setProductImageMap(productImgMap));
  }, [productState?.isSuccess]);

  return (
    <>
      <Grid container spacing={4}>
        {allProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4}>
            <StyledCard>
              <Box sx={{ position: 'relative' }}>
                <StyledCardMedia
                  image={imageProducts[product.stockId].imageUrl}
                  title={product.name}
                  onClick={() => handleImageClick(imageProducts[product.stockId].imageUrl)}
                  sx={{ cursor: 'pointer' }}
                />
                {isProductNew(product.createdAt) && (
                  <Chip
                    label="Nuevo"
                    variant="outlined"
                    color="warning"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: 'background.paper',
                    }}
                  />
                )}
              </Box>
              <StyledCardContent>
                <Typography gutterBottom variant="h6" color="textSecondary" component="h2" sx={{ fontWeight: 'bold' }}>
                  {product.promotionalName}
                </Typography>
                <Typography marginBottom={2}>{product.description}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                  <Typography variant="caption" color="textSecondary">Precio:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'secondary.dark' }}>
                    ${product.price.toLocaleString('es-AR')}
                  </Typography>
                </Box>
              </StyledCardContent>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                  {/* Colores disponibles */}
                  <Box display="flex" gap={0.5} flexWrap="wrap" flex={1}>
                    {product.variations?.map((variation) => {
                      const colors = variation.color.split('/');
                      const isSelected = imageProducts[product.stockId]?.id === variation.id;
                      return (
                        <Tooltip
                          title={`${variation.color} (Stock: ${variation.stock})`}
                          key={variation.id}>
                          <IconButton
                            size="small"
                            onClick={() => handleImageByColor(
                              product.stockId,
                              variation.imageUrl,
                              variation.color,
                              variation.id,
                              variation.stock
                            )}
                            sx={{
                              border: isSelected ? 2 : 1,
                              borderColor: isSelected ? 'primary.main' : 'divider',
                              p: 0.3,
                              width: 32,
                              height: 32,
                            }}>
                            <TwoColorCircle
                              color1={getColors(colors[0])}
                              color2={getColors(colors[1])}
                            />
                          </IconButton>
                        </Tooltip>
                      );
                    })}
                  </Box>
                  {isProductInCart(product) ? (
                    <Tooltip title="Quitar de carrito">
                      <IconButton size="small" onClick={() => handleRemoveFromCart(product)} sx={{ color: 'error.light' }}>
                        <RemoveShoppingCart />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Agregar a carrito">
                      <IconButton size="small" onClick={() => handleAddToCart(product)} sx={{ color: 'success.light' }}>
                        <AddShoppingCart />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Loading isLoading={productState?.isLoading} />
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
