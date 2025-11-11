const express = require('express');
const router = express.Router();
const testNotificationController = require('../../controllers/appControllers/testNotificationController');

// RUTAS SOLO PARA TESTING - REMOVER EN PRODUCCIÓN
router.post('/test/payment-received', testNotificationController.testPaymentReceived);
router.post('/test/stock-reserved', testNotificationController.testStockReserved);
router.post('/test/stock-shipped', testNotificationController.testStockShipped);
router.post('/test/order-status-changed', testNotificationController.testOrderStatusChanged);
router.post('/test/customer-registered', testNotificationController.testCustomerRegistered);
router.post('/test/payment-overdue', testNotificationController.testPaymentOverdue);
router.post('/test/installment-due', testNotificationController.testInstallmentDue);
router.post('/test/payment-job', testNotificationController.testPaymentJob);

module.exports = router;
