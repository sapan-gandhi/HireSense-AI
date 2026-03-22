const { SKILLS_DICT } = require('./resumeAnalysisService')

const extractJDKeywords = (jdText) => {
  const lower = jdText.toLowerCase()
  const skills = SKILLS_DICT.filter(s => lower.includes(s.toLowerCase()))
  const keywordPatterns = ['experience','years','degree','bachelor','master','agile','scrum','communication','teamwork','problem solving','analytical','leadership','ownership','startup','production','scalable','ci/cd','microservices','cloud','testing','unit test','code review','documentation','mentoring']
  const keywords = keywordPatterns.filter(kw => lower.includes(kw))
  return { skills, keywords }
}

const computeMatchScore = (resumeSkills = [], resumeText = '', jdText = '') => {
  const { skills: jdSkills, keywords: jdKeywords } = extractJDKeywords(jdText)
  if (jdSkills.length === 0) {
    return { score: 40, matchedSkills: [], missingSkills: [], matchedKeywords: [], missingKeywords: [], strengthAreas: ['Resume content present'], weaknesses: ['Job description has no specific skills listed'], suggestions: ['Add more technical skills to your resume'], atsInsights: ['Include role-specific keywords from the job description'] }
  }
  const lowerResume = resumeText.toLowerCase()
  const lowerResumeSkills = resumeSkills.map(s => s.toLowerCase())
  const matchedSkills = jdSkills.filter(s => lowerResumeSkills.includes(s.toLowerCase()))
  const missingSkills = jdSkills.filter(s => !lowerResumeSkills.includes(s.toLowerCase()))
  const matchedKeywords = jdKeywords.filter(kw => lowerResume.includes(kw))
  const missingKeywords = jdKeywords.filter(kw => !lowerResume.includes(kw))
  const skillScore = jdSkills.length > 0 ? (matchedSkills.length / jdSkills.length) * 60 : 30
  const keywordScore = jdKeywords.length > 0 ? (matchedKeywords.length / jdKeywords.length) * 20 : 10
  const completenessBonus = (lowerResume.includes('project') ? 5 : 0) + (lowerResume.includes('experience') ? 5 : 0) + (lowerResume.includes('github') ? 5 : 0) + (/\d+%|\d+ percent/i.test(resumeText) ? 5 : 0)
  const score = Math.min(98, Math.round(skillScore + keywordScore + completenessBonus))
  const strengthAreas = []
  if (matchedSkills.length >= 5) strengthAreas.push('Strong technical skill alignment with job requirements')
  if (matchedSkills.length >= 3) strengthAreas.push(`${matchedSkills.length} required skills already present in your resume`)
  if (lowerResume.includes('project')) strengthAreas.push('Hands-on project experience demonstrated')
  if (lowerResume.includes('experience') || lowerResume.includes('internship')) strengthAreas.push('Relevant work or internship experience present')
  if (/github\.com/i.test(resumeText)) strengthAreas.push('GitHub portfolio linked — strong credibility signal')
  if (strengthAreas.length === 0) strengthAreas.push('Foundation skills present in resume')
  const weaknesses = []
  if (missingSkills.length > 3) weaknesses.push(`Missing ${missingSkills.length} required technical skills from the job description`)
  if (missingKeywords.includes('ci/cd')) weaknesses.push('No mention of CI/CD practices or DevOps experience')
  if (missingKeywords.includes('agile') || missingKeywords.includes('scrum')) weaknesses.push('Agile or Scrum methodology not mentioned')
  if (!/\d+%|\d+ percent/i.test(resumeText)) weaknesses.push('No quantifiable achievements — metrics significantly increase ATS score')
  if (!lowerResume.includes('summary') && !lowerResume.includes('objective')) weaknesses.push('No professional summary at the top of resume')
  if (weaknesses.length === 0) weaknesses.push('Minor keyword gaps in job description match')
  const suggestions = []
  if (missingSkills.length > 0) suggestions.push(`Add missing skills to your resume if you have any experience: ${missingSkills.slice(0, 3).join(', ')}`)
  suggestions.push('Tailor your professional summary to mention the target role explicitly')
  suggestions.push('Mirror language from the job description naturally throughout your resume')
  if (missingKeywords.includes('agile')) suggestions.push('Mention Agile or Scrum experience in your work experience section')
  if (!/\d+%|\d+ percent/i.test(resumeText)) suggestions.push('Quantify achievements: "Reduced load time by 40%" performs better in ATS than vague statements')
  suggestions.push('Ensure your skills section lists technologies in the exact format used in the JD')
  const atsInsights = []
  atsInsights.push(`Keyword match rate: ${Math.round((matchedKeywords.length / Math.max(jdKeywords.length, 1)) * 100)}% of JD keywords found in resume`)
  if (missingSkills.length > 0) atsInsights.push(`Add to skills section: ${missingSkills.slice(0, 4).join(', ')}`)
  atsInsights.push('Use exact technology names from the JD — React.js and React may be treated differently by some ATS')
  atsInsights.push('Avoid tables and columns in your resume — many ATS systems cannot parse them correctly')
  atsInsights.push('Keep file format as PDF unless the JD specifically requests .docx')
  return { score, matchedSkills, missingSkills, matchedKeywords, missingKeywords, strengthAreas: strengthAreas.slice(0, 4), weaknesses: weaknesses.slice(0, 4), suggestions: suggestions.slice(0, 5), atsInsights: atsInsights.slice(0, 5) }
}

module.exports = { computeMatchScore, extractJDKeywords }
