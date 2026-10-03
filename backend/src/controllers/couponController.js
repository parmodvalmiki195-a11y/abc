const Coupon = require('../models/Coupon')
const { defaultCoupons, numberColumns } = require('../utils/defaults')

async function ensureDefaultCoupons() {
  const count = await Coupon.countDocuments()

  if (count === 0) {
    await Coupon.insertMany(defaultCoupons)
  }
}

async function getCoupons(req, res, next) {
  try {
    await ensureDefaultCoupons()
    const coupons = await Coupon.find().sort({ sortOrder: 1, createdAt: 1 })

    return res.json({
      numberColumns,
      coupons: coupons.map((coupon, index) => ({
        ...coupon.toObject(),
        values: getStaticValues(coupon.name, index),
      })),
    })
  } catch (error) {
    return next(error)
  }
}

async function updateCoupon(req, res, next) {
  try {
    const allowedFields = ['name', 'win', 'qty', 'points', 'result', 'sortOrder']
    const updates = {}

    allowedFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updates[field] = req.body[field]
      }
    })

    const coupon = await Coupon.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' })
    }

    return res.json(coupon)
  } catch (error) {
    return next(error)
  }
}

async function replaceCoupons(req, res, next) {
  try {
    const { coupons } = req.body

    if (!Array.isArray(coupons)) {
      return res.status(400).json({ message: 'coupons must be an array' })
    }

    await Coupon.deleteMany({})
    const createdCoupons = await Coupon.insertMany(
      coupons.map((coupon, index) => ({
        ...coupon,
        values: getStaticValues(coupon.name, index),
        sortOrder: coupon.sortOrder || index + 1,
      })),
    )

    return res.json(createdCoupons)
  } catch (error) {
    return next(error)
  }
}

function getStaticValues(couponName, index) {
  const matchingCoupon = defaultCoupons.find((coupon) => coupon.name === couponName)
  return [...(matchingCoupon || defaultCoupons[index] || { values: Array(10).fill('') }).values]
}

async function resetCoupons(req, res, next) {
  try {
    await Coupon.deleteMany({})
    const coupons = await Coupon.insertMany(defaultCoupons)
    return res.json(coupons)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getCoupons,
  replaceCoupons,
  resetCoupons,
  updateCoupon,
}
