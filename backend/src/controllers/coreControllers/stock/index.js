const listAll = require('./listAll');
const listAllCatalog = require('./listAllCatalog');
const { callWithAuth } = require('./callWithAuth');
const update  = require('./update');
const remove = require('./remove');
const read = require('./read');
const getStockProducts = require('./getStockProducts');
const registerStockMovement = require('./registerStockMovement');

const createStockMiddleware = () => {
  const stockMethods = {
    listAll: async (req, res, ...args) => {
      await callWithAuth(req, res, listAll, ...args);
    },
    listAllCatalog: async (req, res, ...args) => {
      await callWithAuth(req, res, listAllCatalog, ...args);
    },
    update: async (req, res, ...args) => {
      await callWithAuth(req, res, update, ...args);
    },
    remove: async (req, res, ...args) => {
      await callWithAuth(req, res, remove, ...args);
    },
    read: async (req, res, ...args) => {
      await callWithAuth(req, res, read, ...args);
    },
    getStockProducts: async (req, res, ...args) => {
      await callWithAuth(req, res, getStockProducts, ...args);
    },
    registerStockMovement: async (req, res, ...args) => {
      await callWithAuth(req, res, registerStockMovement, ...args);
    },
  };
  return stockMethods;
};

module.exports = createStockMiddleware;
