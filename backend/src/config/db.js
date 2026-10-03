const mongoose = require('mongoose')
const dns = require('dns')

async function connectDB() {
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

  await mongoose.connect(mongoUri)
  console.log('MongoDB connected')
}

module.exports = connectDB
