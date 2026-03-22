/**
 * explainabilityService.js
 * Generates structured, human-readable hiring explanations.
 * Explains WHY a candidate would or would not be shortlisted.
 */

/**
 * Generate strengths list from resume + JD context
 */
const generateStrengths = (resumeText, matchedSkills, semanticScore, domainAlignment, resumeScore) => {
  const lower = resumeText.toLowerCase()
  const strengths = []

  if (matchedSkills.length >= 6)
    strengths.push(`Strong technical alignment — ${matchedSkills.length} of the required skills match the JD directly`)
  else if (matchedSkills.length >= 3)
    strengths.push(`Solid skill match — ${matchedSkills.length} core skills align with the job requirements`)

  if (semanticScore >= 60)
    strengths.push('High semantic similarity — resume language closely mirrors the job description')
  else if (semanticScore >= 40)
    strengths.push('Moderate content relevance — resume context partially aligns with JD expectations')

  if (domainAlignment >= 70)
    strengths.push('Strong domain alignment — your background matches the technical domain of this role')

  if (lower.includes('internship') || lower.includes('experience'))
    strengths.push('Relevant work or internship experience demonstrated')

  if (lower.includes('project'))
    strengths.push('Hands-on project portfolio shows practical application of skills')

  if (/github\.com/i.test(resumeText))
    strengths.push('GitHub profile linked — signals active coding practice and open work ethic')

  if (/\d+\s*%|\d+x\s/i.test(resumeText))
    strengths.push('Quantified achievements present — recruiters rate these 3x higher than generic bullets')

  if (/certif/i.test(resumeText))
    strengths.push('Certifications add credibility and signal initiative for self-learning')

  if (resumeScore >= 70)
    strengths.push('Well-structured resume with strong completeness score')

  return strengths.slice(0, 5)
}

/**
 * Generate weaknesses list
 */
const generateWeaknesses = (resumeText, missingSkills, criticalMissing, semanticScore, atsCoverage) => {
  const lower = resumeText.toLowerCase()
  const weaknesses = []

  if (criticalMissing.length > 0)
    weaknesses.push(`Missing critical skills: ${criticalMissing.slice(0,3).join(', ')} — these are required in the JD`)

  if (missingSkills.length > 4)
    weaknesses.push(`${missingSkills.length} required skills absent from resume — significant technical gap`)
  else if (missingSkills.length > 1)
    weaknesses.push(`${missingSkills.length} skills from the JD not found in your resume`)

  if (semanticScore < 35)
    weaknesses.push('Low semantic match — resume content language is quite different from the JD')

  if (atsCoverage && atsCoverage.coveragePct < 50)
    weaknesses.push(`ATS keyword coverage is only ${atsCoverage.coveragePct}% — risk of automated rejection before human review`)

  if (!/\d+\s*%|\d+x\s/i.test(resumeText))
    weaknesses.push('No quantified achievements — resume lacks measurable impact statements')

  if (!lower.includes('summary') && !lower.includes('objective'))
    weaknesses.push('No professional summary — recruiter has no immediate context for your application')

  if (!/github\.com/i.test(resumeText))
    weaknesses.push('No GitHub or portfolio link — reduces credibility for technical roles')

  if (lower.includes('made web pages') || lower.includes('helped the team') || lower.includes('worked on'))
    weaknesses.push('Weak action verbs detected — bullets like "helped" or "worked on" signal low ownership')

  return weaknesses.slice(0, 5)
}

/**
 * Generate risk factors
 */
