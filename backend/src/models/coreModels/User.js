const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      default: 'seller',
      enum: ['admin', 'seller', 'client'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
