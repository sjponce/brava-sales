const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationRecipientSchema = new Schema(
  {
    notification: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },
    
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Estado específico para cada usuario
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },

    // Para notificaciones que requieren acción
    actionRequired: {
      type: Boolean,
      default: false,
    },
    actionTaken: {
      type: Boolean,
      default: false,
    },
    actionTakenAt: {
      type: Date,
    },

    // Control de entrega
    deliveryStatus: {
      type: String,
      enum: ['pending', 'delivered', 'failed'],
      default: 'pending',
    },
    deliveredAt: {
      type: Date,
    },

    // Canales de notificación
    channels: {
      inApp: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },

    removed: {
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    indexes: [
      { recipient: 1, isRead: 1 },
      { notification: 1, recipient: 1 },
      { createdAt: -1 },
      { deliveryStatus: 1 }
    ]
  }
);

// Índice compuesto para consultas eficientes del inbox
NotificationRecipientSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('NotificationRecipient', NotificationRecipientSchema);
