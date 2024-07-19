const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
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
      default: null,
    },
    phone: {
      type: String,
    },
    photo: {
      type: String,
    },
    role: {
      type: String,
      default: 'client',
      enum: ['admin', 'client'],
    },
  },
  { timestamps: true }
);

clientSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Client', clientSchema);
