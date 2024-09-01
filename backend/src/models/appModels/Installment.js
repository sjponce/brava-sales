const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InstallmentSchema = new Schema(
  {
    salesOrder: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'SalesOrder',
    },
    salesOrderCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^OV-\d+$/.test(v);
        },
        message: (props) =>
          `${props.value} El id tiene que tener un formato de OV-xxx.`,
      },
    },
    installmentNumber: {
      type: Number,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Overdue'],
      default: 'Pending',
    },
    totalPaymentDate: Date,
    removed: {
      type: Boolean,
      default: false,
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Installment', InstallmentSchema);
