const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    promotionalName: {
      type: String,
      required: true,
    },
    stockId: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    tags: [{ type: mongoose.Schema.ObjectId, ref: 'Tag', required: true }],
    enabled: {
      type: Boolean,
      default: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
