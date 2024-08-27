/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Debit Card', 'MercadoPago', 'Deposit'],
    },
    mercadoPagoData: {
      collection_id: {
        type: String,
      },
      collection_status: {
        type: String,
      },
      payment_id: {
        type: String,
      },
      status: {
        type: String,
      },
      external_reference: {
        type: String,
      },
      payment_type: {
        type: String,
      },
      merchant_order_id: {
        type: String,
      },
      preference_id: {
        type: String,
      },
      site_id: {
        type: String,
      },
      processing_mode: {
        type: String
      },
      merchant_account_id: {
        type: String,
      }
    },
    photo: { type: String },
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', PaymentSchema);