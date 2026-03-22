const Resume   = require('../models/Resume')
const Analysis = require('../models/Analysis')
const { asyncHandler } = require('../middleware/errorHandler')
const { computeSemanticScore, computeDomainAlignment } = require('../services/semanticSimilarityService')
const { computeShortlistProbability }  = require('../services/probabilityEngineService')
const { analyseJD }                    = require('../services/jdAnalysisService')
const { generateExplanation }          = require('../services/explainabilityService')
const { generateImprovementSimulation } = require('../services/improvementSimulationService')

// Score interpretation legend
const SCORE_LEGEND = [
  { range: '80–100', label: 'Strong shortlist potential',    color: 'success', min: 80 },
  { range: '60–79',  label: 'Competitive with improvements', color: 'success', min: 60 },
  { range: '40–59',  label: 'Partial fit — gaps exist',      color: 'warning', min: 40 },
  { range: 'Below 40', label: 'Low current alignment',       color: 'danger',  min: 0  },
]

// Generate executive summary paragraph
const generateExecutiveSummary = (jdAnalysis, shortlistData, explanation, semanticScore, roleTitle) => {
  const prob    = shortlistData.probability
  const matched = jdAnalysis.matchedSkills.length
  const missing = jdAnalysis.missingSkills.length
  const critical = shortlistData.criticalMissingSkills

  const probDesc =
    prob >= 68 ? 'strong shortlist potential' :
    prob >= 48 ? 'moderate shortlist potential' :
    prob >= 28 ? 'below-average shortlist potential' : 'low shortlist potential'

  const skillDesc = matched >= 6
    ? `strong technical alignment with ${matched} matched skills`
    : matched >= 3
    ? `partial technical alignment with ${matched} of the required skills`
    : `limited skill overlap with only ${matched} matched skills`

  const criticalDesc = critical.length > 0
    ? ` The primary gap is missing critical ${critical.slice(0, 2).join(' and ')} skills explicitly required by this role.`
    : missing > 0
    ? ` ${missing} non-critical skills are absent but can be addressed with targeted upskilling.`
    : ' The skill profile closely matches the JD requirements.'

  const semanticDesc = semanticScore >= 55
    ? 'Resume language aligns well with the JD tone and terminology.'
    : semanticScore >= 35
    ? 'Resume language partially aligns with JD expectations — mirroring JD phrasing would improve ATS ranking.'
    : 'Resume language diverges significantly from the JD — tailoring the wording would strongly improve ATS match.'

  return `This profile shows ${skillDesc} for the ${roleTitle} role, resulting in ${probDesc} (${prob}%).${criticalDesc} ${semanticDesc} ${explanation.verdict}`
}

// Generate keyword gaps section
const generateKeywordGaps = (resumeText, jdText, atsCoverage, missingSkills) => {
  const lower = jdText.toLowerCase()
  const resumeLower = resumeText.toLowerCase()

  // Extract all meaningful JD phrases (2–3 word combos that matter)
  const jdPhrases = [
    'agile', 'scrum', 'ci/cd', 'code review', 'unit test', 'testing', 'documentation',
    'ownership', 'communication', 'teamwork', 'production', 'scalable', 'microservices',
    'cloud', 'deployment', 'performance', 'accessibility', 'responsive', 'cross-functional',
    'sprint', 'standup', 'version control', 'clean code', 'best practices',
  ].filter(p => lower.includes(p))

  const presentKeywords  = jdPhrases.filter(p => resumeLower.includes(p))
  const missingKeywords  = jdPhrases.filter(p => !resumeLower.includes(p))

  // Placement suggestions for top missing keywords
  const placements = missingKeywords.slice(0, 5).map(kw => {
    const placement =
      ['agile','scrum','sprint','standup','code review'].includes(kw) ? 'Experience section — mention in internship/work bullet points' :
      ['ci/cd','deployment','production','cloud'].includes(kw)        ? 'Projects section — mention deployment method used' :
      ['unit test','testing'].includes(kw)                             ? 'Skills section or Projects — mention any testing you did' :
      ['ownership','communication','teamwork'].includes(kw)           ? 'Professional Summary or Experience bullets' :
      ['performance','accessibility','responsive'].includes(kw)       ? 'Projects section — describe optimisations made' :
      'Skills section or relevant bullet points'
    return { keyword: kw, placement }
  })

  return {
    presentKeywords,
    missingKeywords,
    placements,
    coveragePct: atsCoverage.coveragePct,
    grade: atsCoverage.grade,
  }
}

