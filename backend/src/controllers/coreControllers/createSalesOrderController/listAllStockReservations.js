const mongoose = require('mongoose');
const StockReservation = mongoose.model('StockReservation');

const listAllStockReservations = async (req, res) => {
  try {
    const reservations = await StockReservation.find()
      .populate('salesOrder')
      .populate('product')
      .populate({
        path: 'salesOrder',
        populate: {
          path: 'customer',
          model: 'Customer'
        }
      })
      .exec();

    return res.status(200).json({
      success: true,
      result: reservations,
      message: 'Reservas de stock obtenidas exitosamente',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
};

module.exports = listAllStockReservations;
