const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const createDocMiddleware = require('@/controllers/middlewaresControllers/createDocMiddleware');

const setupRoutes = async () => {
  const docMiddleware = createDocMiddleware();

  router.route('/docs/test').post(catchErrors(docMiddleware.docTest));
  router.route('/docs/salesOrder').post(catchErrors(docMiddleware.docSalesOrder));
  router.route('/docs/installment').post(catchErrors(docMiddleware.docInstallment));

};

setupRoutes();

module.exports = router;
