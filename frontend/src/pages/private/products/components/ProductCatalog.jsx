import { useContext, useEffect, useState } from 'react';
import {
  Typography,
  IconButton,
  Tooltip,
  Box,
  Dialog,
  DialogContent,
  Chip,
  Stack,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { EditRounded } from '@mui/icons-material';
import getColors from '@/utils/getColors';
import TwoColorCircle from '@/components/TwoColorCircle';
import { StyledCard, ImageContainer, StyledCardMedia, EditButton } from './custom/StyledComponents';
import { ProductsContext } from '@/context/productsContext/ProducsContext';

const ProductCatalog = ({ handleModal }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [expandedImage, setExpandedImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const { imageProducts, handleImageByColor, allProducts } = useContext(ProductsContext);

  const handleCloseImage = () => {
    setExpandedImage('');
  };

  // Filtrar productos por stockId
  useEffect(() => {
    if (!allProducts.length) return;

    if (!searchTerm.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = allProducts.filter(
      (product) => product.stockId.toLowerCase().includes(searchLower)
    );
    setFilteredProducts(filtered);
  }, [searchTerm, allProducts]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Stack spacing={2}>
        <Box>
          <TextField
            size="small"
            fullWidth
            placeholder="Buscar por código"
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={handleClearSearch}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>

        {/* Productos filtrados en Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(2, 1fr)',
            },
            overflowY: 'auto',
            gap: 2,
            pt: 1,
          }}
        >
          {filteredProducts.map((product) => (
            <StyledCard
              key={product._id}
              sx={{
                opacity: product.enabled ? 1 : 0.6,
              }}
            >
              <ImageContainer>
                <StyledCardMedia
                  image={imageProducts[product.stockId]?.imageUrl}
                  title={product.promotionalName}
                  onClick={
                    () => handleModal(
                      product._id,
                      false,
                      imageProducts[product.stockId]?.id
                    )
                  }
                />
                {isProductNew(product.createdAt) && (
                  <Chip
                    label="Nuevo"
                    size="small"
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
                {!product.enabled && (
                  <Chip
                    label="No publicado"
                    size="small"
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      left: 8,
                      height: 24,
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      backgroundColor: '#9e9e9e',
                      color: 'white',
                    }}
                  />
                )}
                <EditButton
                  className="edit-button"
                  size="small"
                  onClick={() => {
                    handleModal(product._id, true, imageProducts[product.stockId]?.id);
                  }}
                >
                  <EditRounded />
                </EditButton>
              </ImageContainer>

              {/* Contenido principal */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  p: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                  <Typography variant="button" component="h2" fontWeight="bold" fontSize="0.875rem">
                    {product?.stockId}
                  </Typography>
                  <Chip
                    size="small"
                    color={(() => {
                      const qty = imageProducts[product.stockId]?.quantity || 0;
                      if (qty < 30) return 'error';
                      if (qty <= 100) return 'warning';
                      return 'success';
                    })()}
                    label={`Stock: ${imageProducts[product.stockId]?.quantity || 0}`}
                    sx={{ minWidth: 80, height: 24, fontSize: '0.75rem' }}
                  />
                </Box>
                {/* Nombre promocional y Descripción */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4,
                    fontSize: '0.75rem',
                    mb: 1,
                  }}
                >
                  {product?.description}
                </Typography>
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
                  {/* Precio */}
                  <Box display="flex" alignItems="center" flexShrink={0}>
                    <Typography
                      color="secondary"
                      fontWeight="bold">
                      ${product?.price?.toLocaleString('es-AR') || '0'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </StyledCard>
          ))}
        </Box>
      </Stack>
      {expandedImage && (
        <Dialog open={!!expandedImage} onClose={handleCloseImage} maxWidth="lg">
          <DialogContent sx={{ p: 0 }}>
            <img
              src={expandedImage}
              alt="Imagen del producto"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default ProductCatalog;
