const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const createSalesOrderController = require('@/controllers/coreControllers/createSalesOrderController');

const setupRoutes = async () => {
  const salesMiddleware = createSalesOrderController();

  router.route('/sales').post(catchErrors(salesMiddleware.create));
  router.route('/sales').get(catchErrors(salesMiddleware.listAll));
  router.route('/sales/reserve-stock').post(catchErrors(salesMiddleware.reserveStock));
  router.route('/sales/update-stock-reservation-status').post(catchErrors(salesMiddleware.updateStockReservationStatus));
  router.route('/sales/reserve-stock/').get(catchErrors(salesMiddleware.listAllStockReservations));
  router.route('/sales/:id').get(catchErrors(salesMiddleware.listAll));
  router.route('/sales/create-payment').put(catchErrors(salesMiddleware.createPayment));
  router.route('/sales/update-payment').post(catchErrors(salesMiddleware.updatePayment));
  router.route('/sales/create-mp-link').put(catchErrors(salesMiddleware.createMPLink));
};

setupRoutes();

module.exports = router;
