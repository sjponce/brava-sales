const listAll = require('./listAll');
const { callWithAuth } = require('./callWithAuth');
const update  = require('./update');
const remove = require('./remove');
const read = require('./read');

const createStockMiddleware = () => {
  const stockMethods = {
    listAll: async (req, res, ...args) => {
      // TODO: Removed stock since its down Release 1.3.0
      //await callWithAuth(req, res, listAll, ...args);
      listAll(req, res, ...args);
    },
    update: async (req, res, ...args) => {
      await callWithAuth(req, res, update, ...args);
    },
    remove: async (req, res, ...args) => {
      await callWithAuth(req, res, remove, ...args);
    },
    read: async (req, res, ...args) => {
      await callWithAuth(req, res, read, ...args);
    }
  };
  return stockMethods;
};

module.exports = createStockMiddleware;
