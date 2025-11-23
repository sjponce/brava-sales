import { useDispatch, useSelector } from 'react-redux';
import { createContext, useEffect, useState, useCallback } from 'react';
import stock from '@/redux/stock/actions';
import getProductImageMap from '@/utils/getProductImageMap';

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [imageProducts, setImageProducts] = useState({});

  const productState = useSelector((store) => store.stock.listAll);

  const handleImageByColor = useCallback((stockId, imageUrl, color, id, quantity) => {
    setImageProducts((prevImages) => ({
      ...prevImages,
      [stockId]: {
        imageUrl,
        color,
        id,
        quantity,
      },
    }));
  }, []);

  // Inicializar productos desde catálogo cuando carga
  useEffect(() => {
    if (!productState?.result) return;
    const newRows = productState.result?.items?.result;
    if (!newRows) return;

    setAllProducts(newRows);
    const images = newRows.reduce((acc, item) => {
      if (item?.variations && item.variations.length > 0) {
        acc[item.stockId] = {
          imageUrl: item.variations[0]?.imageUrl,
          color: item.variations[0]?.color,
          id: item.variations[0]?.id,
          quantity: item.variations[0]?.stock,
        };
      }
      return acc;
    }, {});
    setImageProducts(images);
  }, [productState?.result]);

  // Fetch inicial del catálogo
  useEffect(() => {
    if (productState?.isLoading) return;
    dispatch(stock.listAll({ entity: 'stock' }));
  }, []);

  // Actualizar product image map en Redux
  useEffect(() => {
    if (!productState?.result?.items?.result) return;
    const productImgMap = getProductImageMap(productState.result.items.result);
    dispatch(stock.setProductImageMap(productImgMap));
  }, [productState?.isSuccess, dispatch]);

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const contextValue = {
    allProducts,
    imageProducts,
    handleImageByColor,
    isLoading: productState?.isLoading,
  };

  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
};
