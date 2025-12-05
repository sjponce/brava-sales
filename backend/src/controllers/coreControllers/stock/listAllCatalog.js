const getLatestPrices = require('./getLatestPrices');
const mongoose = require('mongoose');

const listAllCatalog = async (req, res, axiosInstance) => {
  try {
    const apiUrl = `${process.env.STOCK_API}/product/byNameMapWithStock`;
    const Product = mongoose.model('Product');
    
    // Paralelizar: obtener stock y productos publicados en paralelo
    const [stockCall, publishedProducts] = await Promise.all([
      axiosInstance.get(apiUrl),
      Product.find({
        removed: false,
        enabled: true,
      }).lean().exec(),
    ]);
    
    const stockData = stockCall.data;

    if (!stockData || Object.keys(stockData).length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en stock',
      });
    }

    if (publishedProducts.length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en el catálogo',
      });
    }

    const stockMap = new Map(Object.entries(stockData));

    const pricesMap = await getLatestPrices(publishedProducts.map(p => p._id));
    
    const catalogProducts = publishedProducts
      .filter(product => stockMap.has(product.stockId))
      .map((product) => {
        const stockInfo = stockMap.get(product.stockId);
        const latestPrice = pricesMap.get(product._id.toString()) || 0;

        // Solo incluir si tiene precio
        if (latestPrice === 0) {
          return null;
        }

        return {
          ...product,
          price: latestPrice,
          variations: stockInfo.map((stockItem) => ({
            id: stockItem.id,
            color: stockItem.color,
            imageUrl: stockItem.imageUrl,
            stock: stockItem.stock,
          })),
        };
      })
      .filter(product => product !== null);

    return res.status(200).json({
      success: true,
      result: catalogProducts,
      message: `Se encontraron ${catalogProducts.length} producto${catalogProducts.length !== 1 ? 's' : ''} en el catálogo`,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos',
      });
    }
    console.error('Error fetching catalog products:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrió un error contactando a Stock',
      error: error.message,
    });
  }
};

module.exports = listAllCatalog;
