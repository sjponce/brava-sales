const cron = require('node-cron');
const PaymentNotificationJob = require('../jobs/PaymentNotificationJob');

/**
 * Configuración de trabajos programados para el sistema de notificaciones
 */
class NotificationScheduler {

  /**
   * Inicia todos los trabajos programados
   */
  static start() {
    console.log('Starting notification scheduler...');
    
    // Ejecutar verificación de pagos vencidos todos los días a las 9:00 AM
    cron.schedule('0 9 * * *', async () => {
      console.log('Running daily payment notification job...');
      try {
        await PaymentNotificationJob.run();
      } catch (error) {
        console.error('Error in scheduled payment notification job:', error);
      }
    }, {
      timezone: "America/Argentina/Buenos_Aires" // Ajustar según tu zona horaria
    });

    // Limpiar notificaciones antiguas una vez por semana (domingos a las 2:00 AM)
    cron.schedule('0 2 * * 0', async () => {
      console.log('Running weekly notification cleanup...');
      try {
        await PaymentNotificationJob.cleanupOldNotifications();
      } catch (error) {
        console.error('Error in scheduled notification cleanup:', error);
      }
    }, {
      timezone: "America/Argentina/Buenos_Aires"
    });

    // Verificar pagos próximos a vencer (cada 6 horas)
    cron.schedule('0 */6 * * *', async () => {
      console.log('Running upcoming payments check...');
      try {
        await PaymentNotificationJob.checkUpcomingPayments();
      } catch (error) {
        console.error('Error in upcoming payments check:', error);
      }
    }, {
      timezone: "America/Argentina/Buenos_Aires"
    });

    console.log('Notification scheduler started successfully');
  }

  /**
   * Para desarrollo - ejecutar job inmediatamente
   */
  static async runNow() {
    console.log('Running payment notification job immediately...');
    await PaymentNotificationJob.run();
  }
}

module.exports = NotificationScheduler;
