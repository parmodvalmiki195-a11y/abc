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

async function verifyAdminUsername(req, res, next) {
  try {
    const username = String(req.body.username || '').toLowerCase().trim()

    if (!username) {
      return res.status(400).json({ message: 'Username is required' })
    }

    const admin = await Admin.findOne({ _id: req.admin.id, username })

    if (!admin) {
      return res.status(400).json({ message: 'Username does not match the logged-in admin' })
    }

    return res.json({ matched: true })
  } catch (error) {
    return next(error)
  }
}

async function changeAdminPassword(req, res, next) {
  try {
    const username = String(req.body.username || '').toLowerCase().trim()
    const newPassword = String(req.body.newPassword || '')

    if (!username || !newPassword) {
      return res.status(400).json({ message: 'Username and new password are required' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must contain at least 6 characters' })
    }

    const admin = await Admin.findOne({ _id: req.admin.id, username })

    if (!admin) {
      return res.status(400).json({ message: 'Username verification failed' })
    }

    admin.passwordHash = await bcrypt.hash(newPassword, 10)
    await admin.save()

    return res.json({ message: 'Password changed successfully' })
  } catch (error) {
    return next(error)
  }
}

module.exports = { changeAdminPassword, loginAdmin, verifyAdminUsername }
