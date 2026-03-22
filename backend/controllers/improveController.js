const { asyncHandler } = require('../middleware/errorHandler')
const { improveWithRules } = require('../services/resumeImproverService')
const Resume = require('../models/Resume')
const Analysis = require('../models/Analysis')

// POST /api/resume/improve
exports.improveResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ userId: req.user._id }).sort({ createdAt: -1 })
  if (!resume) {
    return res.status(404).json({ success: false, message: 'No resume found. Please upload a resume first.' })
  }

  const analysis = await Analysis.findOne({ userId: req.user._id }).sort({ createdAt: -1 })
  const skills = analysis?.extractedSkills || resume.extractedSkills || []
  const role = analysis?.selectedRole || analysis?.careerMatches?.[0]?.role || ''

  const result = improveWithRules(resume.resumeText, skills, role)

  // result = { improvements: [...], improvedSummary: { original, improved } }
  const allImprovements = []

  // Add summary as first item if it exists
  if (result.improvedSummary?.improved) {
    allImprovements.push({
      type: 'Summary',
      badge: '✦ Summary Rewrite',
      original: result.improvedSummary.original,
      improved: result.improvedSummary.improved,
    })
  }

  // Add line improvements
  if (Array.isArray(result.improvements)) {
    result.improvements.forEach(item => {
      allImprovements.push({
        type: item.type || 'Experience',
        badge: item.type || 'Improvement',
        original: item.original,
        improved: item.improved,
      })
    })
  }

  res.json({ success: true, improvements: allImprovements, role, skillsCount: skills.length })
})
