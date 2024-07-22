// utils/traducirModelo.js
const translations = {
    user: 'vendedor',
    client: 'cliente',
    seller: 'vendedor',
  };
  
const translate = (model) => {
  const modelTranslation = translations[model.toLowerCase()];
    return modelTranslation || model;
};
  
module.exports = translate;