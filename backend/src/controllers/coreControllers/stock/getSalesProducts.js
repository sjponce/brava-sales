const mongoose = require('mongoose');

const getSalesProducts = async () => {
  const Product = mongoose.model('Product');
  try {
    return await Product.find().populate('tags').exec();
  } catch (error) {
    console.error('Error fetching products from sales API:', error);
    return [];
  }
};

module.exports = getSalesProducts;
