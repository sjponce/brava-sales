const getStockProducts = async (req, res, axiosInstance) => {
  try {
    const ids = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'La solicitud debe contener un array de IDs',
      });
    }

    const productsMap = await Promise.all(
      ids.map(async (id) => {
        const apiUrl = `${process.env.STOCK_API}/product/${id}`;
        const stockCall = await axiosInstance.get(apiUrl);
        const stockData = stockCall.data.productVariation;
        return { id, stockData };
      })
    ).then((results) => {
      return results.reduce((acc, { id, stockData }) => {
        acc[id] = stockData;
        return acc;
      }, {});
    });
    if (!productsMap) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en stock',
      });
    }
    return res.status(200).json({
      success: true,
      result: productsMap,
      message: 'Stock de productos actualizado',
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontraron productos en stock',
      });
    }
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Internal server error',
    });
  }
};

module.exports = getStockProducts;
