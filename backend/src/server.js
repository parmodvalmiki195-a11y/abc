require('dotenv').config()

const app = require('./app')
const connectDB = require('./config/db')
const ensureAdmin = require('./utils/ensureAdmin')
const { finalizeDueDraws } = require('./utils/drawScheduler')

const port = process.env.PORT || 5000

async function startServer() {
  try {
    await connectDB()
    await ensureAdmin()
    await finalizeDueDraws()
    setInterval(() => {
      finalizeDueDraws().catch((error) => {
        console.error('Draw finalization failed:', error.message)
      })
    }, 60 * 1000)

    app.listen(port, () => {
      console.log(`API running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

startServer()
