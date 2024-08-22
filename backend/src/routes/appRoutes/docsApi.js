const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const createDocMiddleware = require('@/controllers/middlewaresControllers/createDocMiddleware');

const setupRoutes = async () => {
  const docMiddleware = createDocMiddleware();

  router.route('/docs/test').get(catchErrors(docMiddleware.docTest));

};

setupRoutes();

module.exports = router;
