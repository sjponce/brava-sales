const express = require('express');

const router = express.Router();

const { catchErrors } = require('@/handlers/errorHandlers');
const adminAuth = require('@/controllers/coreControllers/adminAuth');
const userAuth = require('@/controllers/coreControllers/userAuth');


//router.route('/login').post(catchErrors(adminAuth.login));



// router.route('/forgetpassword').post(catchErrors(adminAuth.forgetPassword));
// router.route('/resetpassword').post(catchErrors(adminAuth.resetPassword));

// router.route('/logout').post(userAuth.isValidAuthToken, catchErrors(adminAuth.logout));

router.route('/login').post(catchErrors(userAuth.login));

router.route('/forgetpassword').post(catchErrors(userAuth.forgetPassword));
router.route('/resetpassword').post(catchErrors(userAuth.resetPassword));

router.route('/logout').post(userAuth.isValidAuthToken, catchErrors(userAuth.logout));

module.exports = router;
