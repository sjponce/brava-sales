const { getPreference } = require('@/config/mercadoPagoConfig');
const Payment = require('@/models/appModels/Payment');
const mongoose = require('mongoose');
const Installment = mongoose.model('Installment');

const createPayment = async (req, res) => {
  try {
    const { installmentId, paymentData, mercadoPagoData } = req.body;

    const installment = await Installment.findById(installmentId).populate('payments').exec();

    if (!installment) {
      return res.status(404).json({
        success: false,
        result: null,
        message: 'No se encontro la cuota',
      });
    }

    let mercadoPagoPaymentData;

    if (paymentData.paymentMethod === 'MercadoPago') {
      if (!mercadoPagoData) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'No se encuentra la informacion de mercado pago',
        });
      }
      mercadoPagoPaymentData = await getPreference(mercadoPagoData.preference_id);

      if (!mercadoPagoPaymentData) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'No se encuentra la informacion de mercado pago',
        });
      }
      if (mercadoPagoPaymentData.auto_return !== 'approved') {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'El pago no fue aprobado',
        });
      }
      
      if (
        installment.payments.find(
          (payment) =>
            payment.mercadoPagoData?.preference_id === mercadoPagoData?.preference_id
        )
      ) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'El pago ya fue procesado anteriormente',
        });
      }
      const mercadoPagoAmount = mercadoPagoPaymentData.items?.reduce(
        (total, curr) => total + curr.unit_price,
        0
      );
      if (
        mercadoPagoAmount !== Number(paymentData.amount) ||
        !mercadoPagoPaymentData.items[0]?.title === installment.salesOrderCode
      ) {
        return res.status(409).json({
          success: false,
          result: null,
          message: 'Los datos de mercado pago no coinciden con los datos de la cuota',
        });
      }
    }

    const newPayment = await new Payment({
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      mercadoPagoData,
      photo: paymentData.photo,
    }).save();
    installment.payments.push(newPayment);

    const totalPayment = installment.payments.reduce((totalAmount, currentPayment) => {
      if (currentPayment.removed || currentPayment.disabled) {
        return totalAmount;
      }
      return totalAmount + currentPayment.amount;
    }, 0);

    if (totalPayment - installment.amount > 1) {
      return res.status(409).json({
        success: false,
        result: null,
        message: 'El monto es mayor al monto de la cuota',
      });
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
        message: 'Se creo el pago',
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

module.exports = createPayment;
