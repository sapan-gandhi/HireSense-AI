const express = require('express')
const router = express.Router()
const { matchJD } = require('../controllers/jdController')
const { protect } = require('../middleware/auth')
router.post('/match', protect, matchJD)
module.exports = router
