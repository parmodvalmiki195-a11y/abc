const mongoose = require('mongoose')
const dns = require('dns')

let connectionPromise

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (connectionPromise) {
    return connectionPromise
  }

  const mongoUri = process.env.MONGO_URI || process.env.ATLAS_URI

  if (!mongoUri) {
    throw new Error('MONGO_URI or ATLAS_URI is required in .env')
  }

  if (process.env.DNS_SERVERS) {
    dns.setServers(
      process.env.DNS_SERVERS.split(',')
        .map((server) => server.trim())
        .filter(Boolean),
    )
  }

  if (mongoUri.includes('cluster.mongodb.net')) {
    throw new Error(
      'Mongo URI still contains the placeholder host. Replace it with your real Atlas URI, for example mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/navratna?retryWrites=true&w=majority',
    )
  }

  connectionPromise = mongoose.connect(mongoUri)

  try {
    await connectionPromise
    console.log('MongoDB connected')
    return mongoose.connection
  } catch (error) {
    connectionPromise = null
    throw error
  }
}

module.exports = connectDB
