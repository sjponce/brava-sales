const { default: mongoose } = require('mongoose');

const Installment = mongoose.model('Installment');
const SalesOrder = mongoose.model('SalesOrder');

const create = async (req, res) => {
  // Creating a new document in the collection
  const salesOrderData = req.body;
  const installmentPeriod = 30;

  const salesOrder = await new SalesOrder({
    customer: salesOrderData.customer,
    orderDate: salesOrderData.orderDate,
    items: salesOrderData.items,
    status: 'Pending',
    paymentStatus: 'Unpaid',
    shippingAddress: salesOrderData.shippingAddress,
    removed: false,
    enabled: true,
    totalAmount: 0,
  }).save();

  // Creating new installments for the sales order
  for (let i = 0; i < salesOrderData.installmentCount; i++) {
    const installmentDueDate = new Date(salesOrderData.orderDate);
    installmentDueDate.setDate(installmentDueDate.getDate() + (i + 1) * installmentPeriod);

    await new Installment({
      salesOrderNumber: salesOrder.orderNumber,
      installmentNumber: 1,
      dueDate: req.body.installmentDueDate,
      amount: salesOrder.totalAmount,
      status: 'Pending',
    }).save();
  }
  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: { salesOrder },
    message: `La Orden de venta se creo correctamente`,
  });
};

module.exports = create;
