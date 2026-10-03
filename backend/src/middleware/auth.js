const jwt = require('jsonwebtoken')

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''

  if (!token) {
    return res.status(401).json({ message: 'Admin token is required' })
  }

  try {
    req.admin = jwt.verify(token, process.env.JWT_SECRET)
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired admin token' })
  }
}

module.exports = requireAdmin
