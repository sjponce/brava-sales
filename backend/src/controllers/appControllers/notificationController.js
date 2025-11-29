const NotificationService = require('../../services/NotificationService');

/**
 * Controlador para manejar las operaciones de notificaciones
 */
const NotificationController = {

  /**
   * Obtiene las notificaciones del usuario actual
   * GET /api/notifications
   */
  async getUserNotifications(req, res) {
    try {
      const userId = req.user._id; // Cambiado de req.admin a req.user
      const { 
        page = 1, 
        limit = 20, 
        unreadOnly = false, 
        type = null 
      } = req.query;

      const result = await NotificationService.getUserNotifications(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
        unreadOnly: unreadOnly === 'true',
        type
      });

      if (result.success) {
        return res.status(200).json({
          success: true,
          result: result.notifications,
          pagination: result.pagination,
          totalUnread: result.totalUnread,
          message: 'Notificaciones obtenidas correctamente'
        });
      } else {
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Error al obtener las notificaciones',
          error: result.error
        });
      }

    } catch (error) {
      console.error('Error in getUserNotifications:', error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  /**
   * Obtiene el conteo de notificaciones no leídas
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user._id;
      const count = await NotificationService.getUnreadCount(userId);

      return res.status(200).json({
        success: true,
        result: { count },
        message: 'Conteo de notificaciones no leídas obtenido correctamente'
      });

    } catch (error) {
      console.error('Error in getUnreadCount:', error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error al obtener el conteo de notificaciones',
        error: error.message
      });
    }
  },

  /**
   * Marca notificaciones como leídas
   * POST /api/notifications/mark-read
   * Body: { notificationIds?: string[] } - Si no se proporcionan IDs, marca todas como leídas
   */
  async markAsRead(req, res) {
    try {
      const userId = req.user._id;
      const { notificationIds } = req.body;

      const result = await NotificationService.markAsRead(userId, notificationIds);

      if (result.success) {
        return res.status(200).json({
          success: true,
          result: { modifiedCount: result.modifiedCount },
          message: `${result.modifiedCount} notificación(es) marcada(s) como leída(s)`
        });
      } else {
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Error al marcar las notificaciones como leídas',
          error: result.error
        });
      }

    } catch (error) {
      console.error('Error in markAsRead:', error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  /**
   * Obtiene estadísticas de notificaciones para el usuario
   * GET /api/notifications/stats
   */
  async getNotificationStats(req, res) {
    try {
      const userId = req.user._id;
      
      // Obtener conteos por tipo de notificación
      const mongoose = require('mongoose');
      const NotificationRecipient = mongoose.model('NotificationRecipient');
      
      const stats = await NotificationRecipient.aggregate([
        {
          $match: {
            recipient: mongoose.Types.ObjectId(userId),
            removed: false
          }
        },
        {
          $lookup: {
            from: 'notifications',
            localField: 'notification',
            foreignField: '_id',
            as: 'notificationData'
          }
        },
        {
          $unwind: '$notificationData'
        },
        {
          $group: {
            _id: {
              type: '$notificationData.type',
              isRead: '$isRead'
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: '$_id.type',
            total: { $sum: '$count' },
            unread: {
              $sum: {
                $cond: [{ $eq: ['$_id.isRead', false] }, '$count', 0]
              }
            },
            read: {
              $sum: {
                $cond: [{ $eq: ['$_id.isRead', true] }, '$count', 0]
              }
            }
          }
        },
        {
          $sort: { total: -1 }
        }
      ]);

      return res.status(200).json({
        success: true,
        result: stats,
        message: 'Estadísticas de notificaciones obtenidas correctamente'
      });

    } catch (error) {
      console.error('Error in getNotificationStats:', error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error al obtener las estadísticas',
        error: error.message
      });
    }
  },

  /**
   * Crea una notificación manual (solo para admins)
   * POST /api/notifications/create
   */
  async createNotification(req, res) {
    try {
      // Verificar que el usuario sea admin
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          result: null,
          message: 'No tienes permisos para crear notificaciones'
        });
      }

      const {
        type,
        title,
        message,
        relatedEntity,
        metadata = {},
        priority = 'medium',
        customRecipients = null
      } = req.body;

      // Validaciones básicas
      if (!type || !title || !message) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'Tipo, título y mensaje son requeridos'
        });
      }

      const result = await NotificationService.createNotification({
        type,
        title,
        message,
        relatedEntity,
        metadata,
        priority,
        customRecipients,
        createdBy: req.user._id
      });

      if (result.success) {
        return res.status(201).json({
          success: true,
          result: result.notification,
          message: `Notificación creada para ${result.recipientCount} usuario(s)`
        });
      } else {
        return res.status(500).json({
          success: false,
          result: null,
          message: 'Error al crear la notificación',
          error: result.error
        });
      }

    } catch (error) {
      console.error('Error in createNotification:', error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  },

  /**
   * Eliminar (soft delete) una notificación específica para el usuario
   * DELETE /api/notifications/:notificationId
   */
  async deleteNotification(req, res) {
    try {
      const userId = req.user._id;
      const { notificationId } = req.params;

      if (!notificationId) {
        return res.status(400).json({
          success: false,
          result: null,
          message: 'ID de notificación requerido'
        });
      }

      const result = await NotificationService.deleteNotificationForUser(userId, notificationId);

      if (result.success) {
        return res.status(200).json({
          success: true,
          result: null,
          message: 'Notificación eliminada correctamente'
        });
      } else {
        return res.status(400).json({
          success: false,
          result: null,
          message: result.error || 'Error al eliminar la notificación'
        });
      }

    } catch (error) {
      console.error('Error in deleteNotification:', error);
      return res.status(500).json({
        success: false,
        result: null,
        message: 'Error interno del servidor',
        error: error.message
      });
    }
  }

};

module.exports = NotificationController;
