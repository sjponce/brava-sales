const create = require('./create');
const listAll = require('./listAll');

const createSalesOrderController = () => {

  const salesOrderMethods = {
    create: (req, res) => create(req, res),
    listAll: (req, res) => listAll(req, res),
  };
  return salesOrderMethods;
};

module.exports = createSalesOrderController;
