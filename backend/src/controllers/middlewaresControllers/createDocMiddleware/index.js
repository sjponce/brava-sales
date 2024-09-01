const docInstallment = require('./docInstallment');
const docSalesOrder = require('./docSalesOrder');
const docTest = require('./docTest');

const createDocMiddleware = () => {
  const docMethods = {};

  docMethods.docTest = (req, res, next) =>
    docTest(req, res, next, {});
  docMethods.docSalesOrder = (req, res, next) =>
    docSalesOrder(req, res, next, {});
  docMethods.docInstallment = (req, res, next) =>
    docInstallment(req, res, next, {});

  return docMethods;
};

module.exports = createDocMiddleware;
