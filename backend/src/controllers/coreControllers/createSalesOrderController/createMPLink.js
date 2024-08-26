/* eslint-disable camelcase */
const { MercadoPagoConfig, Preference } = require("mercadopago");
const mongoose = require('mongoose');
const Installment = mongoose.model('Installment');

const createMPLink = async (req, res) => {

    const { installmentId, paymentData } = req.body;

    const installment = await Installment.findById(installmentId).populate('payments').exec();

    if (!installment) {
      throw new Error('No se encontro la cuota');
    }

  const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

  const body = {
    items: [
      {
        title: installment.salesOrderCode,
        quantity: 1,
        unit_price: Number(paymentData.amount),
        currency_id: 'ARS',
      },
    ],
    back_urls: {
      success: `${process.env.MP_REDIRECT_URL}/success?salesOrder=${installment.salesOrder}&installment=${installmentId}&amount=${paymentData.amount}`,
      failure: `${process.env.MP_REDIRECT_URL}/failure?salesOrder=${installment.salesOrder}&installment=${installmentId}&amount=${paymentData.amount}`,
      pending: `${process.env.MP_REDIRECT_URL}/pending?salesOrder=${installment.salesOrder}&installment=${installmentId}&amount=${paymentData.amount}`,
    },
    auto_return: 'approved',
  };
  try {
    const preference = await new Preference(client).create({ body });
    if(preference) {
        return res.status(200).json({
            success: true,
            redirectUrl: preference.init_point,
            message: 'Se genero el link de pago',
          });
    }
  } catch (error) {
    return res.status(500).json({
        success: false,
        result: null,
        message: 'No se pudo generar el link de MP',
        error: error.message,
      });
  }
};

module.exports = createMPLink;
