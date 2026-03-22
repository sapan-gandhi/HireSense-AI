const express = require('express')
const router = express.Router()
const { uploadResume } = require('../controllers/resumeController')
const { improveResume } = require('../controllers/improveController')
const { protect } = require('../middleware/auth')
const upload = require('../middleware/upload')

router.post('/upload', protect, upload.single('resume'), uploadResume)
router.post('/improve', protect, improveResume)

module.exports = router