exports.matchJD = asyncHandler(async (req, res) => {
  const { jdText, analysisId } = req.body

  if (!jdText || jdText.trim().length < 30)
    return res.status(400).json({ success: false, message: 'Please provide a valid job description.' })

  const query = analysisId
    ? { _id: analysisId, userId: req.user._id }
    : { userId: req.user._id }

  const analysis = await Analysis.findOne(query).sort({ createdAt: -1 })
  if (!analysis)
    return res.status(404).json({ success: false, message: 'No resume analysis found. Please analyze your resume first.' })

  const resume = await Resume.findById(analysis.resumeId)
  if (!resume)
    return res.status(404).json({ success: false, message: 'Resume not found.' })

  const resumeText   = resume.resumeText || ''
  const resumeSkills = analysis.extractedSkills || []
  const resumeScore  = analysis.resumeScore || 50

  // ── Full intelligence pipeline ────────────────────────
  const jdAnalysis      = analyseJD(jdText, resumeText, resumeSkills)
  const semanticScore   = computeSemanticScore(resumeText, jdText)
  const domainAlignment = computeDomainAlignment(resumeText, jdText, resumeSkills)

  const shortlistData = computeShortlistProbability({
    skillMatchPct: jdAnalysis.skillMatchPct,
    semanticScore,
    domainAlignment,
    resumeText,
    jdText,
    missingSkills: jdAnalysis.missingSkills,
    resumeScore,
  })

  const explanation = generateExplanation({
    resumeText,
    jdText,
    matchedSkills:         jdAnalysis.matchedSkills,
    missingSkills:         jdAnalysis.missingSkills,
    criticalMissingSkills: shortlistData.criticalMissingSkills,
    semanticScore,
    domainAlignment,
    resumeScore,
    shortlistProbability:  shortlistData.probability,
    atsCoverage:           jdAnalysis.atsCoverage,
  })

  // ── NEW: Improvement simulation ───────────────────────
  const simulation = generateImprovementSimulation({
    baseProb:              shortlistData.probability,
    resumeText,
    jdText,
    resumeSkills,
    missingSkills:         jdAnalysis.missingSkills,
    criticalMissingSkills: shortlistData.criticalMissingSkills,
    resumeScore,
    roleTitle:             jdAnalysis.roleTitle,
  })

  // ── NEW: Keyword gaps ─────────────────────────────────
  const keywordGaps = generateKeywordGaps(resumeText, jdText, jdAnalysis.atsCoverage, jdAnalysis.missingSkills)

  // ── NEW: Executive summary ────────────────────────────
  const executiveSummary = generateExecutiveSummary(
    jdAnalysis, shortlistData, explanation, semanticScore, jdAnalysis.roleTitle
  )

  const result = {
    // JD meta
    roleTitle:            jdAnalysis.roleTitle,
    experienceRequired:   jdAnalysis.experienceRequired,
    // Scores
    matchScore:           jdAnalysis.skillMatchPct,
    semanticScore,
    domainAlignment,
    // Shortlist
    shortlistProbability: shortlistData.probability,
    confidenceRange:      shortlistData.confidenceRange,
    shortlistTier:        shortlistData.tier,
    shortlistTierColor:   shortlistData.tierColor,
    shortlistBreakdown:   shortlistData.breakdown,
    // Score legend
    scoreLegend:          SCORE_LEGEND,
    // Skills
    matchedSkills:         jdAnalysis.matchedSkills,
    missingSkills:         jdAnalysis.missingSkills,
    criticalMissingSkills: shortlistData.criticalMissingSkills,
    requiredSkills:        jdAnalysis.requiredSkills,
    preferredSkills:       jdAnalysis.preferredSkills,
    // ATS
    atsCoverage:           jdAnalysis.atsCoverage,
    // NEW sections
    keywordGaps,
    executiveSummary,
    improvementSimulation: simulation,
    // Explanation
    explanation,
    recruiterSuggestions: jdAnalysis.recruiterSuggestions,
  }

  // Persist to Analysis doc for Overview + Report
  await Analysis.findByIdAndUpdate(analysis._id, {
    jdIntelligence: { ...result, lastUpdated: new Date() }
  })

  res.json({
    success: true,
    result,
    role: analysis.selectedRole || analysis.careerMatches?.[0]?.role || 'Target Role',
  })
})
