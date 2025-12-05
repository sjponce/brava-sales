const { default: mongoose } = require('mongoose');
const moongose = require('mongoose');
const read = async (req, res, axiosInstance) => {
  try {
    const { id } = req.params || {};
    const salesProducts = await getSalesProduct(id);
    if (!salesProducts) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontró el producto',
      });
    }
    const stockData = await getStockDataByName(salesProducts.stockId, axiosInstance);
    const latestPrice = await getLatestPrice(id);

    const stockInfo = stockData.map((stockItem) => ({
      id: stockItem.id,
      color: stockItem.color,
      imageUrl: stockItem.imageUrl,
      stock: stockItem.stock,
      productVariation: stockItem.productVariation?.map((variation) => ({
        id: variation.id,
        size: variation.number,
        stock: variation.stock,
      })) || [],
    }));

    const product = {
      ...salesProducts.toObject(),
      stockInfo,
      price: latestPrice,
    };

    return res.status(200).json({
      success: true,
      result: product,
      message: 'Producto encontrado',
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontró el producto',
      });
    }

    console.error('Error fetching product from stock API:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrió un error contactando a Stock',
      error: error.message,
    });
  }
};

module.exports = read;

const getStockDataByName = async (idStock, axiosInstance) => {
  try {
    const encodedIdStock = encodeURIComponent(idStock);
    const apiUrl = `${process.env.STOCK_API}/product/name/${encodedIdStock}`;
    const response = await axiosInstance.get(apiUrl);

    return response.data;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    throw new Error('Could not fetch stock data');
  }
};

const getSalesProduct = async (productId) => {
  const Product = moongose.model('Product');
  try {
    return await Product.findOne({ _id: productId }).populate('tags').exec();
  } catch (error) {
    console.error('Error fetching sales products:', error);
    throw new Error('Could not fetch sales products');
  }
};

const getLatestPrice = async (productId) => {
  const PriceHistory = mongoose.model('PriceHistory');
  try {
    const latestPrice = await PriceHistory.findOne({ product: productId })
      .sort({ effectiveDate: -1 })
      .exec();
    return latestPrice ? latestPrice.price : 0;
  } catch (error) {
    console.error(`Error fetching price for product ${productId}:`, error);
    return 0;
  }
};
