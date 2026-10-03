require('dotenv').config()

const connectDB = require('./config/db')
const Coupon = require('./models/Coupon')
const { defaultCoupons } = require('./utils/defaults')
const ensureAdmin = require('./utils/ensureAdmin')

async function seed() {
  await connectDB()

  const admin = await ensureAdmin()

  const couponCount = await Coupon.countDocuments()

  if (couponCount === 0) {
    await Coupon.insertMany(defaultCoupons)
  }

  console.log(`Seed complete. Admin username: ${admin.username}`)
  process.exit(0)
}

seed().catch((error) => {
  console.error(error)
  process.exit(1)
})
