const listAll = require('./listAll');
const { callWithAuth } = require('./authStock');

const createStockMiddleware = () => {
  const stockMethods = {
    listAll: async (req, res, ...args) => {
      await callWithAuth(req, res, listAll, ...args);
    },
  };
  return stockMethods;
};

module.exports = createStockMiddleware;
