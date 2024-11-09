const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    seller: {
      type: mongoose.Schema.ObjectId,
      ref: 'Seller',
      autopopulate: true,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Active', 'Completed', 'Cancelled'],
      default: 'Pending'
    },
    description: {
      type: String,
    },
    destinations: [{
        id: {
          type: Number,
          required: true
        },
        city: {
          id: {
            type: Number,
            required: true
          },
          name: {
            type: String,
            required: true
          }
        },
        arrivalDate: {
          type: Date,
          required: true
        }
      }]
  },
  { timestamps: true }
);

tripSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Trip', tripSchema);
