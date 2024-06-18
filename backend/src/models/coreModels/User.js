const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
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
    password: {
      type: String,
      required: true,
    },
    phone: {
        type: String,
        },
    photo: {
        type: String,
        },
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'SELLER',
      enum: ['ADMIN', 'SELLER'],
    },
  },
);

module.exports = mongoose.model('User', UserSchema);
