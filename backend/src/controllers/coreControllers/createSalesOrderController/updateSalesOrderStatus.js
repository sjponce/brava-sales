const SalesOrder = require("@/models/appModels/SalesOrder");
const StockReservation = require("@/models/appModels/StockReservation");

const updateSalesOrderStatus = async (salesOrderId) => {
  try {
    const salesOrder = await SalesOrder.findById(salesOrderId).populate('products.product').exec();
    if (!salesOrder) {
      throw new Error('Orden de venta no encontrada');
    }

    // Obtener las reservas de stock asociadas a la orden
    const stockReservations = await StockReservation.find({ salesOrder: salesOrderId }).populate('products').exec();
    if (!stockReservations || stockReservations.length === 0) {
      throw new Error('No se encontraron reservas de stock para la orden de venta');
    }

    let allReserved = true;

    // Crear un objeto para sumarizar las cantidades reservadas por producto y tamaño
    const reservedQuantities = {};

    // Recorrer las reservas de stock y sumarizar las cantidades
    stockReservations.forEach(reservation => {
      reservation.products.forEach(product => {
        product.sizes.forEach(size => {
          const key = `${product.idStock}-${size.size}`;
          if (!reservedQuantities[key]) {
            reservedQuantities[key] = 0;
          }
          reservedQuantities[key] += size.quantity;
        });
      });
    });

    // Recorrer los productos de la orden de venta
    for (let orderProduct of salesOrder.products) {
      // Verificar las cantidades por tamaño
      for (let orderSize of orderProduct.sizes) {
        const key = `${orderProduct.idStock}-${orderSize.size}`;
        const reservedQuantity = reservedQuantities[key] || 0;

        if (reservedQuantity < orderSize.quantity) {
          allReserved = false;
          break;
        }
      }

      if (!allReserved) break;
    }

    // Actualizar el estado de la orden de venta
    if (allReserved) {
      salesOrder.status = 'Reserved';
    } else {
      salesOrder.status = 'Partially reserved';
    }

    await salesOrder.save();

  } catch (error) {
    console.error('Error updating sales order status:', error);
    throw error;
  }
};

module.exports = updateSalesOrderStatus;
