const NotificationHelpers = require('../../helpers/NotificationHelpers');
const mongoose = require('mongoose');

/**
 * Controlador para probar diferentes tipos de notificaciones
 * SOLO PARA DESARROLLO/TESTING
 */
const testNotifications = {

  /**
   * Probar notificación de pago recibido
   */
  async testPaymentReceived(req, res) {
    try {
      // Datos de ejemplo para testing
      const mockPayment = {
        _id: new mongoose.Types.ObjectId(),
        amount: 150000,
        paymentMethod: 'transfer'
      };

      const mockInstallment = {
        _id: new mongoose.Types.ObjectId(),
        installmentNumber: 2,
        amount: 150000
      };

      const mockSalesOrder = {
        _id: new mongoose.Types.ObjectId(),
        salesOrderCode: 'SO-TEST-001',
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: 'Juan Pérez'
        },
        responsible: new mongoose.Types.ObjectId()
      };

      await NotificationHelpers.onPaymentReceived(
        mockPayment,
        mockInstallment,
        mockSalesOrder,
        req.admin?._id || req.user?._id
      );

      return res.status(200).json({
        success: true,
        message: 'Notificación de pago recibido enviada correctamente'
      });

    } catch (error) {
      console.error('Error testing payment received notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de pago recibido',
        error: error.message
      });
    }
  },

  /**
   * Probar notificación de stock reservado
   */
  async testStockReserved(req, res) {
    try {
      const mockStockReservation = {
        _id: new mongoose.Types.ObjectId(),
        products: [
          { productId: 'PROD-001', quantity: 2 },
          { productId: 'PROD-002', quantity: 1 }
        ]
      };

      const mockSalesOrder = {
        _id: new mongoose.Types.ObjectId(),
        salesOrderCode: 'SO-TEST-002',
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: 'María García'
        },
        responsible: new mongoose.Types.ObjectId()
      };

      await NotificationHelpers.onStockReserved(
        mockStockReservation,
        mockSalesOrder,
        req.admin?._id || req.user?._id
      );

      return res.status(200).json({
        success: true,
        message: 'Notificación de stock reservado enviada correctamente'
      });

    } catch (error) {
      console.error('Error testing stock reserved notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de stock reservado',
        error: error.message
      });
    }
  },

  /**
   * Probar notificación de envío
   */
  async testStockShipped(req, res) {
    try {
      const mockStockReservation = {
        _id: new mongoose.Types.ObjectId()
      };

      const mockSalesOrder = {
        _id: new mongoose.Types.ObjectId(),
        salesOrderCode: 'SO-TEST-003',
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: 'Carlos López'
        },
        responsible: new mongoose.Types.ObjectId()
      };

      await NotificationHelpers.onStockShipped(
        mockStockReservation,
        mockSalesOrder,
        req.admin?._id || req.user?._id
      );

      return res.status(200).json({
        success: true,
        message: 'Notificación de envío enviada correctamente'
      });

    } catch (error) {
      console.error('Error testing stock shipped notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de envío',
        error: error.message
      });
    }
  },

  /**
   * Probar notificación de cambio de estado
   */
  async testOrderStatusChanged(req, res) {
    try {
      const mockSalesOrder = {
        _id: new mongoose.Types.ObjectId(),
        salesOrderCode: 'SO-TEST-004',
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: 'Ana Martínez'
        },
        responsible: new mongoose.Types.ObjectId(),
        finalAmount: 350000
      };

      await NotificationHelpers.onOrderStatusChanged(
        mockSalesOrder,
        'Pending',
        'Processing',
        req.admin?._id || req.user?._id
      );

      return res.status(200).json({
        success: true,
        message: 'Notificación de cambio de estado enviada correctamente'
      });

    } catch (error) {
      console.error('Error testing order status change notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de cambio de estado',
        error: error.message
      });
    }
  },

  /**
   * Probar notificación de cliente registrado
   */
  async testCustomerRegistered(req, res) {
    try {
      const mockCustomer = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Pedro Ramírez',
        email: 'pedro.ramirez@email.com'
      };

      await NotificationHelpers.onCustomerRegistered(
        mockCustomer,
        req.admin?._id || req.user?._id
      );

      return res.status(200).json({
        success: true,
        message: 'Notificación de cliente registrado enviada correctamente'
      });

    } catch (error) {
      console.error('Error testing customer registered notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de cliente registrado',
        error: error.message
      });
    }
  },

  /**
   * Ejecutar manualmente el job de pagos vencidos
   */
  async testPaymentJob(req, res) {
    try {
      const PaymentNotificationJob = require('../../jobs/PaymentNotificationJob');
      
      console.log('Ejecutando job de notificaciones de pago manualmente...');
      await PaymentNotificationJob.run();

      return res.status(200).json({
        success: true,
        message: 'Job de notificaciones de pago ejecutado correctamente'
      });

    } catch (error) {
      console.error('Error testing payment job:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al ejecutar job de notificaciones de pago',
        error: error.message
      });
    }
  },

  /**
   * Crear notificación de pago vencido con datos simulados - Nueva versión agrupada
   */
  async testPaymentOverdue(req, res) {
    try {
      // Simular múltiples cuotas vencidas para el mismo pedido
      const mockOverdueInstallments = [
        {
          _id: new mongoose.Types.ObjectId(),
          installmentNumber: 1,
          amount: 200000,
          dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 días atrás
        },
        {
          _id: new mongoose.Types.ObjectId(),
          installmentNumber: 2,
          amount: 200000,
          dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 días atrás
        }
      ];

      const mockCustomer = {
        _id: new mongoose.Types.ObjectId(),
        name: 'Cliente Moroso'
      };

      const mockSalesOrder = {
        _id: new mongoose.Types.ObjectId(),
        salesOrderCode: 'SO-OVERDUE-001',
        customer: mockCustomer,
        responsible: new mongoose.Types.ObjectId()
      };

      await NotificationHelpers.onPaymentOverdue({
        salesOrder: mockSalesOrder,
        overdueInstallments: mockOverdueInstallments,
        customer: mockCustomer
      });

      return res.status(200).json({
        success: true,
        message: 'Notificación de pago vencido enviada correctamente (múltiples cuotas agrupadas)'
      });

    } catch (error) {
      console.error('Error testing payment overdue notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de pago vencido',
        error: error.message
      });
    }
  },

  /**
   * Crear notificación de cuota próxima a vencer
   */
  async testInstallmentDue(req, res) {
    try {
      const mockInstallment = {
        _id: new mongoose.Types.ObjectId(),
        installmentNumber: 3,
        amount: 180000,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // En 2 días
      };

      const mockSalesOrder = {
        _id: new mongoose.Types.ObjectId(),
        salesOrderCode: 'SO-DUE-001',
        customer: {
          _id: new mongoose.Types.ObjectId(),
          name: 'Cliente Próximo'
        },
        responsible: new mongoose.Types.ObjectId()
      };

      await NotificationHelpers.onInstallmentDueSoon(
        mockInstallment,
        mockSalesOrder,
        2 // días hasta vencimiento
      );

      return res.status(200).json({
        success: true,
        message: 'Notificación de cuota próxima a vencer enviada correctamente'
      });

    } catch (error) {
      console.error('Error testing installment due notification:', error);
      return res.status(500).json({
        success: false,
        message: 'Error al probar notificación de cuota próxima a vencer',
        error: error.message
      });
    }
  }
};

module.exports = testNotifications;
