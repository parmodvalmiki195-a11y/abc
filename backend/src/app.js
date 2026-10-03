const cors = require('cors')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const couponRoutes = require('./routes/couponRoutes')
const drawRoutes = require('./routes/drawRoutes')

const app = express()

app.get('/VERCEL-TEST-123', (req, res) => {
  res.json({
    status: 'success',
    message: 'THIS IS THE NEW DEPLOYED APP'
  })
})

// app.use(cors())

// const allowedOrigins = [
//   'http://localhost:5173',
//   'http://127.0.0.1:5173',
//   'https://goldencouponbombay.coupons',
//   'https://www.goldencouponbombay.coupons',
// ]

const allowedOrigins = [
  'https://goldencouponbombay.coupons',
  'https://www.goldencouponbombay.coupons',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
]

app.use(
  cors({
    origin: allowedOrigins,
  })
)

app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend is running'
  })
})

app.get('/api/health/application', (req, res) => {
  res.json({ status: 'ok good' })
})

app.use('/api/auth', authRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/draws', drawRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((error, req, res, next) => {
  console.error(error)
  res.status(error.status || 500).json({
    message: error.message || 'Server error',
  })
})

module.exports = app
