const express = require('express')
const router = express.Router()
const { register, login, getMe, verifyEmail, resendCode } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

router.post('/register', register)
router.post('/verify', verifyEmail)
router.post('/resend-code', resendCode)
router.post('/login', login)
router.get('/me', protect, getMe)

module.exports = router
