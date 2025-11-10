const mongoose = require('mongoose');
const axios = require('axios');
const updateSalesOrderStatus = require('./updateSalesOrderStatus');
const NotificationHelpers = require('../../../helpers/NotificationHelpers');
const SalesOrder = mongoose.model('SalesOrder');
const StockReservation = mongoose.model('StockReservation');

const reserveStock = async (req, res) => {
  const { orderId, products } = req.body;
  const cookie = `token=${req.cookies.token}`;

  try {
    const salesOrder = await SalesOrder.findById(orderId).exec();
    if (!salesOrder) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'Orden de venta no encontrada',
      });
    }

    if (!Array.isArray(salesOrder.products)) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error interno del servidor',
        error: 'salesOrder.products is not an array',
      });
    }

    // Traer todas las reservas existentes para la orden
    const existingReservations = await StockReservation.find({ order: orderId }).exec();

    // Sumarizar las reservas por producto y tamaño
    const reservedQuantities = {};
    existingReservations.forEach(reservation => {
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

    // Crear nuevas reservas solo si las cantidades solicitadas no exceden las cantidades disponibles
    const stockReservations = [];
    const movementDetails = [];
    const newProducts = [];

    for (const productReservation of products) {
      const { sizes, idStock, color, stockId } = productReservation;
      const product = salesOrder.products.find(p => p.idStock === idStock);
      if (!product) {
        return res.status(404).json({
          success: false,
          result: null,
          message: `Producto ${stockId} ${color} no encontrado en la orden de venta`,
        });
      }

      // Obtener datos de stock del sistema de stock
      const stockResponse = await axios.post(
        `${process.env.BASE_API}/stock/getStockProducts`,
        [idStock],
        {
          headers: {
            cookie,
          },
        }
      );

      if (stockResponse.status !== 200) {
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Error al obtener datos de stock',
        });
      }

      const stockData = stockResponse.data.result[idStock];
      const newSizes = [];
        
      for (const size of sizes) {
        const key = `${idStock}-${size.size}`;
        const alreadyReserved = reservedQuantities[key] || 0;
        const orderQuantity = product.sizes.find(s => s.size === size.size)?.quantity || 0;

        // Comprobar que las cantidades reservadas no excedan las cantidades solicitadas en la orden
        if (alreadyReserved + size.quantity > orderQuantity) {
          return res.status(400).json({
            success: false,
            result: null,
            message: `Cantidad solicitada para el tamaño ${size.size} del producto ${stockId} ${color} excede la cantidad demandada`,
          });
        }

        // Comprobar que las cantidades reservadas no excedan las cantidades disponibles en el sistema de stock
        const stockSize = stockData.find(s => s.number === Number(size.size));
        if (!stockSize) {
          return res.status(500).json({
            success: false,
            result: null,
            message: `No hay stock suficiente del producto ${stockId} ${color}`,
          });
        }

        if (size.quantity > stockSize.stock) {
          return res.status(400).json({
            success: false,
            result: null,
            message: `Cantidad solicitada para el tamaño ${size.size} excede la cantidad disponible en el stock`,
          });
        }

        newSizes.push({
          size: size.size,
          quantity: size.quantity,
          pending: orderQuantity - (alreadyReserved + size.quantity),
        });

        // Actualizar las cantidades reservadas
        reservedQuantities[key] = alreadyReserved + size.quantity;

        // Agregar detalles del movimiento de stock
        movementDetails.push({
          productId: idStock,
          number: Number(size.size),
          quantity: size.quantity,
        });
      }

      newProducts.push({
        ...productReservation,
        sizes: newSizes,
      });
    }

    stockReservations.push(new StockReservation({
      products: newProducts,
      salesOrder: orderId,
    }));
    

    // Guardar todas las reservas en la base de datos
    await StockReservation.insertMany(stockReservations);

    // Registrar el movimiento de stock
    const movementData = {
      type: 'output',
      details: movementDetails,
    };

    const responseMovement = await axios.post(`${process.env.BASE_API}/stock/movement`, movementData, {
      headers: { cookie },
    });

    if (responseMovement.status !== 200) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error al registrar movimiento de stock',
      });
    }

    // Actualizar el estado de la orden de venta
    await updateSalesOrderStatus(orderId);
    
    // Enviar notificación de stock reservado
    try {
      const populatedSalesOrder = await SalesOrder.findById(orderId).populate('customer').exec();
      if (populatedSalesOrder && stockReservations.length > 0) {
        await NotificationHelpers.onStockReserved(
          stockReservations[0], // Usar la primera reserva como referencia
          populatedSalesOrder,
          req.admin?._id || req.user?._id
        );
      }
    } catch (notificationError) {
      console.error('Error sending stock reserved notification:', notificationError);
      // No fallar la operación principal por un error de notificación
    }
    
    // comparar las cantidades de la orden con las cantidades reservadas
    

    return res.status(200).json({
      success: true,
      result: null,
      message: 'Reservas agregadas exitosamente',
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

module.exports = reserveStock;
