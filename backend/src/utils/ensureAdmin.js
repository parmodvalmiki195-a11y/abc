const bcrypt = require('bcryptjs')
const Admin = require('../models/Admin')

async function ensureAdmin() {
  const existingAdmin = await Admin.findOne()

  if (existingAdmin) {
    return existingAdmin
  }

  const username = (process.env.ADMIN_USERNAME || 'admin').toLowerCase().trim()
  const password = process.env.ADMIN_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(password, 10)

  const admin = await Admin.create({ username, passwordHash })
  console.log(`Default admin stored in DB. Username: ${admin.username}`)

  return admin
}

module.exports = ensureAdmin
