const mongoose = require('mongoose');
const StockReservation = mongoose.model('StockReservation');
const SalesOrder = mongoose.model('SalesOrder');

const updateStockReservationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    
    // Update stock reservation status
    const stockReservation = await StockReservation.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!stockReservation) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Stock reservation not found',
      });
    }

    const allStockReservations = await StockReservation.find({ 
      salesOrder: stockReservation.salesOrder 
    });

    // Check if all items are shipped or if there are pending items
    const hasUnshippedItems = allStockReservations.some(
      reservation => reservation.status !== 'Delivered'
    );

    // Update sales order status based on stock reservations
    const newStatus = hasUnshippedItems ? 'Partially Shipped' : 'Completed';
    
    const updatedSalesOrder = await SalesOrder.findByIdAndUpdate(
      stockReservation.salesOrder,
      { status: newStatus },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      result: {
        stockReservation,
        salesOrder: updatedSalesOrder
      },
      message: 'La entrega se actualizo correctamente',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error actualizando la entrega',
      error: error.message
    });
  }
};

module.exports = updateStockReservationStatus;
