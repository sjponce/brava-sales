const SalesOrder = require("@/models/coreModels/SalesOrder");

const updateSalesOrderStatus = async (salesOrderId) => {
  try {
    const salesOrder = await SalesOrder.findById(salesOrderId).populate('products.reservations');
    if (!salesOrder) {
      throw new Error('Sales order not found');
    }

    let allFullyReserved = true;
    let allShipped = true;
    let allDelivered = true;

    for (const product of salesOrder.products) {
      let productFullyReserved = true;
      let productShipped = false;
      let productDelivered = false;

      // Calcula la cantidad total solicitada por cada size
      const requestedQuantities = product.sizes.reduce((acc, size) => {
        acc[size.size] = size.quantity;
        return acc;
      }, {});

      // Calcula la cantidad total reservada por cada size
      const reservedQuantities = {};

      for (const reservation of product.reservations) {
        if (reservation.status === 'Shipped') {
          productShipped = true;
        }
        if (reservation.status === 'Delivered') {
          productDelivered = true;
        }

        for (const size of reservation.sizes) {
          if (!reservedQuantities[size.size]) {
            reservedQuantities[size.size] = 0;
          }
          reservedQuantities[size.size] += size.quantity;
        }
      }

      // Verifica si todas las cantidades solicitadas han sido completamente reservadas
      for (const size of product.sizes) {
        if (reservedQuantities[size.size] < requestedQuantities[size.size]) {
          productFullyReserved = false;
          break;
        }
      }

      // Si algún producto no está completamente reservado
      if (!productFullyReserved) {
        allFullyReserved = false;
      }

      // Si un producto no está completamente enviado
      if (!productShipped) {
        allShipped = false;
      }

      // Si un producto no está completamente entregado
      if (!productDelivered) {
        allDelivered = false;
      }
    }

    // Determinar el estado general de la orden
    if (allDelivered) {
      salesOrder.status = 'Delivered';
    } else if (allShipped) {
      salesOrder.status = 'Shipped';
    } else if (allFullyReserved) {
      salesOrder.status = 'Reserved';
    } else {
      // Revisa si hay alguna reserva y establece el estado parcial correspondiente
      if (salesOrder.products.some(product => product.reservations.length > 0)) {
        salesOrder.status = 'Partially reserved';
      } else {
        salesOrder.status = 'Pending';
      }

      if (salesOrder.products.some(product => product.reservations.some(reservation => reservation.status === 'Shipped'))) {
        salesOrder.status = 'Partially shipped';
      }

      if (salesOrder.products.some(product => product.reservations.some(reservation => reservation.status === 'Delivered'))) {
        salesOrder.status = 'Partially delivered';
      }
    }

    await salesOrder.save();
    return salesOrder.status;
  } catch (error) {
    console.error('Error updating sales order status:', error);
    throw error;
  }
};

module.exports = updateSalesOrderStatus;
