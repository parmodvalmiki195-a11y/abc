const app = require('../src/app')
const connectDB = require('../src/config/db')
const ensureAdmin = require('../src/utils/ensureAdmin')

let initializationPromise

function initialize() {
  if (!initializationPromise) {
    initializationPromise = connectDB()
      .then(() => ensureAdmin())
      .catch((error) => {
        initializationPromise = null
        throw error
      })
  }

  return initializationPromise
}

module.exports = async function handler(req, res) {
  try {
    await initialize()
    return app(req, res)
  } catch (error) {
    console.error('Vercel initialization failed:', error)
    return res.status(500).json({ message: 'Server initialization failed' })
  }
}
