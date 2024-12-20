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
        color: {
          type: String,
          required: true,
        },
        idStock: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
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
          },
        ],
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    finalAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      validate: {
        validator: function (v) {
          return v >= 0 && v <= 100;
        },
        message: (props) =>
          `${props.value} El porcentaje debe ser entre 0 y 100.`,
      },
    },
    promotion: {
      type: Schema.Types.ObjectId,
      ref: 'Promotion',
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Partially shipped', 'Partially delivered', 'Cancelled', 'Partially reserved', 'Reserved'],
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
    responsible: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    ecommerce: {
      type: Boolean,
      default: false,
    },
    shippingMethod: {
      type: String,
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
