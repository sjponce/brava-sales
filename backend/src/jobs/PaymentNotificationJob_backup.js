const mongoose = require('mongoose');
const NotificationHelpers = require('../helpers/NotificationHelpers');

const Installment = mongoose.model('Installment');

/**
 * Job para verificar cuotas vencidas y próximas a vencer
 * Se puede ejecutar diariamente via cron job
 */
class PaymentNotificationJob {

  /**
   * Ejecuta la verificación de pagos vencidos y próximos a vencer
   */
  static async run() {
    console.log('Starting payment notification job...');
    
    try {
      await this.checkOverduePayments();
      await this.checkUpcomingPayments();
      console.log('Payment notification job completed successfully');
    } catch (error) {
      console.error('Error in payment notification job:', error);
    }
  }

  /**
   * Verifica pagos vencidos
   */
  static async checkOverduePayments() {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Buscar cuotas vencidas que no estén pagadas completamente
      const overdueInstallments = await Installment.find({
        dueDate: { $lt: today },
        status: { $in: ['Pending', 'Overdue'] },
        removed: false
      }).populate({
        path: 'salesOrder',
        populate: {
          path: 'customer'
        }
      });

      console.log(`Found ${overdueInstallments.length} overdue installments`);

      let notificationsSent = 0;
      const maxNotificationsPerRun = 20; // Máximo 20 notificaciones por ejecución

      for (const installment of overdueInstallments) {
        // Salir si ya se enviaron muchas notificaciones
        if (notificationsSent >= maxNotificationsPerRun) {
          console.log(`Notification limit reached: ${maxNotificationsPerRun}. Stopping for this run.`);
          break;
        }

        // Actualizar estado si no está marcado como vencido
        if (installment.status === 'Pending') {
          installment.status = 'Overdue';
          await installment.save();
        }

        // Enviar notificación solo una vez por semana para evitar spam
        const daysSinceCreated = Math.floor((today - installment.createdAt) / (1000 * 60 * 60 * 24));
        
        // Enviar notificación si es múltiplo de 7 días (semanal)
        if (daysSinceCreated % 7 === 0) {
          await NotificationHelpers.onPaymentOverdue(
            installment,
            installment.salesOrder
          );
          notificationsSent++;
          console.log(`Notification sent for overdue installment: ${installment.salesOrder.salesOrderCode} (${notificationsSent}/${maxNotificationsPerRun})`);
        }
      }

      console.log(`Total overdue notifications sent: ${notificationsSent}`);

    } catch (error) {
      console.error('Error checking overdue payments:', error);
    }
  }

  /**
   * Verifica pagos próximos a vencer
   */
  static async checkUpcomingPayments() {
    try {
      const today = new Date();
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(today.getDate() + 3);

      // Buscar cuotas que vencen en los próximos 3 días
      const upcomingInstallments = await Installment.find({
        dueDate: { 
          $gte: today,
          $lte: threeDaysFromNow
        },
        status: 'Pending',
        removed: false
      }).populate({
        path: 'salesOrder',
        populate: {
          path: 'customer'
        }
      });

      console.log(`Found ${upcomingInstallments.length} upcoming installments`);

      for (const installment of upcomingInstallments) {
        const daysUntilDue = Math.ceil((installment.dueDate - today) / (1000 * 60 * 60 * 24));
        
        // Enviar notificación para pagos que vencen en 1 o 3 días
        if (daysUntilDue === 1 || daysUntilDue === 3) {
          await NotificationHelpers.onInstallmentDueSoon(
            installment,
            installment.salesOrder,
            daysUntilDue
          );
        }
      }

    } catch (error) {
      console.error('Error checking upcoming payments:', error);
    }
  }

  /**
   * Limpia notificaciones antiguas
   */
  static async cleanupOldNotifications() {
    try {
      const NotificationService = require('../services/NotificationService');
      await NotificationService.cleanupExpiredNotifications();
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

module.exports = PaymentNotificationJob;
