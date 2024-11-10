const Payment = require('@/models/appModels/Payment');
const mongoose = require('mongoose');
const Installment = mongoose.model('Installment');

const updatePayment = async (req, res) => {
  try {
    const { installmentId, paymentData } = req.body;

    const payment = await Payment.findById(paymentData.paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontro el pago',
      });
    }

    payment.status = paymentData.status;
    await payment.save();

    const installment = await Installment.findById(installmentId).populate('payments').exec();

    if (!installment) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontro la cuota',
      });
    }
    const totalPayment = installment.payments.reduce((totalAmount, currentPayment) => {
      if (
        currentPayment.removed ||
        currentPayment.disabled ||
        currentPayment.status !== 'Approved'
      ) {
        return totalAmount;
      }
      return totalAmount + currentPayment.amount;
    }, 0);

    const isTotallyPaid = totalPayment >= installment.amount;
    if (isTotallyPaid) {
      installment.status = 'Paid';
      installment.totalPaymentDate = Date.now();
    } else {
      installment.status = 'Pending';
      installment.totalPaymentDate = null;
    }

    const result = await installment.save();

    if (result) {
      return res.status(200).json({
        success: true,
        installment,
        message: `Se actualizo el pago`,
      });
    }
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error buscando las ordenes de venta',
      error: error.message,
    });
  }
};

module.exports = updatePayment;
