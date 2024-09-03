const { MercadoPagoConfig, Preference } = require("mercadopago");

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

const createPreference = async (body) => {
  return new Preference(client).create({ body });
};

const getPreference = async (preferenceId, requestOptions) => {
    return new Preference(client).get({preferenceId, requestOptions});
  };

module.exports = {
  client,
  createPreference,
  getPreference,
};