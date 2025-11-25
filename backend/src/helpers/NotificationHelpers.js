const NotificationService = require('../services/NotificationService');

/**
 * Helpers para disparar notificaciones en eventos específicos del negocio
 */
class NotificationHelpers {

  /**
   * Extrae el ID del vendedor responsable
   * Maneja tanto objetos User como IDs de ObjectId
   */
  static extractSellerId(responsible) {
    if (!responsible) return null;
    
    // Si es un ObjectId o string, retornar directamente
    if (typeof responsible === 'string') return responsible;
    if (responsible._id) return responsible._id;
    
    return responsible;
  }

  /**
   * Notificación cuando se crea una nueva orden de venta
   */
  static async onOrderCreated(salesOrder, createdBy = null) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);

      await NotificationService.createNotification({
        type: 'ORDER_CREATED',
        title: `Nueva orden de venta: ${salesOrder.salesOrderCode}`,
        message: `${customer.name} ha realizado un pedido por $${salesOrder.finalAmount.toLocaleString()}`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          amount: salesOrder.finalAmount,
          sellerId: sellerId,
        },
        priority: 'high',
        createdBy
      });

      console.log(`Notification sent for new order: ${salesOrder.salesOrderCode}`);
    } catch (error) {
      console.error('Error sending order created notification:', error);
    }
  }

  /**
   * Notificación cuando cambia el estado de una orden
   */
  static async onOrderStatusChanged(salesOrder, previousStatus, newStatus, changedBy = null) {
    try {
      const statusTranslations = {
        'Pending': 'Pendiente',
        'Processing': 'En proceso',
        'Shipped': 'Enviado',
        'Delivered': 'Entregado',
        'Cancelled': 'Cancelado',
        'Reserved': 'Reservado'
      };

      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);

      await NotificationService.createNotification({
        type: 'ORDER_STATUS_CHANGED',
        title: `Cambio de estado: ${salesOrder.salesOrderCode}`,
        message: `El pedido ${salesOrder.salesOrderCode} cambió de "${statusTranslations[previousStatus] || previousStatus}" a "${statusTranslations[newStatus] || newStatus}"`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          previousStatus,
          newStatus,
          amount: salesOrder.finalAmount
        },
        priority: newStatus === 'Cancelled' ? 'high' : 'medium',
        createdBy: changedBy
      });

      console.log(`Notification sent for status change: ${salesOrder.salesOrderCode} (${previousStatus} -> ${newStatus})`);
    } catch (error) {
      console.error('Error sending status change notification:', error);
    }
  }

  /**
   * Notificación cuando se recibe un pago
   */
  static async onPaymentReceived(payment, installment, salesOrder, receivedBy = null) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);

      await NotificationService.createNotification({
        type: 'PAYMENT_RECEIVED',
        title: `Pago recibido: ${salesOrder.salesOrderCode}`,
        message: `${customer.name} realizó un pago de $${payment.amount.toLocaleString()} para la cuota ${installment.installmentNumber} del pedido ${salesOrder.salesOrderCode}`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          amount: payment.amount,
          installmentNumber: installment.installmentNumber,
          paymentMethod: payment.paymentMethod
        },
        priority: 'medium',
        createdBy: receivedBy
      });

      console.log(`Notification sent for payment received: ${salesOrder.salesOrderCode}`);
    } catch (error) {
      console.error('Error sending payment received notification:', error);
    }
  }

  /**
   * Notificación para pagos vencidos - Agrupa múltiples cuotas por pedido
   */
  static async onPaymentOverdue({ salesOrder, overdueInstallments, customer }) {
    try {
      const sellerId = this.extractSellerId(salesOrder.responsible);
      
      // Calcular información agregada
      const totalOverdueAmount = overdueInstallments.reduce((sum, inst) => sum + inst.amount, 0);
      const oldestInstallment = overdueInstallments.reduce((oldest, current) => 
        current.dueDate < oldest.dueDate ? current : oldest
      );
      const daysPastDue = Math.floor((new Date() - oldestInstallment.dueDate) / (1000 * 60 * 60 * 24));
      
      // Generar mensaje según cantidad de cuotas
      let message;
      if (overdueInstallments.length === 1) {
        const installment = overdueInstallments[0];
        message = `La cuota ${installment.installmentNumber} de $${installment.amount.toLocaleString()} del pedido ${salesOrder.salesOrderCode} venció hace ${daysPastDue} días`;
      } else {
        const installmentNumbers = overdueInstallments.map(inst => inst.installmentNumber).sort().join(', ');
        message = `El pedido ${salesOrder.salesOrderCode} tiene ${overdueInstallments.length} cuotas vencidas (${installmentNumbers}) por un total de $${totalOverdueAmount.toLocaleString()}. La más antigua venció hace ${daysPastDue} días`;
      }

      await NotificationService.createNotification({
        type: 'PAYMENT_OVERDUE',
        title: `Pago vencido: ${salesOrder.salesOrderCode}`,
        message,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          totalOverdueAmount,
          overdueInstallmentsCount: overdueInstallments.length,
          installmentNumbers: overdueInstallments.map(inst => inst.installmentNumber),
          oldestDueDate: oldestInstallment.dueDate,
          daysPastDue,
          overdueInstallmentIds: overdueInstallments.map(inst => inst._id)
        },
        priority: daysPastDue > 30 ? 'urgent' : 'high',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expira en 7 días
      });

      console.log(`Notification sent for overdue payments: ${salesOrder.salesOrderCode} - ${overdueInstallments.length} installments, ${daysPastDue} days overdue`);
    } catch (error) {
      console.error('Error sending overdue payment notification:', error);
    }
  }

  /**
   * Notificación para cuotas próximas a vencer
   */
  static async onInstallmentDueSoon(installment, salesOrder, daysUntilDue = 3) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);

      await NotificationService.createNotification({
        type: 'INSTALLMENT_DUE',
        title: `Cuota próxima a vencer: ${salesOrder.salesOrderCode}`,
        message: `La cuota ${installment.installmentNumber} de $${installment.amount.toLocaleString()} del pedido ${salesOrder.salesOrderCode} vence en ${daysUntilDue} días`,
        relatedEntity: {
          entityType: 'Installment',
          entityId: installment._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          amount: installment.amount,
          installmentNumber: installment.installmentNumber,
          dueDate: installment.dueDate,
          daysUntilDue
        },
        priority: daysUntilDue <= 1 ? 'high' : 'medium',
        expiresAt: installment.dueDate
      });

      console.log(`Notification sent for upcoming due installment: ${salesOrder.salesOrderCode} - ${daysUntilDue} days`);
    } catch (error) {
      console.error('Error sending installment due notification:', error);
    }
  }

  /**
   * Notificación cuando se reserva stock
   */
  static async onStockReserved(stockReservation, salesOrder, reservedBy = null) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);
      const productCount = stockReservation.products.length;

      await NotificationService.createNotification({
        type: 'STOCK_RESERVED',
        title: `Stock reservado: ${salesOrder.salesOrderCode}`,
        message: `Se reservó stock para ${productCount} producto(s) del pedido ${salesOrder.salesOrderCode} de ${customer.name}`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          productCount
        },
        priority: 'medium',
        createdBy: reservedBy
      });

      console.log(`Notification sent for stock reserved: ${salesOrder.salesOrderCode}`);
    } catch (error) {
      console.error('Error sending stock reserved notification:', error);
    }
  }

  /**
   * Notificación cuando se envía stock
   */
  static async onStockShipped(stockReservation, salesOrder, shippedBy = null) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);

      await NotificationService.createNotification({
        type: 'STOCK_SHIPPED',
        title: `Envío realizado: ${salesOrder.salesOrderCode}`,
        message: `El pedido ${salesOrder.salesOrderCode} ha sido enviado`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId
        },
        priority: 'medium',
        createdBy: shippedBy
      });

      console.log(`Notification sent for stock shipped: ${salesOrder.salesOrderCode}`);
    } catch (error) {
      console.error('Error sending stock shipped notification:', error);
    }
  }

  /**
   * Notificación cuando se registra un nuevo cliente
   */
  static async onCustomerRegistered(customer, registeredBy = null) {
    try {
      await NotificationService.createNotification({
        type: 'CUSTOMER_REGISTERED',
        title: 'Nuevo cliente registrado',
        message: `Se registró un nuevo cliente: ${customer.name}`,
        relatedEntity: {
          entityType: 'Customer',
          entityId: customer._id
        },
        metadata: {
          customerName: customer.name,
          customerId: customer._id,
          email: customer.email
        },
        priority: 'low',
        createdBy: registeredBy
      });

      console.log(`Notification sent for new customer: ${customer.name}`);
    } catch (error) {
      console.error('Error sending customer registered notification:', error);
    }
  }

  /**
   * Notificación cuando se asigna un vendedor
   */
  static async onSellerAssigned(seller, assignedBy = null) {
    try {
      await NotificationService.createNotification({
        type: 'SELLER_ASSIGNED',
        title: 'Nuevo vendedor asignado',
        message: `Se asignó un nuevo vendedor: ${seller.name} ${seller.surname}`,
        relatedEntity: {
          entityType: 'Seller',
          entityId: seller._id
        },
        metadata: {
          sellerName: `${seller.name} ${seller.surname}`,
          sellerId: seller.user,
          email: seller.user.email
        },
        priority: 'low',
        createdBy: assignedBy
      });

      console.log(`Notification sent for seller assigned: ${seller.name} ${seller.surname}`);
    } catch (error) {
      console.error('Error sending seller assigned notification:', error);
    }
  }

  /**
   * Notificación cuando se crea un nuevo pago (pendiente de aprobación)
   */
  static async onPaymentCreated(payment, installment, salesOrder, createdBy = null) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);
      const requiresApproval = payment.paymentMethod !== 'MercadoPago' || payment.status === 'Pending';

      await NotificationService.createNotification({
        type: 'PAYMENT_CREATED',
        title: `Nuevo pago: ${salesOrder.salesOrderCode}`,
        message: `Se registró un nuevo pago de $${payment.amount.toLocaleString()} para la cuota ${installment.installmentNumber} del pedido ${salesOrder.salesOrderCode} via ${payment.paymentMethod}${requiresApproval ? ' (Pendiente de aprobación)' : ''}`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          amount: payment.amount,
          installmentNumber: installment.installmentNumber,
          installmentAmount: installment.amount,
          paymentMethod: payment.paymentMethod,
          paymentStatus: payment.status,
          requiresApproval,
          dueDate: installment.dueDate
        },
        priority: requiresApproval ? 'high' : 'medium',
        createdBy
      });

      console.log(`Notification sent for payment created: ${salesOrder.salesOrderCode} - Installment ${installment.installmentNumber}`);
    } catch (error) {
      console.error('Error sending payment created notification:', error);
    }
  }

  /**
   * Notificación cuando una cuota se paga completamente
   */
  static async onInstallmentFullyPaid(installment, salesOrder, paidBy = null) {
    try {
      const customer = salesOrder.customer;
      const sellerId = this.extractSellerId(salesOrder.responsible);

      await NotificationService.createNotification({
        type: 'INSTALLMENT_FULLY_PAID',
        title: `Cuota pagada: ${salesOrder.salesOrderCode}`,
        message: `La cuota ${installment.installmentNumber} de $${installment.amount.toLocaleString()} del pedido ${salesOrder.salesOrderCode} ha sido completamente pagada`,
        relatedEntity: {
          entityType: 'SalesOrder',
          entityId: salesOrder._id
        },
        metadata: {
          salesOrderCode: salesOrder.salesOrderCode,
          customerName: customer.name,
          customerId: customer._id,
          sellerId: sellerId,
          amount: installment.amount,
          installmentNumber: installment.installmentNumber,
          paidDate: installment.totalPaymentDate
        },
        priority: 'low',
        createdBy: paidBy
      });

      console.log(`Notification sent for installment fully paid: ${salesOrder.salesOrderCode} - Installment ${installment.installmentNumber}`);
    } catch (error) {
      console.error('Error sending installment fully paid notification:', error);
    }
  }
}

module.exports = NotificationHelpers;
