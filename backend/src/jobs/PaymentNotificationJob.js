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
   * Verifica pagos vencidos - Una notificación por pedido
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
        match: { removed: false, enabled: true }, // Verificar que la orden no esté eliminada ni deshabilitada
        populate: {
          path: 'customer'
        }
      });

      console.log(`Found ${overdueInstallments.length} overdue installments`);

      // Filtrar cuotas que tengan salesOrder válido (no eliminado/deshabilitado)
      const validOverdueInstallments = overdueInstallments.filter(installment => 
        installment.salesOrder && installment.salesOrder.removed === false && installment.salesOrder.enabled === true
      );
      
      console.log(`Found ${validOverdueInstallments.length} overdue installments with valid sales orders`);

      // Agrupar cuotas por pedido (salesOrder)
      const installmentsByOrder = {};
      
      for (const installment of validOverdueInstallments) {
        const orderId = installment.salesOrder._id.toString();
        
        if (!installmentsByOrder[orderId]) {
          installmentsByOrder[orderId] = {
            salesOrder: installment.salesOrder,
            overdueInstallments: [],
            oldestInstallment: installment
          };
        }
        
        installmentsByOrder[orderId].overdueInstallments.push(installment);
        
        // Mantener referencia a la cuota más antigua para calcular días
        if (installment.createdAt < installmentsByOrder[orderId].oldestInstallment.createdAt) {
          installmentsByOrder[orderId].oldestInstallment = installment;
        }
        
        // Actualizar estado si no está marcado como vencido
        if (installment.status === 'Pending') {
          installment.status = 'Overdue';
          await installment.save();
        }
      }

      const ordersWithOverduePayments = Object.values(installmentsByOrder);
      console.log(`Found ${ordersWithOverduePayments.length} orders with overdue payments`);

      let notificationsSent = 0;
      const maxNotificationsPerRun = 20; // Máximo 20 notificaciones por ejecución

      for (const orderData of ordersWithOverduePayments) {
        // Salir si ya se enviaron muchas notificaciones
        if (notificationsSent >= maxNotificationsPerRun) {
          console.log(`Notification limit reached: ${maxNotificationsPerRun}. Stopping for this run.`);
          break;
        }

        const { salesOrder, overdueInstallments, oldestInstallment } = orderData;

        // Calcular días desde la creación de la cuota más antigua vencida
        const daysSinceCreated = Math.floor((today - oldestInstallment.createdAt) / (1000 * 60 * 60 * 24));
        const daysPastDue = Math.floor((today - oldestInstallment.dueDate) / (1000 * 60 * 60 * 24));
        
        console.log(`Processing order ${salesOrder.salesOrderCode}: ${overdueInstallments.length} overdue installments, daysSinceCreated=${daysSinceCreated}, daysPastDue=${daysPastDue}, modulo7=${daysSinceCreated % 7}`);
        
        // Enviar notificación si es múltiplo de 7 días (semanal) O si es el primer día para testing
        // MODO TESTING: Descomenta la línea siguiente para enviar todas las notificaciones
        // const shouldSendNotification = true; // TESTING MODE
        const shouldSendNotification = daysSinceCreated % 7 === 0 || daysSinceCreated === 0; // PRODUCTION MODE
        
        if (shouldSendNotification) {
          await NotificationHelpers.onPaymentOverdue({
            salesOrder,
            overdueInstallments, // Pasamos todas las cuotas vencidas del pedido
            customer: salesOrder.customer
          });
          notificationsSent++;
          console.log(`Notification sent for order with overdue payments: ${salesOrder.salesOrderCode} (${overdueInstallments.length} installments) (${notificationsSent}/${maxNotificationsPerRun})`);
        } else {
          console.log(`Skipping order ${salesOrder.salesOrderCode}: notification frequency not met (daysSinceCreated=${daysSinceCreated}, modulo7=${daysSinceCreated % 7})`);
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
        match: { removed: false, enabled: true }, // Verificar que la orden no esté eliminada ni deshabilitada
        populate: {
          path: 'customer'
        }
      });

      console.log(`Found ${upcomingInstallments.length} upcoming installments`);

      // Filtrar cuotas que tengan salesOrder válido (no eliminado/deshabilitado)
      const validUpcomingInstallments = upcomingInstallments.filter(installment => 
        installment.salesOrder && installment.salesOrder.removed === false && installment.salesOrder.enabled === true
      );
      
      console.log(`Found ${validUpcomingInstallments.length} upcoming installments with valid sales orders`);

      for (const installment of validUpcomingInstallments) {
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
      await NotificationService.cleanupOldNotifications();
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

module.exports = PaymentNotificationJob;
