const Payment = require('@/models/appModels/Payment');
const mongoose = require('mongoose');
const Installment = mongoose.model('Installment');

const createPayment = async (req, res) => {
  try {
    const { installmentId, paymentData } = req.body;

    const installment = await Installment.findById(installmentId).populate('payments').exec();

    if (!installment) {
      throw new Error('Installment not found');
    }

    const newPayment = await new Payment({
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      photo: paymentData.photo,
    }).save();
    installment.payments.push(newPayment);

    const totalPayment = [...installment.payments, newPayment].reduce(
      (totalAmount, currentPayment) => {
        if (currentPayment.removed && currentPayment.disabled) {
          return totalAmount;
        }
        return totalAmount + currentPayment.amount;
      },
      0
    );

    if (totalPayment - installment.amount > 1) {
      const error = new Error('El monto es mayor al monto de la cuota');
      throw error;
    }

    const isTotallyPaid = totalPayment >= installment.amount;
    if (isTotallyPaid) {
      installment.status = 'Paid';
      installment.totalPaymentDate = Date.now();
    }

    const result = await installment.save();

    if (result) {
      return res.status(200).json({
        success: true,
        installment,
        message: 'Se encontraron las ordenes de venta',
      });
    }
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    if (error.message === 'El monto es mayor al monto de la cuota') {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'El monto es mayor al monto de la cuota',
        error: error.message,
      });
    }
    return res.status(500).json({
      success: false,
      result: null,
      message: 'Ocurrio un error buscando las ordenedes de venta',
      error: error.message,
    });
  }
};

module.exports = createPayment;
