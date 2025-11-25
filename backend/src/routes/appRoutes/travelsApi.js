const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const travelController = require('@/controllers/appControllers/travelController');

const setupRoutes = async () => {
  const controller = travelController;

  router.route('/travels').post(catchErrors(controller.create));
  router.route('/travels/:id/assign-orders').post(catchErrors(controller.assignOrders));
  router.route('/travels/:id/details').get(catchErrors(controller.getDetails));
  router.route('/travels/:id/start').post(catchErrors(controller.start));
  router.route('/travels/:id/stops/:stopId/arrive').post(catchErrors(controller.arriveStop));
  router.route('/travels/:id/deliveries').post(catchErrors(controller.recordDeliveries));
  router.route('/travels/:id/deliveries/failed').post(catchErrors(controller.recordFailedDeliveries));
  router.route('/travels/:id/complete').post(catchErrors(controller.complete));
  router.route('/travels/:id/extra-stock').post(catchErrors(controller.addExtraStock));
  router.route('/travels/:id/unassign-orders').post(catchErrors(controller.unassignOrders));
  router.route('/travels/:id/extra-stock/remove').post(catchErrors(controller.removeExtraStock));
  router.route('/travels/:id/sales').post(catchErrors(controller.addTravelSale));
  router.route('/travels/:id/sales/:salesOrderId/delivered').post(catchErrors(controller.markSaleDelivered));
  router.route('/travels/:id/extra-stock/consume').post(catchErrors(controller.consumeExtraStock));
};

setupRoutes();

module.exports = router;


