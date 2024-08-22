const docTest = require('./docTest');

const createDocMiddleware = () => {
  const docMethods = {};

  docMethods.docTest = (req, res, next) =>
    docTest(req, res, next, {});

  return docMethods;
};

module.exports = createDocMiddleware;
