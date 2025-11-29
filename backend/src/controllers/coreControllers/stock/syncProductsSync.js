const sizeChart = require('../../../utils/constants').SIZE_CHART;
const mongoose = require('mongoose');

const syncProductsSync = async (stockData, existingSalesData = null) => {
  try {
    const Product = mongoose.model('Product');
    
    // Reutilizar datos existentes si se proporcionan, evitando consulta duplicada
    let salesProducts = existingSalesData;
    if (!salesProducts) {
      salesProducts = await Product.find().exec();
    }
    
    const salesMap = new Map(salesProducts.map(p => [p.stockId, p]));
    const stockIds = Object.keys(stockData);

    const syncStats = {
      created: [],
      reactivated: [],
      deactivated: [],
    };

    // 1. Crear nuevos productos y reactivar removidos
    for (const stockId of stockIds) {
      const variations = stockData[stockId];
      if (!variations || variations.length === 0) continue;

      const firstVariation = variations[0];
      const existingProduct = salesMap.get(stockId);

      if (!existingProduct) {
        // Generar array de sizes segun atributto sizesType
        const sizeType = variations[0].sizeType;
        const sizes = sizeChart[sizeType] || [];
        
        if (sizes.length === 0) {
          console.warn(`Warning: sizeType "${sizeType}" no encontrado en SIZE_CHART para ${stockId}`);
        }
        
        // Crear nuevo producto con enabled: false (debe ser publicado manualmente)
        await Product.create({
          stockId,
          description: firstVariation.description,
          promotionalName: stockId,
          tags: [],
          enabled: false,
          removed: false,
          sizes: sizes,
        });
        syncStats.created.push(stockId);
      } else if (existingProduct.removed) {
        // Reactivar si fue marcado como removido
        existingProduct.removed = false;
        existingProduct.enabled = true;
        await existingProduct.save();
        syncStats.reactivated.push(stockId);
      }
    }

    // 2. Marcar como removidos los que desaparecieron de stock
    for (const [stockId, product] of salesMap) {
      if (!stockData[stockId] && !product.removed) {
        product.removed = true;
        product.enabled = false;
        await product.save();
        syncStats.deactivated.push(stockId);
      }
    }

    return syncStats;
  } catch (error) {
    console.error('Error synchronizing products:', error);
    throw error;
  }
};

module.exports = syncProductsSync;
