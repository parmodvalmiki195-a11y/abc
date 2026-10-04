const express = require('express')
const {
  getAdminCurrentDraw,
  getCurrentDraw,
  getDrawHistory,
  setCurrentDrawResult,
} = require('../controllers/drawController')
const requireAdmin = require('../middleware/auth')

const router = express.Router()

router.get('/current/admin', requireAdmin, getAdminCurrentDraw)
router.get('/current', getCurrentDraw)
router.get('/', getDrawHistory)
router.put('/current', requireAdmin, setCurrentDrawResult)

module.exports = router
