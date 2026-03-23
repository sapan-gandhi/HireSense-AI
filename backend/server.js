require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes     = require('./routes/auth')
const resumeRoutes   = require('./routes/resume')
const analysisRoutes = require('./routes/analysis')
const jdRoutes       = require('./routes/jd')
const improverRoutes = require('./routes/improver')
const reportRoutes   = require('./routes/report')
const { errorHandler } = require('./middleware/errorHandler')

const app  = express()
const PORT = process.env.PORT || 5000

connectDB()

// CORS — allow all origins in production for simplicity
// (tighten this after hackathon if needed)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth',     authRoutes)
app.use('/api/resume',   resumeRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/jd',       jdRoutes)
app.use('/api/improver', improverRoutes)
app.use('/api/report',   reportRoutes)

app.get('/api/health', (req, res) => res.json({
  status: 'ok',
  message: 'HireSense AI API running',
  version: '1.0.0',
  timestamp: new Date().toISOString(),
}))

app.use(errorHandler)

app.listen(PORT, () => console.log(`✦ HireSense AI server running on http://localhost:${PORT}`))
