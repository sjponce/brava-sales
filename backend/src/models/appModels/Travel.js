const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TravelStopSchema = new Schema(
  {
    sequence: {
      type: Number,
      required: true,
      min: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      autopopulate: true,
    },
    plannedStart: {
      type: Date,
    },
    plannedEnd: {
      type: Date,
    },
    arrivedAt: {
      type: Date,
    },
  },
  { _id: true }
);

const SizeDetailSchema = new Schema(
  {
    size: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    delivered: {
      type: Number,
      default: 0,
      min: 0,
    },
    failed: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const TravelItemSchema = new Schema(
  {
    salesOrder: {
      type: Schema.Types.ObjectId,
      ref: 'SalesOrder',
      autopopulate: true,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      autopopulate: true,
      required: true,
    },
    idStock: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    sizes: [SizeDetailSchema],
  },
  { _id: true }
);

const ExtraStockItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      autopopulate: true,
      required: true,
    },
    idStock: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    sizes: [SizeDetailSchema],
  },
  { _id: true }
);

const TravelSchema = new Schema(
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
    vehicle: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      autopopulate: true,
      required: true,
    },
    driverName: {
      type: String,
    },
    capacityBultos: {
      type: Number,
      required: true,
      min: 0,
    },
    useExtraStock: {
      type: Boolean,
      default: false,
    },
    extraStockItems: [ExtraStockItemSchema],
    stops: [TravelStopSchema],
    status: {
      type: String,
      enum: ['PLANNED', 'RESERVED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNED',
    },
    assignedOrders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SalesOrder',
        autopopulate: true,
      },
    ],
    items: [TravelItemSchema],
    reservedAt: {
      type: Date,
    },
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    ttlReleaseAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

TravelSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Travel', TravelSchema);


