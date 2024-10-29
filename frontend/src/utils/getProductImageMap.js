// utils/productUtils.js
const getProductImageMap = (productsState) => {
  const imagesUrlMap = {};
  productsState?.forEach((product) => {
    product.variations.forEach((variation) => {
      imagesUrlMap[variation.id] = variation.imageUrl;
    });
  });

  return imagesUrlMap;
};

export default getProductImageMap;
