const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const createStockMiddleware = require('@/controllers/coreControllers/stock');

const setupRoutes = async () => {
  const stockMiddleware = createStockMiddleware();

  router.route('/stock').get(catchErrors(stockMiddleware.listAll));
  router.route('/stock/:id?').get(catchErrors(stockMiddleware.listAll));
  router.route('/stock/update/:id').put(catchErrors(stockMiddleware.update));
  router.route('/stock/remove/:id').delete(catchErrors(stockMiddleware.remove));

  // Add more stock routes here
};

setupRoutes();

module.exports = router;
