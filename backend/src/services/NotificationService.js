const mongoose = require('mongoose');
const Notification = mongoose.model('Notification');
const NotificationRecipient = mongoose.model('NotificationRecipient');
const User = mongoose.model('User');

class NotificationService {
  
  /**
   * Crea una notificación y determina automáticamente los destinatarios
   */
  static async createNotification({
    type,
    title,
    message,
    relatedEntity,
    metadata = {},
    priority = 'medium',
    expiresAt = null,
    createdBy = null,
    customRecipients = null // Para casos especiales
  }) {
    try {
      // Crear la notificación base
      const notification = new Notification({
        type,
        title,
        message,
        relatedEntity,
        metadata,
        priority,
        expiresAt,
        createdBy,
      });

      await notification.save();

      // Determinar destinatarios basado en el tipo y contexto
      let recipients = [];
      
      if (customRecipients) {
        recipients = customRecipients;
      } else {
        recipients = await this.determineRecipients(type, relatedEntity, metadata);
      }

      // Crear registros de destinatarios
      const recipientPromises = recipients.map(userId => 
        new NotificationRecipient({
          notification: notification._id,
          recipient: userId,
          actionRequired: this.requiresAction(type),
          channels: this.getChannelPreferences(type, priority)
        }).save()
      );

      await Promise.all(recipientPromises);

      return {
        success: true,
        notification,
        recipientCount: recipients.length
      };

    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Determina quién debe recibir la notificación basado en reglas de negocio
   */
  static async determineRecipients(type, relatedEntity, metadata) {
    const recipients = new Set();

    try {
      switch (type) {
        case 'ORDER_CREATED': {
          // Admin: todas las órdenes
          const admins = await User.find({ role: 'admin', enabled: true });
          admins.forEach(admin => recipients.add(admin._id.toString()));
          
          // Si hay vendedor asignado, incluirlo
          if (metadata.sellerId) {
            recipients.add(metadata.sellerId.toString());
          }

          // Cliente que hizo la orden
          if (metadata.customerId) {
            const customer = await mongoose.model('Customer').findById(metadata.customerId).populate('user');
            if (customer?.user) {
              recipients.add(customer.user._id.toString());
            }
          }
          break;
        }

        case 'ORDER_STATUS_CHANGED': {
          // Similar a ORDER_CREATED pero puede incluir más contexto
          const orderAdmins = await User.find({ role: 'admin', enabled: true });
          orderAdmins.forEach(admin => recipients.add(admin._id.toString()));
          
          if (metadata.sellerId) {
            recipients.add(metadata.sellerId.toString());
          }
          
          if (metadata.customerId) {
            const customer = await mongoose.model('Customer').findById(metadata.customerId).populate('user');
            if (customer?.user) {
              recipients.add(customer.user._id.toString());
            }
          }
          break;
        }

        case 'PAYMENT_RECEIVED':
        case 'PAYMENT_CREATED':
        case 'PAYMENT_OVERDUE':
        case 'INSTALLMENT_DUE': {
          // Admins y vendedor responsable
          const paymentAdmins = await User.find({ role: 'admin', enabled: true });
          paymentAdmins.forEach(admin => recipients.add(admin._id.toString()));
          
          if (metadata.sellerId) {
            recipients.add(metadata.sellerId.toString());
          }

          // Para PAYMENT_CREATED, PAYMENT_OVERDUE e INSTALLMENT_DUE, también notificar al cliente
          if (type === 'PAYMENT_CREATED' || type === 'PAYMENT_OVERDUE' || type === 'INSTALLMENT_DUE') {
            if (metadata.customerId) {
              const customer = await mongoose.model('Customer').findById(metadata.customerId).populate('user');
              if (customer?.user) {
                recipients.add(customer.user._id.toString());
              }
            }
          }
          break;
        }

        case 'INSTALLMENT_FULLY_PAID': {
          // Admins, vendedor y cliente
          const installmentAdmins = await User.find({ role: 'admin', enabled: true });
          installmentAdmins.forEach(admin => recipients.add(admin._id.toString()));
          
          if (metadata.sellerId) {
            recipients.add(metadata.sellerId.toString());
          }
          
          if (metadata.customerId) {
            const customer = await mongoose.model('Customer').findById(metadata.customerId).populate('user');
            if (customer?.user) {
              recipients.add(customer.user._id.toString());
            }
          }
          break;
        }

        case 'STOCK_RESERVED':
        case 'STOCK_SHIPPED': {
          // Admins, vendedor y cliente
          const stockAdmins = await User.find({ role: 'admin', enabled: true });
          stockAdmins.forEach(admin => recipients.add(admin._id.toString()));
          
          if (metadata.sellerId) {
            recipients.add(metadata.sellerId.toString());
          }
          
          if (metadata.customerId) {
            const customer = await mongoose.model('Customer').findById(metadata.customerId).populate('user');
            if (customer?.user) {
              recipients.add(customer.user._id.toString());
            }
          }
          break;
        }

        case 'CUSTOMER_REGISTERED': {
          // Solo admins
          const customerAdmins = await User.find({ role: 'admin', enabled: true });
          customerAdmins.forEach(admin => recipients.add(admin._id.toString()));
          break;
        }

        case 'SELLER_ASSIGNED': {
          // Admins y el vendedor asignado
          const sellerAdmins = await User.find({ role: 'admin', enabled: true });
          sellerAdmins.forEach(admin => recipients.add(admin._id.toString()));
          
          if (metadata.sellerId) {
            recipients.add(metadata.sellerId.toString());
          }
          break;
        }

        default:
          console.warn(`Unknown notification type: ${type}`);
      }

      return Array.from(recipients);

    } catch (error) {
      console.error('Error determining recipients:', error);
      return [];
    }
  }

  /**
   * Determina si la notificación requiere acción del usuario
   */
  static requiresAction(type) {
    const actionRequiredTypes = [
      'PAYMENT_CREATED',
      'PAYMENT_OVERDUE',
      'INSTALLMENT_DUE',
      'ORDER_CREATED' // Podría requerir procesamiento
    ];
    
    return actionRequiredTypes.includes(type);
  }

  /**
   * Determina canales de notificación basado en tipo y prioridad
   */
  static getChannelPreferences(type, priority) {
    const channels = {
      inApp: true,
      email: false,
      sms: false
    };

    // Email para notificaciones importantes
    if (priority === 'high' || priority === 'urgent') {
      channels.email = true;
    }

    // SMS solo para muy urgente
    if (priority === 'urgent') {
      channels.sms = true;
    }

    // Tipos específicos que siempre van por email
    const emailTypes = ['PAYMENT_OVERDUE', 'ORDER_CREATED'];
    if (emailTypes.includes(type)) {
      channels.email = true;
    }

    return channels;
  }

  /**
   * Obtiene notificaciones para un usuario específico (inbox)
   */
  static async getUserNotifications(userId, options = {}) {
    const {
      page = 1,
      limit = 20,
      unreadOnly = false,
      type = null
    } = options;

    try {
      const query = { 
        recipient: userId,
        removed: false
      };

      if (unreadOnly) {
        query.isRead = false;
      }

      let notificationQuery = NotificationRecipient
        .find(query)
        .populate({
          path: 'notification',
          match: type ? { type } : {}
        })
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const notifications = await notificationQuery.exec();
      
      // Filtrar notificaciones nulas (cuando el populate no coincide)
      const validNotifications = notifications.filter(n => n.notification);

      console.log('getUserNotifications - found notifications:', validNotifications.length);
      console.log('Sample notification isRead status:', 
        validNotifications.slice(0, 2).map(n => ({
          id: n._id,
          notificationId: n.notification._id,
          isRead: n.isRead,
          title: n.notification.title?.substring(0, 30)
        }))
      );

      const total = await NotificationRecipient.countDocuments(query);

      return {
        success: true,
        notifications: validNotifications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        },
        totalUnread: await this.getUnreadCount(userId)
      };

    } catch (error) {
      console.error('Error getting user notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Marca notificaciones como leídas
   */
  static async markAsRead(userId, notificationIds = null) {
    try {
      const query = { 
        recipient: userId,
        isRead: false
      };

      if (notificationIds) {
        query.notification = { $in: notificationIds };
      }

      console.log('markAsRead query:', query);
      console.log('notificationIds received:', notificationIds);

      const result = await NotificationRecipient.updateMany(
        query,
        { 
          isRead: true,
          readAt: new Date()
        }
      );

      console.log('markAsRead result:', result);

      return {
        success: true,
        modifiedCount: result.modifiedCount
      };

    } catch (error) {
      console.error('Error marking notifications as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene el conteo de notificaciones no leídas
   */
  static async getUnreadCount(userId) {
    try {
      return await NotificationRecipient.countDocuments({
        recipient: userId,
        isRead: false,
        removed: false
      });
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  /**
   * Limpia notificaciones antiguas
   */
  static async cleanupOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      // Marcar como removidas en lugar de eliminar físicamente
      const result = await Notification.updateMany(
        { 
          createdAt: { $lt: cutoffDate },
          removed: false
        },
        { removed: true }
      );

      return {
        success: true,
        cleanedCount: result.modifiedCount
      };

    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Eliminar (soft delete) una notificación específica para un usuario
   */
  static async deleteNotificationForUser(userId, notificationId) {
    try {
      if (!mongoose.Types.ObjectId.isValid(notificationId)) {
        return {
          success: false,
          error: 'ID de notificación inválido'
        };
      }

      // Buscar y eliminar el registro de destinatario (soft delete)
      const result = await NotificationRecipient.updateOne(
        {
          notification: notificationId,
          recipient: userId,
          removed: false
        },
        {
          removed: true,
          removedAt: new Date()
        }
      );

      if (result.matchedCount === 0) {
        return {
          success: false,
          error: 'Notificación no encontrada o ya eliminada'
        };
      }

      return {
        success: true,
        message: 'Notificación eliminada correctamente'
      };

    } catch (error) {
      console.error('Error deleting notification for user:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

module.exports = NotificationService;
