const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PromotionSchema = new Schema(
    {
        name: {
        type: String,
        required: true,
        },
        percent: {
        type: Number,
        validate: {
            validator: function (v) {
            return v >= 0 && v <= 100;
            },
            message: (props) =>
            `${props.value} El porcentaje debe ser entre 0 y 100.`,
        },
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
    }, { timestamps: true }
    );

module.exports = mongoose.model('Promotion', PromotionSchema);