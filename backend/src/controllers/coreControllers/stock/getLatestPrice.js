const mongoose = require('mongoose');

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

module.exports = getLatestPrice;
