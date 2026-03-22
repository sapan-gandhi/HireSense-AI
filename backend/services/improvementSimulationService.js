/**
 * improvementSimulationService.js
 * Calculates the probability boost from specific resume improvements.
 * Each simulation adds the missing element and re-scores the delta.
 */

const { computeShortlistProbability } = require('./probabilityEngineService')
const { computeSemanticScore, computeDomainAlignment } = require('./semanticSimilarityService')

/**
 * Simulate adding a missing skill and compute probability delta
 */
const simulateSkillAddition = (skill, baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore) => {
  const newSkills = [...resumeSkills, skill]
  const newMissing = missingSkills.filter(s => s.toLowerCase() !== skill.toLowerCase())
  const newSkillMatchPct = Math.min(100, Math.round(((resumeSkills.length + 1) / Math.max(resumeSkills.length + missingSkills.length, 1)) * 100))
  const newSemantic = computeSemanticScore(resumeText + ` ${skill}`, jdText)
  const newDomain = computeDomainAlignment(resumeText + ` ${skill}`, jdText, newSkills)

  const newResult = computeShortlistProbability({
    skillMatchPct: newSkillMatchPct,
    semanticScore: newSemantic,
    domainAlignment: newDomain,
    resumeText,
    jdText,
    missingSkills: newMissing,
    resumeScore,
  })

  return Math.max(0, newResult.probability - baseProb)
}

/**
 * Simulate adding quantified achievements
 */
const simulateQuantifiedAchievements = (baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore) => {
  const enhanced = resumeText + '\nReduced load time by 40%. Improved API response time by 35%. Built feature used by 500+ users.'
  const newSemantic = computeSemanticScore(enhanced, jdText)
  const newDomain = computeDomainAlignment(enhanced, jdText, resumeSkills)

  const newResult = computeShortlistProbability({
    skillMatchPct: Math.round((resumeSkills.length / Math.max(resumeSkills.length + missingSkills.length, 1)) * 100),
    semanticScore: newSemantic,
    domainAlignment: newDomain,
    resumeText: enhanced,
    jdText,
    missingSkills,
    resumeScore: Math.min(100, resumeScore + 12),
  })

  return Math.max(0, newResult.probability - baseProb)
}

/**
 * Simulate adding GitHub profile
 */
const simulateGitHub = (baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore) => {
  const enhanced = resumeText + '\nGitHub: github.com/candidate | Portfolio: myportfolio.dev'
  const newSemantic = computeSemanticScore(enhanced, jdText)

  const newResult = computeShortlistProbability({
    skillMatchPct: Math.round((resumeSkills.length / Math.max(resumeSkills.length + missingSkills.length, 1)) * 100),
    semanticScore: newSemantic,
    domainAlignment: computeDomainAlignment(enhanced, jdText, resumeSkills),
    resumeText: enhanced,
    jdText,
    missingSkills,
    resumeScore: Math.min(100, resumeScore + 8),
  })

  return Math.max(0, newResult.probability - baseProb)
}

/**
 * Simulate adding a professional summary
 */
const simulateSummary = (baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore, roleTitle) => {
  const summaryText = `Results-driven ${roleTitle || 'Software Developer'} with hands-on experience building scalable web applications. Strong foundation in modern frontend technologies with a focus on clean code, performance optimisation, and user experience.`
  const enhanced = summaryText + '\n\n' + resumeText
  const newSemantic = computeSemanticScore(enhanced, jdText)

  const newResult = computeShortlistProbability({
    skillMatchPct: Math.round((resumeSkills.length / Math.max(resumeSkills.length + missingSkills.length, 1)) * 100),
    semanticScore: newSemantic,
    domainAlignment: computeDomainAlignment(enhanced, jdText, resumeSkills),
    resumeText: enhanced,
    jdText,
    missingSkills,
    resumeScore: Math.min(100, resumeScore + 5),
  })

  return Math.max(0, newResult.probability - baseProb)
}

/**
 * Simulate adding a deployed project
 */
