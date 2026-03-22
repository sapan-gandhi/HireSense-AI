/**
 * jdAnalysisService.js
 * Deep JD parsing — extracts role, required skills, critical keywords,
 * experience requirements, and ATS keyword coverage.
 */

const { SKILLS_DICT } = require('./resumeAnalysisService')

// Domain-specific keyword banks for ATS analysis
const ATS_KEYWORD_BANKS = {
  frontend: ['react','javascript','html','css','typescript','responsive','component','ui','ux','web','frontend','spa','dom'],
  backend: ['api','rest','node','server','database','backend','microservice','endpoint','authentication','middleware'],
  fullstack: ['full stack','mern','mean','react','node','mongodb','express','api','frontend','backend'],
  data: ['sql','python','analysis','visualization','dashboard','reporting','excel','statistics','insight','data'],
  devops: ['docker','kubernetes','ci/cd','pipeline','deployment','cloud','aws','infrastructure','monitoring','devops'],
  ml: ['machine learning','model','training','tensorflow','pytorch','feature','dataset','accuracy','neural','algorithm'],
}

/**
 * Extract role title from JD
 */
const extractRoleTitle = (jdText) => {
  const patterns = [
    /we are (?:looking for|hiring|seeking) (?:a|an) ([^.]+?) (?:to|who|with)/i,
    /position[:\s]+([^\n.]+)/i,
    /role[:\s]+([^\n.]+)/i,
    /job title[:\s]+([^\n.]+)/i,
    /^([^\n]+developer[^\n]*)/im,
    /^([^\n]+engineer[^\n]*)/im,
    /^([^\n]+analyst[^\n]*)/im,
  ]
  for (const p of patterns) {
    const m = jdText.match(p)
    if (m) return m[1].trim().replace(/[^\w\s]/g, '').slice(0, 60)
  }
  return 'Software Engineer'
}

/**
 * Extract experience requirement
 */
const extractExperienceRequired = (jdText) => {
  const patterns = [
    /(\d+)\+?\s*(?:to\s*\d+)?\s*years?\s+(?:of\s+)?(?:relevant\s+)?experience/i,
    /experience[:\s]+(\d+)\+?\s*years?/i,
    /minimum[:\s]+(\d+)\s*years?/i,
  ]
  for (const p of patterns) {
    const m = jdText.match(p)
    if (m) return `${m[1]}+ years`
  }
  if (/fresher|entry.level|0.1 year|graduate|intern/i.test(jdText)) return 'Entry level / Fresher'
  if (/junior|1.2 year/i.test(jdText)) return '1-2 years'
  return 'Not specified'
}

/**
 * Classify whether skills are required vs preferred
 */
const classifySkills = (jdText, skills) => {
  const lower = jdText.toLowerCase()
  const required = []
  const preferred = []

  skills.forEach(skill => {
    const idx = lower.indexOf(skill.toLowerCase())
    if (idx === -1) { preferred.push(skill); return }

    const before = lower.slice(Math.max(0, idx - 150), idx)
    const isRequired = /required|must have|mandatory|essential|need to have|you have|you possess/i.test(before)
    const isPreferred = /preferred|nice to have|bonus|plus|good to have|advantage/i.test(before)

    if (isPreferred) preferred.push(skill)
    else if (isRequired || !isPreferred) required.push(skill) // default to required
  })

  return { required, preferred }
}

/**
 * Compute ATS keyword coverage
 */
const computeATSCoverage = (resumeText, jdText) => {
  const lower = jdText.toLowerCase()
  const resumeLower = resumeText.toLowerCase()

  // Detect domain
  let domainKeywords = ATS_KEYWORD_BANKS.fullstack
  if (/machine learning|deep learning|tensorflow|pytorch/i.test(lower)) domainKeywords = ATS_KEYWORD_BANKS.ml
  else if (/data analyst|tableau|power bi|statistics/i.test(lower)) domainKeywords = ATS_KEYWORD_BANKS.data
  else if (/devops|docker|kubernetes|ci\/cd/i.test(lower)) domainKeywords = ATS_KEYWORD_BANKS.devops
  else if (/frontend|react developer|ui developer/i.test(lower)) domainKeywords = ATS_KEYWORD_BANKS.frontend
  else if (/backend|api developer|server.side/i.test(lower)) domainKeywords = ATS_KEYWORD_BANKS.backend

  const jdKeywords = domainKeywords.filter(k => lower.includes(k))
  const covered = jdKeywords.filter(k => resumeLower.includes(k))
  const missing = jdKeywords.filter(k => !resumeLower.includes(k))

  const pct = jdKeywords.length > 0 ? Math.round((covered.length / jdKeywords.length) * 100) : 50

  return {
    totalKeywords: jdKeywords.length,
    coveredKeywords: covered.length,
    missingKeywords: missing,
    coveragePct: pct,
    grade: pct >= 80 ? 'A' : pct >= 60 ? 'B' : pct >= 40 ? 'C' : 'D',
  }
}

