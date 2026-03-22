const express = require('express')
const router = express.Router()
const { improveResume } = require('../controllers/improverController')
const { protect } = require('../middleware/auth')
router.post('/improve', protect, improveResume)
module.exports = router
