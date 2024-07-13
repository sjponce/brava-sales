// utils/traducirModelo.js
const translations = {
    user: 'vendedor'
  };
  
const translate = (model) => {
  const modelTranslation = translations[model.toLowerCase()];
    return modelTranslation || model;
};
  
module.exports = translate;