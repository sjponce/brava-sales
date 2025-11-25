const getSalesProducts = require('./getSalesProducts');
const getLatestPrices = require('./getLatestPrices');
const syncProductsSync = require('./syncProductsSync');
const mongoose = require('mongoose');

const listAll = async (req, res, axiosInstance) => {
  try {
    const apiUrl = `${process.env.STOCK_API}/product/byNameMapWithStock`;
    
    // Paralelizar: obtener stock y productos de ventas en paralelo
    const [stockCall, salesData] = await Promise.all([
      axiosInstance.get(apiUrl),
      getSalesProducts(),
    ]);
    
    const stockData = stockCall.data;
    const syncStats = await syncProductsSync(stockData, salesData);

    if (!stockData || Object.keys(stockData).length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en stock',
      });
    }

    // Agregar productos nuevos al array local sin consulta completa
    let updatedSalesData = salesData;
    if (syncStats.created.length > 0) {
      const Product = mongoose.model('Product');
      const newProducts = await Product.find({ stockId: { $in: syncStats.created } }).exec();
      updatedSalesData = [...salesData, ...newProducts];
    }
    
    if (updatedSalesData.length === 0) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en ventas',
      });
    }

    const stockMap = new Map(Object.entries(stockData));

    const pricesMap = await getLatestPrices(updatedSalesData.map(p => p._id));
    
    const combinedProducts = updatedSalesData
      .filter(product => stockMap.has(product.stockId))
      .map((product) => {
        const stockInfo = stockMap.get(product.stockId);
        const latestPrice = pricesMap.get(product._id.toString()) || 0;

        return {
          ...product.toObject(),
          price: latestPrice,
          variations: stockInfo.map((stockItem) => ({
            id: stockItem.id,
            color: stockItem.color,
            imageUrl: stockItem.imageUrl,
            stock: stockItem.stock,
          })),
        };
      });

    const products = combinedProducts;

    // Construir mensaje con información de sincronización
    const parts = [];
    if (syncStats.created.length > 0) {
      parts.push(`${syncStats.created.length} nuevo${syncStats.created.length > 1 ? 's' : ''}`);
    }
    if (syncStats.reactivated.length > 0) {
      parts.push(`${syncStats.reactivated.length} reactivado${syncStats.reactivated.length > 1 ? 's' : ''}`);
    }
    if (syncStats.deactivated.length > 0) {
      parts.push(`${syncStats.deactivated.length} ya no disponible${syncStats.deactivated.length > 1 ? 's' : ''}`);
    }

    const message = parts.length > 0 
      ? `Se encontraron los productos (${parts.join(', ')})`
      : 'Se encontraron los productos';

    return res.status(200).json({
      success: true,
      result: products,
      message,
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

