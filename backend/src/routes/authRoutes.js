const express = require('express')
const {
  changeAdminPassword,
  loginAdmin,
  verifyAdminUsername,
} = require('../controllers/authController')
const requireAdmin = require('../middleware/auth')

const router = express.Router()

router.post('/login', loginAdmin)
router.post('/verify-username', requireAdmin, verifyAdminUsername)
router.put('/password', requireAdmin, changeAdminPassword)

module.exports = router
