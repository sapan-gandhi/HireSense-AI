const { asyncHandler } = require('../middleware/errorHandler')
const { generateReportHTML } = require('../services/reportService')
const Analysis = require('../models/Analysis')

// GET /api/report/export/latest  — export most recent analysis
exports.exportLatestReport = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 })
  if (!analysis) {
    return res.status(404).json({ success: false, message: 'No analysis found. Please analyze your resume first.' })
  }
  const html = generateReportHTML(analysis, req.user)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="career-report-${Date.now()}.html"`)
  res.send(html)
})

// GET /api/report/export/:analysisId
exports.exportReport = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.analysisId, userId: req.user._id })
  if (!analysis) {
    return res.status(404).json({ success: false, message: 'Analysis not found.' })
  }
  const html = generateReportHTML(analysis, req.user)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="career-report-${Date.now()}.html"`)
  res.send(html)
})
