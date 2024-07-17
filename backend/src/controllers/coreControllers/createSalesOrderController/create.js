const mongoose = require('mongoose');

const Installment = mongoose.model('Installment');
const SalesOrder = mongoose.model('SalesOrder');
const PriceHistory = mongoose.model('PriceHistory');

const getLatestPrice = async (productId) => {
  const latestPrice = await PriceHistory.findOne({ product: productId })
    .sort({ effectiveDate: -1 })
    .limit(1)
    .exec();
  return latestPrice ? latestPrice.price : 0;
};

const create = async (req, res) => {
  try {
    // Creating a new document in the collection
    const salesOrderData = req.body;
    const installmentPeriod = 30;
    const products = salesOrderData.products;

    // Calculate total amount based on latest prices
    let totalAmount = 0;
    for (const product of products) {
      const latestPrice = await getLatestPrice(product.productId);
      product.price = latestPrice;
      totalAmount += latestPrice * product.quantity;
    }
    if (totalAmount === 0 || !products.length) {
      return res.status(400).json({
        success: false,
        result: null,
        message: 'No se encontraron productos para la orden de venta',
      });
    }
    const salesOrder = await new SalesOrder({
      customer: salesOrderData.customer,
      orderDate: salesOrderData.orderDate,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      shippingAddress: salesOrderData.shippingAddress,
      removed: false,
      enabled: true,
      totalAmount,
      products,
    }).save();

    // Creating new installments for the sales order
    const installmentTotalAmount = salesOrder.totalAmount / salesOrderData.installmentsCount;

    for (let i = 0; i < salesOrderData.installmentsCount; i++) {
      const installmentDueDate = new Date(salesOrderData.orderDate);
      installmentDueDate.setDate(installmentDueDate.getDate() + (i + 1) * installmentPeriod);

      await new Installment({
        salesOrder: salesOrder._id,
        installmentNumber: i + 1,
        dueDate: installmentDueDate,
        amount: installmentTotalAmount,
        status: 'Pending',
      }).save();
    }
    // Returning successfull response
    return res.status(200).json({
      success: true,
      result: { salesOrder },
      message: `La Orden de venta se creo correctamente`,
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