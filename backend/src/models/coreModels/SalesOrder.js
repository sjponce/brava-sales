const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SalesOrderSchema = new Schema(
  {
    salesOrderCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^OV-\d+$/.test(v);
        },
        message: (props) =>
          `${props.value} El ID no es valido.`,
      },
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
    products: [
      {
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
        sizes: [
          {
            type: Number,
            ref: 'Size',
            required: true,
          },
        ],
      },
    ],
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
      street: {
        type: String,
        required: true,
      },
      streetNumber: {
        type: Number,
        required: true,
      },
      floor: {
        type: String,
      },
      apartment: {
        type: String,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      zipCode: {
        type: String,
        required: true,
      },
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
