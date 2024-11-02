const translations = {
    user: 'usuario',
    customer: 'cliente',
    seller: 'vendedor',
    payment: 'pago',
    stockreservation: 'envio',
  };

const translate = (model) => {
  const modelTranslation = translations[model.toLowerCase()];
    return modelTranslation || model;
};
  
module.exports = translate;