const simulateDeployedProject = (baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore) => {
  const enhanced = resumeText + '\nProject: Built and deployed full-stack application at myapp.vercel.app used by 200+ users. Tech: React, Node.js, MongoDB.'
  const newSemantic = computeSemanticScore(enhanced, jdText)

  const newResult = computeShortlistProbability({
    skillMatchPct: Math.round((resumeSkills.length / Math.max(resumeSkills.length + missingSkills.length, 1)) * 100),
    semanticScore: newSemantic,
    domainAlignment: computeDomainAlignment(enhanced, jdText, resumeSkills),
    resumeText: enhanced,
    jdText,
    missingSkills,
    resumeScore: Math.min(100, resumeScore + 10),
  })

  return Math.max(0, newResult.probability - baseProb)
}

/**
 * Generate full improvement simulation
 * Returns array of { action, delta, priority, effort, category }
 */
const generateImprovementSimulation = ({
  baseProb,
  resumeText,
  jdText,
  resumeSkills,
  missingSkills,
  criticalMissingSkills,
  resumeScore,
  roleTitle,
}) => {
  const simulations = []
  const lower = resumeText.toLowerCase()

  // Simulate top 3 missing skills (prioritise critical)
  const prioritySkills = [
    ...criticalMissingSkills,
    ...missingSkills.filter(s => !criticalMissingSkills.includes(s))
  ].slice(0, 4)

  prioritySkills.forEach(skill => {
    const delta = simulateSkillAddition(skill, baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore)
    if (delta >= 1) {
      simulations.push({
        action: `Add "${skill}" to your skills`,
        detail: criticalMissingSkills.includes(skill)
          ? `Critical skill required in JD — adds directly to skill match score`
          : `Required skill in JD — improves ATS keyword coverage`,
        delta: Math.round(delta),
        priority: criticalMissingSkills.includes(skill) ? 'HIGH' : 'MEDIUM',
        effort: 'Low — add to skills section immediately if you have any exposure',
        category: 'Skills',
      })
    }
  })

  // Simulate quantified achievements
  if (!/\d+\s*%|\d+x\s/i.test(resumeText)) {
    const delta = simulateQuantifiedAchievements(baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore)
    simulations.push({
      action: 'Add quantified achievements (numbers, %, metrics)',
      detail: 'e.g. "Reduced page load time by 40%" or "Built feature used by 500+ users"',
      delta: Math.max(4, Math.round(delta)),
      priority: 'HIGH',
      effort: 'Medium — review your projects and add measurable impact to each bullet',
      category: 'Impact',
    })
  }

  // Simulate GitHub
  if (!/github\.com\/[a-zA-Z0-9]/i.test(resumeText)) {
    const delta = simulateGitHub(baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore)
    simulations.push({
      action: 'Add GitHub profile link in header',
      detail: 'github.com/yourusername — makes your work verifiable instantly',
      delta: Math.max(3, Math.round(delta)),
      priority: 'HIGH',
      effort: 'Low — takes 2 minutes, high impact for tech roles',
      category: 'Credibility',
    })
  }

  // Simulate deployed project
  if (!/deployed|vercel|netlify|live at|production/i.test(resumeText)) {
    const delta = simulateDeployedProject(baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore)
    simulations.push({
      action: 'Add a deployed/live project link',
      detail: 'Deploy any existing project to Vercel (free) and add the URL',
      delta: Math.max(4, Math.round(delta)),
      priority: 'MEDIUM',
      effort: 'Medium — deploy to Vercel in 10 minutes, add URL to resume',
      category: 'Projects',
    })
  }

  // Simulate professional summary
  if (!lower.includes('summary') && !lower.includes('objective')) {
    const delta = simulateSummary(baseProb, resumeText, jdText, resumeSkills, missingSkills, resumeScore, roleTitle)
    simulations.push({
      action: 'Add a targeted professional summary',
      detail: `2-line summary mentioning "${roleTitle || 'target role'}" and your top 3 skills`,
      delta: Math.max(3, Math.round(delta)),
      priority: 'MEDIUM',
      effort: 'Low — write 2 sentences tailored to this JD',
      category: 'Structure',
    })
  }

  // Sort by delta descending
  simulations.sort((a, b) => b.delta - a.delta)

  // Calculate combined potential
  const topActions = simulations.slice(0, 4)
  const combinedDelta = Math.min(96 - baseProb, topActions.reduce((sum, s) => sum + s.delta, 0))
  const projectedProb = Math.min(96, baseProb + combinedDelta)

  return {
    simulations: simulations.slice(0, 6),
    projectedProbability: projectedProb,
    combinedDelta: Math.round(combinedDelta),
  }
}

module.exports = { generateImprovementSimulation }
