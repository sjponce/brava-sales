const mongoose = require('mongoose');

const sellerSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: false,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      autopopulate: true,
      required: true,
    },
    dni: {
      type: String,
    },
    phone: {
      type: String,
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);

sellerSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Seller', sellerSchema);
