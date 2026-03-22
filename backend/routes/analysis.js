const express = require('express')
const router = express.Router()
const {
  runAnalysis,
  getAnalysis,
  getUserAnalyses,
} = require('../controllers/analysisController')
const { protect } = require('../middleware/auth')

// Order matters: /user/all must come before /:id
router.get('/user/all', protect, getUserAnalyses)
router.post('/run', protect, runAnalysis)
router.get('/:id', protect, getAnalysis)

module.exports = router
