const create = require('./create');
const listAll = require('./listAll');
const createPayment = require('./createPayment');
const reserveStock = require('./reserveStock');
const createMPLink = require('./createMPLink');
const listAllStockReservations = require('./listAllStockReservations');
const createSalesOrderController = () => {

  const salesOrderMethods = {
    create: (req, res) => create(req, res),
    listAll: (req, res) => listAll(req, res),
    createPayment: (req, res) => createPayment(req, res),
    reserveStock: (req, res) => reserveStock(req, res),
    listAllStockReservations: (req, res) => listAllStockReservations(req, res),
    createMPLink: (req, res) => createMPLink(req, res),
  };
  return salesOrderMethods;
};

module.exports = createSalesOrderController;
