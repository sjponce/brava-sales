const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      autopopulate: true,
      required: true,
    },
    removed: {
        type: Boolean,
        default: false,
        },
    enabled: {
        type: Boolean,
        default: true,
        },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    documentType: {
      type: String,
      required: true,
      enum: ['DNI', 'CUIT'],
    },
    documentNumber: {
        type: String,
    },
    ivaCondition: {
        type: String,
        enum: ['Responsable Inscripto', 'Monotributista','Consumidor final', 'Exento'],
    },
    name: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    address: {
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
  },
  { timestamps: true },
);

module.exports = mongoose.model('Customer', CustomerSchema);