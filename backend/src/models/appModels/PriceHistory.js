const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PriceHistorySchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    endDate: {
      type: Date,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PriceHistory', PriceHistorySchema);
