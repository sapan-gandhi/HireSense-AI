const Analysis = require('../models/Analysis')
const Resume = require('../models/Resume')
const { asyncHandler } = require('../middleware/errorHandler')
const analysisService = require('../services/resumeAnalysisService')
const careerService = require('../services/careerMatchService')
const skillGapService = require('../services/skillGapService')
const roadmapService = require('../services/roadmapService')
const interviewService = require('../services/interviewService')
const claudeService = require('../services/claudeService')

// POST /api/analysis/run
exports.runAnalysis = asyncHandler(async (req, res) => {
  const { resumeId } = req.body

  if (!resumeId) {
    return res.status(400).json({ success: false, message: 'resumeId is required.' })
  }

  const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })
  if (!resume) {
    return res.status(404).json({ success: false, message: 'Resume not found.' })
  }

  const { resumeText, extractedSkills } = resume

  let analysisData

  // Try Claude API first, fall back to rule-based
  try {
    analysisData = await claudeService.analyzeResume(resumeText)
  } catch (err) {
    console.log('Claude API unavailable, using rule-based analysis:', err.message)
    // Rule-based fallback pipeline
    const resumeScore = analysisService.scoreResume(resumeText, extractedSkills)
    const careerMatches = careerService.predictCareerMatches(extractedSkills)
    const bestRole = careerMatches[0]?.role || 'Full Stack Developer'
    const { matchedSkills, missingSkills, readinessScore } = skillGapService.analyzeSkillGap(extractedSkills, bestRole)
    const roadmap = roadmapService.generateRoadmap(missingSkills, bestRole)
    const interviewQuestions = interviewService.generateQuestions(bestRole)
    const { strengths, suggestions } = analysisService.getStrengthsAndSuggestions(resumeText, extractedSkills)

    analysisData = {
      resumeScore: resumeScore.score,
      scoreLabel: resumeScore.label,
      scoreDesc: resumeScore.desc,
      extractedSkills,
      strengths,
      suggestions,
      careerMatches,
      bestRole,
      selectedRole: bestRole,
      matchedSkills,
      missingSkills,
      readinessScore,
      roadmap,
      interviewQuestions,
    }
  }

  // Save to DB
  const analysis = await Analysis.create({
    userId: req.user._id,
    resumeId: resume._id,
    ...analysisData,
    selectedRole: analysisData.bestRole || analysisData.selectedRole,
  })

  res.status(201).json({ success: true, analysis })
})

// GET /api/analysis/:id
exports.getAnalysis = asyncHandler(async (req, res) => {
  const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id })
  if (!analysis) {
    return res.status(404).json({ success: false, message: 'Analysis not found.' })
  }
  res.json({ success: true, analysis })
})

// GET /api/analysis/user/all
exports.getUserAnalyses = asyncHandler(async (req, res) => {
  const analyses = await Analysis.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(10)
  res.json({ success: true, analyses })
})
