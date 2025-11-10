const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema(
  {
    // Tipo de notificación
    type: {
      type: String,
      enum: [
        'ORDER_CREATED',
        'ORDER_STATUS_CHANGED', 
        'PAYMENT_RECEIVED',
        'PAYMENT_OVERDUE',
        'INSTALLMENT_DUE',
        'STOCK_RESERVED',
        'STOCK_SHIPPED',
        'CUSTOMER_REGISTERED',
        'SELLER_ASSIGNED'
      ],
      required: true,
    },

    // Título y mensaje de la notificación
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },

    // Referencias a entidades relacionadas
    relatedEntity: {
      entityType: {
        type: String,
        enum: ['SalesOrder', 'Payment', 'Installment', 'Customer', 'Seller', 'StockReservation'],
        required: true,
      },
      entityId: {
        type: Schema.Types.ObjectId,
        required: true,
      },
    },

    // Datos adicionales específicos del contexto
    metadata: {
      salesOrderCode: String,
      customerName: String,
      amount: Number,
      dueDate: Date,
      previousStatus: String,
      newStatus: String,
    },

    // Estado de la notificación
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },

    // Prioridad
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },

    // Control de expiración
    expiresAt: {
      type: Date,
    },

    // Audit fields
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    // Índices para mejorar performance
    indexes: [
      { createdAt: -1 },
      { isRead: 1 },
      { type: 1 },
      { 'relatedEntity.entityType': 1, 'relatedEntity.entityId': 1 }
    ]
  }
);

module.exports = mongoose.model('Notification', NotificationSchema);