/**
 * Generate recruiter suggestions based on gaps
 */
const generateRecruiterSuggestions = (missingSkills, atsCoverage, resumeText, jdText) => {
  const suggestions = []
  const lower = resumeText.toLowerCase()

  if (missingSkills.length > 0) {
    suggestions.push({
      priority: 'HIGH',
      category: 'Skills',
      suggestion: `Add ${missingSkills.slice(0,3).join(', ')} to your skills section — these are explicitly listed in the JD.`,
    })
  }

  if (atsCoverage.coveragePct < 60) {
    suggestions.push({
      priority: 'HIGH',
      category: 'ATS',
      suggestion: `Your ATS keyword coverage is ${atsCoverage.coveragePct}%. Add these missing keywords naturally: ${atsCoverage.missingKeywords.slice(0,4).join(', ')}.`,
    })
  }

  if (!/\d+\s*%|\d+x/i.test(resumeText)) {
    suggestions.push({
      priority: 'HIGH',
      category: 'Impact',
      suggestion: 'Add quantified achievements — "Reduced load time by 40%" scores 3x higher with recruiters than vague bullets.',
    })
  }

  if (!lower.includes('summary') && !lower.includes('objective')) {
    suggestions.push({
      priority: 'MEDIUM',
      category: 'Structure',
      suggestion: `Add a 2-line professional summary mentioning the target role (${extractRoleTitle(jdText)}) — it\'s the first thing a recruiter reads.`,
    })
  }

  if (!/github\.com/i.test(resumeText)) {
    suggestions.push({
      priority: 'MEDIUM',
      category: 'Credibility',
      suggestion: 'Link your GitHub profile in the header — for tech roles, this alone increases callback rate for fresher candidates.',
    })
  }

  if (/agile|scrum/i.test(jdText) && !/agile|scrum/i.test(lower)) {
    suggestions.push({
      priority: 'MEDIUM',
      category: 'Keywords',
      suggestion: 'JD mentions Agile/Scrum — add a brief mention of working in agile environments if applicable.',
    })
  }

  return suggestions.slice(0, 6)
}

/**
 * Full JD analysis
 */
const analyseJD = (jdText, resumeText, resumeSkills) => {
  const { SKILLS_DICT } = require('./resumeAnalysisService')
  const lower = jdText.toLowerCase()

  const allJDSkills = SKILLS_DICT.filter(s => lower.includes(s.toLowerCase()))
  const resumeLower = resumeText.toLowerCase()
  const resumeSkillsLower = resumeSkills.map(s => s.toLowerCase())

  const matchedSkills = allJDSkills.filter(s => resumeSkillsLower.includes(s.toLowerCase()))
  const missingSkills = allJDSkills.filter(s => !resumeSkillsLower.includes(s.toLowerCase()))

  const { required: requiredSkills, preferred: preferredSkills } = classifySkills(jdText, allJDSkills)
  const criticalMissing = missingSkills.filter(s => requiredSkills.includes(s))

  const atsCoverage = computeATSCoverage(resumeText, jdText)
  const recruiterSuggestions = generateRecruiterSuggestions(missingSkills, atsCoverage, resumeText, jdText)

  const skillMatchPct = allJDSkills.length > 0
    ? Math.round((matchedSkills.length / allJDSkills.length) * 100)
    : 40

  return {
    roleTitle: extractRoleTitle(jdText),
    experienceRequired: extractExperienceRequired(jdText),
    allJDSkills,
    requiredSkills,
    preferredSkills,
    matchedSkills,
    missingSkills,
    criticalMissingSkills: criticalMissing,
    skillMatchPct,
    atsCoverage,
    recruiterSuggestions,
  }
}

module.exports = { analyseJD, extractRoleTitle, computeATSCoverage, generateRecruiterSuggestions }
