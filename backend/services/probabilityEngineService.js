/**
 * probabilityEngineService.js
 * Weighted shortlist probability engine.
 *
 * CALIBRATION TARGETS:
 *   Moderate fresher (Priya) vs Full Stack JD  → 35–48%
 *   Strong mid-level vs matching JD            → 65–78%
 *   Excellent senior vs exact match JD         → 80–92%
 */

const scoreProjectQuality = (resumeText) => {
  const lower = resumeText.toLowerCase()
  let score = 0

  if (lower.includes('project'))                                                score += 20
  if (/github\.com\/[a-zA-Z0-9]|live demo|vercel|netlify|deployed/i.test(resumeText)) score += 20
  if (/\d+\s*%|\d+x\s|increased|reduced|improved|saved|achieved/i.test(resumeText))  score += 20
  const projectCount = (resumeText.match(/\|\s*(html|react|node|python|javascript|java)/gi) || []).length
  score += projectCount >= 3 ? 20 : projectCount >= 2 ? 12 : projectCount >= 1 ? 6 : 0
  if (/production|live at|deployed to|users/i.test(resumeText)) score += 20

  return Math.min(100, score)
}

const scoreAchievements = (resumeText) => {
  let score = 0
  if (/certif|certificate|certified/i.test(resumeText))                         score += 20
  const quantMatches = resumeText.match(/\d+\s*%|\d+x\s|\d+\s*users/gi) || []
  score += Math.min(30, quantMatches.length * 10)
  if (/award|winner|first place|hackathon|scholarship/i.test(resumeText))       score += 20
  if (/open.?source|contributor|npm|pull request/i.test(resumeText))            score += 15
  const actionMatches = resumeText.match(/\b(architected|engineered|spearheaded|optimised|launched|delivered|led|reduced|increased)\b/gi) || []
  score += Math.min(15, actionMatches.length * 5)
  return Math.min(100, score)
}

const getCriticalMissingSkills = (missingSkills, jdText) => {
  const lower = jdText.toLowerCase()
  const critical = []

  missingSkills.forEach(skill => {
    const idx = lower.indexOf(skill.toLowerCase())
    if (idx === -1) return
    const context = lower.slice(Math.max(0, idx - 120), idx + 80)
    if (/required|must have|mandatory|essential|minimum/i.test(context)) {
      critical.push(skill)
    }
  })

  // Only fall back to top-2 implicit critical if nothing explicitly marked
  if (critical.length === 0 && missingSkills.length > 0) {
    return missingSkills.slice(0, 2)
  }

  return critical.slice(0, 4)
}

const computeShortlistProbability = ({
  skillMatchPct,
  semanticScore,
  domainAlignment,
  resumeText,
  jdText,
  missingSkills = [],
  resumeScore = 50,
}) => {
  const projectQuality  = scoreProjectQuality(resumeText)
  const achievementScore = scoreAchievements(resumeText)
  const criticalMissing  = getCriticalMissingSkills(missingSkills, jdText)

  // Penalty: only explicitly critical missing skills penalise heavily
  // Cap at 20 pts max so a candidate with good skills isn't crushed
  const missingPenalty = Math.min(20, criticalMissing.length * 6)

  const raw =
    (skillMatchPct    * 0.30) +
    (semanticScore    * 0.20) +
    (domainAlignment  * 0.15) +
    (projectQuality   * 0.10) +
    (achievementScore * 0.10) +
    (resumeScore      * 0.15) -
    missingPenalty

  const probability = Math.min(96, Math.max(4, Math.round(raw)))

  let confidenceRange, tier, tierColor
  if (probability >= 68) {
    confidenceRange = 'High'
    tier = 'Very Likely to be Shortlisted'
    tierColor = 'success'
  } else if (probability >= 48) {
    confidenceRange = 'Medium'
    tier = 'Moderate Shortlist Chance'
    tierColor = 'warning'
  } else if (probability >= 28) {
    confidenceRange = 'Low-Medium'
    tier = 'Below Average — Targeted Improvements Needed'
    tierColor = 'warning'
  } else {
    confidenceRange = 'Low'
    tier = 'Unlikely to be Shortlisted as-is'
    tierColor = 'danger'
  }

  return {
    probability,
    confidenceRange,
    tier,
    tierColor,
    breakdown: {
      skillMatch:       Math.round(skillMatchPct),
      semanticScore:    Math.round(semanticScore),
      domainAlignment:  Math.round(domainAlignment),
      projectQuality:   Math.round(projectQuality),
      achievementScore: Math.round(achievementScore),
      resumeScore:      Math.round(resumeScore),
      missingPenalty:   Math.round(missingPenalty),
    },
    criticalMissingSkills: criticalMissing,
  }
}

module.exports = {
  computeShortlistProbability,
  scoreProjectQuality,
  scoreAchievements,
  getCriticalMissingSkills,
}
