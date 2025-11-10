const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/appControllers/notificationController');

// Middleware de autenticación - ajustar según tu implementación
// const { authenticateToken } = require('../../middlewares/auth');

// Obtener notificaciones del usuario
router.get('/', notificationController.getUserNotifications);

// Obtener conteo de notificaciones no leídas
router.get('/unread-count', notificationController.getUnreadCount);

// Obtener estadísticas de notificaciones
router.get('/stats', notificationController.getNotificationStats);

// Marcar notificaciones como leídas
router.post('/mark-read', notificationController.markAsRead);

// Eliminar una notificación específica
router.delete('/:notificationId', notificationController.deleteNotification);

// Crear notificación manual (solo admins)
router.post('/create', notificationController.createNotification);

module.exports = router;
