const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleSchema = new Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    plate: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    capacityBultos: {
      type: Number,
      required: true,
      min: 0,
    },
    driver: {
      name: {
        type: String,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: true,
      },
    },
  },
  { timestamps: true }
);

VehicleSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Vehicle', VehicleSchema);


