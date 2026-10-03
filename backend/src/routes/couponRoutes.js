const express = require('express')
const {
  getCoupons,
  replaceCoupons,
  resetCoupons,
  updateCoupon,
} = require('../controllers/couponController')
const requireAdmin = require('../middleware/auth')

const router = express.Router()

router.get('/', getCoupons)
router.put('/:id', requireAdmin, updateCoupon)
router.put('/', requireAdmin, replaceCoupons)
router.post('/reset', requireAdmin, resetCoupons)

module.exports = router
