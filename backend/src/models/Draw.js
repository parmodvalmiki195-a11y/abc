const mongoose = require('mongoose')

const drawResultSchema = new mongoose.Schema(
  {
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    couponName: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      default: '',
    },
    source: {
      type: String,
      enum: ['pending', 'admin', 'random'],
      default: 'pending',
    },
  },
  { _id: false },
)

const drawSchema = new mongoose.Schema(
  {
    slotKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    drawDate: {
      type: String,
      required: true,
      index: true,
    },
    slotTime: {
      type: String,
      required: true,
    },
    startsAt: {
      type: Date,
      required: true,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    resultValue: {
      type: String,
      default: '',
    },
    results: {
      type: [drawResultSchema],
      default: [],
    },
    source: {
      type: String,
      enum: ['pending', 'admin', 'random', 'mixed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: ['pending', 'final'],
      default: 'pending',
    },
    finalizedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Draw', drawSchema)
