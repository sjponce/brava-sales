const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesOrderSchema = new Schema(
  {
    salesOrderCode: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^OV-\d+$/.test(v);
        },
        message: props => `${props.value} is not a valid sales order ID. It should follow the pattern OV-n where n is a number.`
      }
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    products: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
      sizes: [{
        type: Number,
        ref: 'Size',
        required: true,
      }]
    }],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Unpaid', 'Partially Paid', 'Paid'],
      default: 'Unpaid',
    },
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
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

module.exports = mongoose.model('SalesOrder', SalesOrderSchema);