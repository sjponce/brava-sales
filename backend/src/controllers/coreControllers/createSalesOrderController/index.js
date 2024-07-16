const create = require('./create');

const createSalesOrderController = () => {

  const salesOrderMethods = {
    create: (req, res) => create(req, res),
  };
  return salesOrderMethods;
};

module.exports = createSalesOrderController;
