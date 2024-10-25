const mongoose = require('mongoose');
const SalesOrder = mongoose.model('SalesOrder');
const Installment = mongoose.model('Installment');

const listAll = async (req, res) => {
  try {
    const { id } = req.params || {};
    let query = { removed: false };
    let result;

    if (id) {
      query._id = id;
      const salesOrder = await SalesOrder.findOne(query)
        .populate({
          path: 'products.product',
          model: 'Product',
        })
        .populate('customer')
        .exec();
      if (salesOrder) {
        const installments = await Installment.find({ salesOrder: salesOrder._id }).populate({
          path: 'payments',
        }).exec();
        result = { ...salesOrder.toObject(), installments };
      }
    } else {
      result = await SalesOrder.find(query).populate('customer').sort({ created: -1 }).exec();
    }

    if (result) {
      return res.status(200).json({
        success: true,
        result,
        message: 'Se encontraron las ordenes de venta',
      });
    }
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error buscando las ordenedes de venta',
      error: error.message,
    });
  }
};

module.exports = listAll;
