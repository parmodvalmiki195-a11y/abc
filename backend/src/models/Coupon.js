const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    win: {
      type: Number,
      default: 100,
    },
    qty: {
      type: Number,
      default: 0,
    },
    points: {
      type: Number,
      default: 0,
    },
    result: {
      type: Number,
      default: 0,
    },
    values: {
      type: [String],
      default: () => Array(10).fill(''),
      validate: {
        validator(values) {
          return values.length === 10
        },
        message: 'values must contain exactly 10 entries',
      },
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Coupon', couponSchema)
