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
      default: false,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

// Índices para optimizar búsquedas frecuentes
ProductSchema.index({ stockId: 1 });
ProductSchema.index({ removed: 1 });
ProductSchema.index({ removed: 1, enabled: 1 });

module.exports = mongoose.model('Product', ProductSchema);
