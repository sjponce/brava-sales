const express = require('express');

const { catchErrors } = require('@/handlers/errorHandlers');

const router = express.Router();

const userController = require('@/controllers/coreControllers/userController');

// //_______________________________ User management_______________________________

router.route('/user/read/:id').get(catchErrors(userController.read));

router.route('/user/updatepassword/:id').patch(catchErrors(userController.updatePassword));

router.route('/user/create').post(catchErrors(userController.create));

router.route('/user/disable/:id').patch(catchErrors(userController.disable));

router.route('/user/update/:id').patch(catchErrors(userController.update));


//_______________________________ Admin Profile _______________________________

module.exports = router;
