const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

async function loginAdmin(req, res, next) {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() })

    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const passwordMatches = await bcrypt.compare(password, admin.passwordHash)

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: admin._id.toString(), role: 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' },
    )

    return res.json({
      token,
      user: {
        id: admin._id,
        username: admin.username,
        role: 'admin',
      },
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { loginAdmin }
