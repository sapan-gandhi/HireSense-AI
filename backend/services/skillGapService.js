const { ROLE_SKILLS } = require('./careerMatchService')

/**
 * Compare user skills against required skills for a role.
 * Returns matchedSkills, missingSkills, and readinessScore.
 */
const analyzeSkillGap = (userSkills = [], targetRole) => {
  const required = ROLE_SKILLS[targetRole] || []
  const lowerUser = userSkills.map(s => s.toLowerCase())

  const matchedSkills = required.filter(r =>
    lowerUser.includes(r.toLowerCase())
  )

  const missingSkills = required.filter(r =>
    !lowerUser.includes(r.toLowerCase())
  )

  const readinessScore = required.length > 0
    ? Math.round((matchedSkills.length / required.length) * 100)
    : 0

  return { matchedSkills, missingSkills, readinessScore }
}

module.exports = { analyzeSkillGap }
