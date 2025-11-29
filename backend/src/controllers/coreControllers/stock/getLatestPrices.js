const mongoose = require('mongoose');

const getLatestPrices = async (productIds) => {
  if (!productIds || productIds.length === 0) return new Map();
  
  const PriceHistory = mongoose.model('PriceHistory');
  try {
    // Convertir IDs de forma segura
    const objectIds = productIds.map(id => {
      if (typeof id === 'string') {
        return mongoose.Types.ObjectId(id);
      }
      return id;
    });

    // Usar find + sort + lean en lugar de aggregation (más rápido)
    const allPrices = await PriceHistory.find({ product: { $in: objectIds } })
      .sort({ product: 1, effectiveDate: -1 })
      .lean()
      .exec();

    // Agrupar manualmente (más rápido que aggregation en memoria)
    const pricesMap = new Map();
    const seenProducts = new Set();

    allPrices.forEach(doc => {
      const productId = doc.product.toString();
      // Tomar solo el primero (ya está ordenado por effectiveDate desc)
      if (!seenProducts.has(productId)) {
        pricesMap.set(productId, doc.price);
        seenProducts.add(productId);
      }
    });

    return pricesMap;
  } catch (error) {
    console.error('❌ Error fetching latest prices:', error.message);
    return new Map();
  }
};

module.exports = getLatestPrices;
