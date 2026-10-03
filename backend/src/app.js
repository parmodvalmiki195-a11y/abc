const cors = require('cors')
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const couponRoutes = require('./routes/couponRoutes')
const drawRoutes = require('./routes/drawRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
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
