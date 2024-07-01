const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const createStockMiddleware = require('@/controllers/appControllers/stock');

const setupRoutes = async () => {
  const stockMiddleware = createStockMiddleware();

  router.route('/stock/:id?').get(catchErrors(stockMiddleware.listAll));

  // Add more stock routes here
};

setupRoutes();

module.exports = router;
