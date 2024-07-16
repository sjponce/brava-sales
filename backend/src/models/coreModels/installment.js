const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstallmentSchema = new Schema(
  {
    salesOrderNumber: {
      type: String,
      required: true,
      ref: 'SalesOrder'
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