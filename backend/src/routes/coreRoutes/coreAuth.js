const express = require('express');
const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const userAuth = require('@/controllers/coreControllers/userAuth');

const setupRoutes = async () => {
  router.route('/login').post(catchErrors(userAuth.login));

  router.route('/forgetpassword').post(catchErrors(userAuth.forgetPassword));
  router.route('/resetpassword').post(catchErrors(userAuth.resetPassword));

  router.route('/logout').post(userAuth.isValidAuthToken, catchErrors(userAuth.logout));
};

setupRoutes();

module.exports = router;