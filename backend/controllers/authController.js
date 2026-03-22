const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { asyncHandler } = require('../middleware/errorHandler')
const { generateCode, sendVerificationEmail } = require('../services/emailService')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' })

  const existing = await User.findOne({ email })
  if (existing) {
    if (!existing.isVerified) {
      // Re-send a fresh code instead of blocking
      const code = generateCode()
      existing.verificationCode = code
      existing.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000)
      await existing.save({ validateBeforeSave: false })
      await sendVerificationEmail(email, existing.name, code)
      return res.status(200).json({
        success: true,
        requiresVerification: true,
        message: 'Account exists but not verified. A new code has been sent to your email.',
      })
    }
    return res.status(409).json({ success: false, message: 'Email already registered.' })
  }

  const code = generateCode()
  const user = await User.create({
    name, email, password,
    isVerified: false,
    verificationCode: code,
    verificationCodeExpires: new Date(Date.now() + 15 * 60 * 1000),
  })

  await sendVerificationEmail(email, name, code)

  res.status(201).json({
    success: true,
    requiresVerification: true,
    message: 'Account created. Check your email for the 6-digit verification code.',
  })
})

// POST /api/auth/verify
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body
  if (!email || !code)
    return res.status(400).json({ success: false, message: 'Email and code are required.' })

  const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires')
  if (!user)
    return res.status(404).json({ success: false, message: 'Account not found.' })

  if (user.isVerified)
    return res.status(400).json({ success: false, message: 'Email already verified.' })

  if (!user.verificationCode || user.verificationCode !== code.trim())
    return res.status(400).json({ success: false, message: 'Invalid verification code.' })

  if (user.verificationCodeExpires < new Date())
    return res.status(400).json({ success: false, message: 'Code has expired. Please request a new one.' })

  user.isVerified = true
  user.verificationCode = undefined
  user.verificationCodeExpires = undefined
  await user.save({ validateBeforeSave: false })

  const token = signToken(user._id)
  res.json({ success: true, token, user })
})

// POST /api/auth/resend-code
exports.resendCode = asyncHandler(async (req, res) => {
  const { email } = req.body
  if (!email)
    return res.status(400).json({ success: false, message: 'Email is required.' })

  const user = await User.findOne({ email }).select('+verificationCode +verificationCodeExpires')
  if (!user)
    return res.status(404).json({ success: false, message: 'Account not found.' })

  if (user.isVerified)
    return res.status(400).json({ success: false, message: 'Email is already verified.' })

  // Rate limit: 1 resend per 60 seconds
  if (user.verificationCodeExpires && user.verificationCodeExpires > new Date(Date.now() + 14 * 60 * 1000)) {
    return res.status(429).json({ success: false, message: 'Please wait before requesting another code.' })
  }

  const code = generateCode()
  user.verificationCode = code
  user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000)
  await user.save({ validateBeforeSave: false })

  await sendVerificationEmail(email, user.name, code)

  res.json({ success: true, message: 'New verification code sent.' })
})

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' })

  const user = await User.findOne({ email }).select('+password')
  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid email or password.' })

  if (!user.isVerified)
    return res.status(403).json({
      success: false,
      requiresVerification: true,
      message: 'Please verify your email before logging in.',
    })

  const token = signToken(user._id)
  res.json({ success: true, token, user })
})

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user })
})
