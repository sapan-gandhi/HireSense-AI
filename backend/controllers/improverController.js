const { asyncHandler } = require('../middleware/errorHandler')
const { improveWithRules } = require('../services/resumeImproverService')
const Resume = require('../models/Resume')
const Analysis = require('../models/Analysis')

exports.improveResume = asyncHandler(async (req, res) => {
  const { analysisId } = req.body
  let resumeText = ''
  if (analysisId) {
    const analysis = await Analysis.findOne({ _id: analysisId, userId: req.user._id })
    if (analysis) {
      const resume = await Resume.findById(analysis.resumeId)
      if (resume) resumeText = resume.resumeText || ''
    }
  } else {
    const latest = await Analysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 })
    if (latest) {
      const resume = await Resume.findById(latest.resumeId)
      if (resume) resumeText = resume.resumeText || ''
    }
  }
  if (!resumeText) {
    return res.status(404).json({ success: false, message: 'No resume found. Please upload a resume first.' })
  }
  const result = improveWithRules(resumeText)
  res.json({ success: true, result })
})
