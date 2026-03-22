require('dotenv').config()
const express = require('express')
const cors = require('cors')
const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const resumeRoutes = require('./routes/resume')
const analysisRoutes = require('./routes/analysis')
const jdRoutes = require('./routes/jd')
const improverRoutes = require('./routes/improver')
const reportRoutes = require('./routes/report')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()
const PORT = process.env.PORT || 5000

connectDB()

app.use(cors({ origin: ['http://localhost:3000', 'http://localhost:5173'], credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/analysis', analysisRoutes)
app.use('/api/jd', jdRoutes)
app.use('/api/improver', improverRoutes)
app.use('/api/report', reportRoutes)

app.get('/api/health', (req, res) => res.json({ status: 'ok', message: 'AI Career Copilot API v2 running' }))

app.use(errorHandler)

app.listen(PORT, () => console.log(`✦ Server running on http://localhost:${PORT}`))
