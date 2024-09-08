const mongoose = require('mongoose');
const axios = require('axios');
const updateSalesOrderStatus = require('./updateSalesOrderStatus');
const SalesOrder = mongoose.model('SalesOrder');
const StockReservation = mongoose.model('StockReservation');

const reserveStock = async (req, res) => {
  const { orderId, productId } = req.body;
  const cookie = `token=${req.cookies.token}`;

  try {

    const salesOrder = await SalesOrder.findById(orderId).populate('products.reservations').exec();
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

    const product = salesOrder.products?.find((p) => p._id.toString() === productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontro el producto en la orden',
      });
    }

    const idStock = product.idStock;

    if (
      !['Pending', 'Partially reserved', 'Partially shipped', 'Partially delivered'].includes(
        salesOrder.status
      )
    ) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'Este producto ya fue reservado totalmente',
      });
    }

    const stockResponse = await axios.post(
      `${process.env.BASE_API}/stock/getStockProducts`,
      [idStock],
      {
        headers: {
          cookie,
        },
      }
    );

    const stockData = stockResponse?.data?.result[idStock];
    if (!stockData) {
      return res.status(500).json({
        success: false,
        result: null,
        message: 'No hay stock registrado',
      });
    }

    const reservationDetails = product.sizes
      .map((size) => {
        const stockSize = stockData?.find((s) => s.number === Number(size.size));
        const alreadyReserved = product.reservations.reduce((acc, reservation) => {
          const reservedSize = reservation.sizes?.find((reserved) => reserved.size === size.size);
          return reservedSize ? acc + reservedSize.quantity : acc;
        }, 0);

        const availableStock = stockSize?.stock ?? 0;

        const quantityToReserve = Math.min(size.quantity - alreadyReserved, availableStock);

        const totalReserved = alreadyReserved + quantityToReserve;

        if (quantityToReserve === 0) return null;

        return {
          size: size.size,
          quantity: quantityToReserve,
          pending: size.quantity - totalReserved,
        };
      })
      .filter((detail) => detail !== null);

    if (reservationDetails.length === 0) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No hay stock disponible para reservar',
      });
    }

    const stockReservation = new StockReservation({
      sizes: reservationDetails,
      status: 'Reserved',
    });

    await stockReservation.save();
    product.reservations.push(stockReservation._id);

    await salesOrder.save();
    await updateSalesOrderStatus(orderId);

    const stockMovementResponse = await axios.post(
      `${process.env.BASE_API}/stock/movement`,
      {
        type: 'output',
        details: reservationDetails.map((size) => ({
          productId: idStock,
          number: Number(size.size),
          quantity: size.quantity,
        })),
      },
      {
        headers: {
          cookie,
        },
      }
    );

    await salesOrder.save();
    return res.status(200).json({
      success: true,
      result: stockMovementResponse.data,
      message: 'Reserva agregada exitosamente',
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
