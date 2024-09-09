const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockReservationSchema = new Schema(
  {
    sizes: [
      {
        size: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
        pending: {
            type: Number,
            default: 0,
        },
    },
    ],
    status: {
        type: String,
        enum: ['Reserved', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Reserved',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockReservation', StockReservationSchema);
