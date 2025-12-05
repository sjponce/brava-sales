const mongoose = require('mongoose');

const Installment = mongoose.model('Installment');
const SalesOrder = mongoose.model('SalesOrder');
const PriceHistory = mongoose.model('PriceHistory');
const User = mongoose.model('User');
const { MONTHLY_INTEREST_RATE } = require('../../../utils/constants');
const NotificationHelpers = require('../../../helpers/NotificationHelpers');

const getLatestPrice = async (productId) => {
  const latestPrice = await PriceHistory.findOne({ product: productId })
    .sort({ effectiveDate: -1 })
    .limit(1)
    .exec();
  return latestPrice ? latestPrice.price : 0;
};

const getNextSalesOrderCode = async () => {
  const latestSalesOrder = await SalesOrder.findOne().sort({ salesOrderCode: -1 }).exec();
  const latestCode = latestSalesOrder?.salesOrderCode ?? 'OV-000';
  const latestNumber = parseInt(latestCode.split('-')[1]);
  const nextNumber = latestNumber + 1;
  return `OV-${nextNumber.toString().padStart(3, '0')}`;
};

const calculateFinalAmount = (totalAmount, discount, installmentCount) => {
  const totalWithDiscount = totalAmount - (totalAmount * (discount / 100));
  const interest = totalWithDiscount * (MONTHLY_INTEREST_RATE * (installmentCount - 1));
  return totalWithDiscount + interest;
};

const create = async (req, res) => {
  try {
    // Creating a new document in the collection
    const salesOrderData = req.body;
    const installmentPeriod = 30;
    const installmentsCount = salesOrderData.installmentsCount ?? 1;
    const products = salesOrderData.products;
    const nextSalesOrderCode = await getNextSalesOrderCode();

    if (salesOrderData.ecommerce) {
      const user = await User.findById(salesOrderData.responsible);
      if (user.role !== 'customer') {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Solo los clientes pueden realizar compras desde aquí',
        });
      }
    }

    // Calculate total amount based on latest prices
    let totalAmount = 0;
    for (const product of products) {
      const latestPrice = await getLatestPrice(product.product);
      product.price = latestPrice;
      for (const size of product.sizes) {
        totalAmount += latestPrice * size.quantity;
      }
    }
    if (totalAmount === 0 || !products.length) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No se encontraron productos para la orden de venta',
      });
    }

    const finalAmount = calculateFinalAmount(totalAmount, salesOrderData.discount, installmentsCount);

    if (Math.abs(finalAmount - salesOrderData.finalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'El monto final calculado no coincide con el monto enviado',
      });
    }

    const salesOrder = await new SalesOrder({
      salesOrderCode: nextSalesOrderCode,
      customer: salesOrderData.customer,
      orderDate: salesOrderData.orderDate,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      shippingAddress: salesOrderData.shippingAddress,
      removed: false,
      enabled: true,
      totalAmount,
      finalAmount,
      discount: salesOrderData.discount,
      promotion: salesOrderData.promotion,
      products,
      responsible: salesOrderData.responsible,
      ecommerce: salesOrderData.ecommerce,
      shippingMethod: salesOrderData.shippingMethod,
    }).save();

    // Creating new installments for the sales order
    const installmentTotalAmount = parseFloat((salesOrder.finalAmount / installmentsCount).toFixed(2));

    try {
      for (let i = 0; i < installmentsCount; i++) {
        const installmentDueDate = new Date(salesOrder.orderDate);
        installmentDueDate.setDate(installmentDueDate.getDate() + (i + 1) * installmentPeriod);

        await new Installment({
          salesOrderCode: salesOrder.salesOrderCode,
          salesOrder: salesOrder._id,
          installmentNumber: i + 1,
          dueDate: installmentDueDate,
          amount: installmentTotalAmount,
          status: 'Pending',
        }).save();
      }
    } catch (installmentError) {
      // If installment creation fails, delete the sales order
      await SalesOrder.findByIdAndDelete(salesOrder._id);
      throw installmentError; // Re-throw the error to be caught by the outer catch block
    }

    // Populate customer data para la notificación
    const populatedSalesOrder = await SalesOrder.findById(salesOrder._id)
      .populate('customer')
      .exec();

    // Disparar notificación de orden creada
    await NotificationHelpers.onOrderCreated(
      populatedSalesOrder, 
      salesOrderData.responsible // Usuario que creó la orden
    );

    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: { salesOrder },
      message: `La Orden de venta se creó correctamente`,
    });
  } catch (error) {
    // Error handling
    console.error('Error creating sales order:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Error al crear la Orden de venta',
      error: error.message,
    });
  }
};



module.exports = create;
