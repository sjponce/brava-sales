const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const createSalesOrderController = require('@/controllers/coreControllers/createSalesOrderController');

const setupRoutes = async () => {
  const salesMiddleware = createSalesOrderController();

  router.route('/sales').post(catchErrors(salesMiddleware.create));

  // Add more stock routes here
};

setupRoutes();

module.exports = router;
