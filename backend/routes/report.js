const express = require('express')
const router = express.Router()
const { exportReport, exportLatestReport } = require('../controllers/reportController')
const { protect } = require('../middleware/auth')

router.get('/export/latest', protect, exportLatestReport)
router.get('/export/:analysisId', protect, exportReport)

module.exports = router
