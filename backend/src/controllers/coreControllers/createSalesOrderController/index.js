const create = require('./create');
const listAll = require('./listAll');
const createPayment = require('./createPayment');
const createSalesOrderController = () => {

  const salesOrderMethods = {
    create: (req, res) => create(req, res),
    listAll: (req, res) => listAll(req, res),
    createPayment: (req, res) => createPayment(req, res),
  };
  return salesOrderMethods;
};

module.exports = createSalesOrderController;
