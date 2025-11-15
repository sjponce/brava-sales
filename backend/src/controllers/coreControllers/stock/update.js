const getLatestPrice = require('./getLatestPrice');
const mongoose = require('mongoose');
const Product = mongoose.model('Product');

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const jsonData = req.body;

    // Validar campos requeridos
    if (!jsonData.description || !jsonData.tags) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: description o tags',
      });
    }

    // Verificar existencia del producto
    const productExists = await Product.findById(id);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    // Historial de precio si corresponde
    if (jsonData.price) {
      const latestPrice = await getLatestPrice(id);
      if (jsonData.price !== latestPrice) {
        const PriceHistory = mongoose.model('PriceHistory');
        const newPriceHistory = new PriceHistory({
          product: id,
          price: jsonData.price,
          effectiveDate: new Date(),
        });
        await newPriceHistory.save();
      }
    }

    // Actualizar solo los campos permitidos
    const updateFields = {
      description: jsonData.description,
      tags: jsonData.tags,
    };

    const updatedProduct = await Product.findByIdAndUpdate(id, updateFields, { new: true });

    res.status(200).json({
      success: true,
      result: updatedProduct,
      message: 'Producto actualizado exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      result: null,
      message: 'Error al actualizar el producto',
      error: error.message,
    });
  }
};

module.exports = update;