const getSalesProducts = require('./getSalesProducts');
const getLatestPrice = require('./getLatestPrice');

const listAll = async (req, res, axiosInstance) => {
  try {
    axiosInstance;
    const apiUrl = `${process.env.STOCK_API}/product/byNameMapWithStock`;
    const stockCall = await axiosInstance.get(apiUrl);
    const stockData = stockCall.data;
    const salesData = await getSalesProducts();

    if (!stockData) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en stock',
      });
    }

    if (salesData.length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en ventas',
      });
    }

    const combinedProducts = await Promise.all(
      salesData.map(async (product) => {

        const stockInfo = stockData[product.stockId] || [];
        const latestPrice = await getLatestPrice(product._id);

        const combinedStockInfo = {
          ...product.toObject(),
          price: latestPrice,
          variations: stockInfo.map((stockItem) => ({
            id: stockItem.id,
            color: stockItem.color,
            imageUrl: stockItem.imageUrl,
            stock: stockItem.stock,
          })),
        };

        return combinedStockInfo;
      })
    );

    const products = combinedProducts.flat();

    return res.status(200).json({
      success: true,
      result: products,
      message: 'Se encontraron los productos',
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos',
      });
    }
    console.error('Error fetching products from stock API:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error contactando a Stock',
      error: error.message,
    });
  }
};

module.exports = listAll;