const generateRiskFactors = (probability, criticalMissing, resumeText, jdText) => {
  const risks = []

  if (criticalMissing.length >= 2)
    risks.push({ level: 'HIGH', factor: `${criticalMissing.length} critical required skills missing — ATS may auto-reject` })

  if (probability < 40)
    risks.push({ level: 'HIGH', factor: 'Shortlist probability below 40% — significant profile gaps exist' })

  if (!/github\.com|portfolio|live demo/i.test(resumeText))
    risks.push({ level: 'MEDIUM', factor: 'No verifiable work samples — hard for recruiter to assess skill depth' })

  if (/1 year|less than|0-1/i.test(jdText) === false && /fresher|graduate|final year/i.test(resumeText))
    risks.push({ level: 'MEDIUM', factor: 'Senior role requirements may not match fresher/student profile' })

  if (!/\d+\s*%|\d+x\s/i.test(resumeText))
    risks.push({ level: 'MEDIUM', factor: 'No impact metrics — resume won\'t stand out in competitive applicant pool' })

  return risks.slice(0, 4)
}

/**
 * Generate "why you may get shortlisted" reasons
 */
const generateShortlistReasons = (matchedSkills, resumeText, probability) => {
  const reasons = []
  if (matchedSkills.length >= 4)
    reasons.push(`You match ${matchedSkills.length} required skills — places you above many applicants`)
  if (/project|github|deployed/i.test(resumeText))
    reasons.push('Project portfolio demonstrates practical ability, not just theoretical knowledge')
  if (/internship|experience/i.test(resumeText))
    reasons.push('Professional experience (even internship) shows real-world exposure')
  if (/certif/i.test(resumeText))
    reasons.push('Certifications signal structured learning and commitment')
  if (probability >= 50)
    reasons.push('Overall profile meets the threshold for initial screening consideration')
  return reasons.slice(0, 4)
}

/**
 * Generate "why you may get rejected" reasons
 */
const generateRejectionReasons = (missingSkills, criticalMissing, resumeText, probability) => {
  const reasons = []
  if (criticalMissing.length > 0)
    reasons.push(`Missing critical skills (${criticalMissing.slice(0,2).join(', ')}) that are marked required in the JD`)
  if (!/\d+\s*%|\d+x/i.test(resumeText))
    reasons.push('No quantified impact — resume blends in with hundreds of similar profiles')
  if (/made|helped|worked on|did/i.test(resumeText))
    reasons.push('Passive language signals low ownership — recruiters prefer action-driven candidates')
  if (probability < 40)
    reasons.push('Profile score is significantly below average for this type of role')
  if (!resumeText.toLowerCase().includes('summary'))
    reasons.push('No professional summary — recruiter has no hook to read further')
  return reasons.slice(0, 4)
}

/**
 * Full explainability output
 */
const generateExplanation = ({
  resumeText,
  jdText,
  matchedSkills,
  missingSkills,
  criticalMissingSkills,
  semanticScore,
  domainAlignment,
  resumeScore,
  shortlistProbability,
  atsCoverage,
}) => {
  const strengths = generateStrengths(resumeText, matchedSkills, semanticScore, domainAlignment, resumeScore)
  const weaknesses = generateWeaknesses(resumeText, missingSkills, criticalMissingSkills, semanticScore, atsCoverage)
  const riskFactors = generateRiskFactors(shortlistProbability, criticalMissingSkills, resumeText, jdText)
  const shortlistReasons = generateShortlistReasons(matchedSkills, resumeText, shortlistProbability)
  const rejectionReasons = generateRejectionReasons(missingSkills, criticalMissingSkills, resumeText, shortlistProbability)

  const verdict = shortlistProbability >= 65
    ? 'Strong candidate — likely to pass initial screening'
    : shortlistProbability >= 45
    ? 'Competitive candidate — close to shortlist threshold, targeted improvements needed'
    : shortlistProbability >= 30
    ? 'Developing profile — key gaps need addressing before applying'
    : 'Significant gaps — substantial upskilling needed for this specific role'

  return {
    verdict,
    strengths,
    weaknesses,
    riskFactors,
    shortlistReasons,
    rejectionReasons,
  }
}

module.exports = { generateExplanation, generateStrengths, generateWeaknesses, generateRiskFactors }
