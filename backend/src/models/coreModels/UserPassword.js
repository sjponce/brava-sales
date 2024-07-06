const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const UserPasswordSchema = new Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    emailToken: String,
    resetToken: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    authType: {
      type: String,
      default: 'email',
    },
    loggedSessions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// UserPasswordSchema.index({ user: 1 });
// generating a hash
UserPasswordSchema.methods.generateHash = function (salt, password) {
  return bcrypt.hashSync(salt + password);
};

// checking if password is valid
UserPasswordSchema.methods.validPassword = function (userpassword) {
  return bcrypt.compareSync(this.salt + userpassword, this.password);
};

module.exports = mongoose.model('UserPassword', UserPasswordSchema);
