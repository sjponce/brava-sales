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
} from '@mui/material';
import { AddShoppingCart } from '@mui/icons-material';
import stock from '@/redux/stock/actions';
import getColors from '@/utils/getColors';
import TwoColorCircle from '@/components/TwoColorCircle';

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
  // const [openProductDetails, setopenProductDetails] = useState({false});
  const [selectedProduct, setSelectedProduct] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [imageProducts, setImageProducts] = useState([]);

  const productState = useSelector((store) => store.stock.listAll);
  // const readProductState = useSelector((store) => store.stock.read);

  const updateTable = async () => {
    if (productState?.isLoading) return;
    dispatch(stock.listAll({ entity: 'stock' }));
  };

  const handleDetails = async (id) => {
    setSelectedProduct({ ...selectedProduct, id });
    console.log(id);
    // await dispatch(stock.read({ entity: 'stock', id }));
    // Abrir detalles
  };

  const handleImageByColor = (stockId, imageUrl) => {
    setImageProducts((prevImages) => ({
      ...prevImages,
      [stockId]: imageUrl,
    }));
  };

  useEffect(() => {
    if (!productState?.result) return;
    const newRows = productState.result?.items?.result.map((item) => ({ ...item, id: item._id }));
    setAllProducts(newRows);
    const images = newRows.reduce((acc, item) => {
      acc[item.stockId] = item.variations[0]?.imageUrl;
      return acc;
    }, {});
    setImageProducts(images);
  }, [productState]);

  useEffect(() => {
    updateTable();
  }, []);

  return (
    <Grid container spacing={4}>
      {allProducts.map((product) => (
        <Grid item key={product.id} xs={12} sm={6} md={4}>
          <StyledCard>
            <StyledCardMedia
              image={imageProducts[product.stockId]}
              title={product.name}
              onClick={() => handleDetails(product.id)}
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
                          onClick={() => handleImageByColor(product.stockId, variation.imageUrl)}>
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
                  <IconButton size="small">
                    <AddShoppingCart />
                  </IconButton>
                </Tooltip>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default ProductCatalog;
