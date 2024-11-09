const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockReservationSchema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        idStock: {
          type: Number,
          required: true,
        },
        stockId: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        sizes: [
          {
            size: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
              min: 1,
            },
            pending: {
              type: Number,
              min: 0,
            },
          },
        ],
      },
    ],
    salesOrder: {
      type: Schema.Types.ObjectId,
      ref: 'SalesOrder',
      required: true,
    },
    status: {
      type: String,
      enum: ['Reserved', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Reserved',
    },
    departureDate: {
      type: Date,
    },
    arrivalDate: {
      type: Date,
    },
    shippingMethod: {
      type: String,
      enum: ['oca', 'andreani', 'officePickup', 'tripDelivery'],
    },
    shippingCode: {
      type: String,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockReservation', StockReservationSchema);
