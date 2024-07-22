const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstallmentSchema = new Schema(
  {
    salesOrder: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SalesOrder'
    },
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
    installmentNumber: {
      type: Number,
      required: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending'
    },
    paymentDate: Date,
    paymentAmount: Number,
    removed: {
      type: Boolean,
      default: false
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Installment', InstallmentSchema);