const translations = {
    user: 'usuario',
    customer: 'cliente',
    seller: 'vendedor',
    payment: 'pago',
    stockreservation: 'envio',
    trip: 'viaje',
  };

const translate = (model) => {
  const modelTranslation = translations[model.toLowerCase()];
    return modelTranslation || model;
};
  
module.exports = translate;