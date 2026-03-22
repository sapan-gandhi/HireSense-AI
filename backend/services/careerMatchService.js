// ── Role → Required Skills Mapping ───────────────────────
const ROLE_SKILLS = {
  'Frontend Developer': [
    'HTML', 'CSS', 'JavaScript', 'React', 'Git',
    'TypeScript', 'Tailwind', 'Responsive Design',
  ],
  'Backend Developer': [
    'Node.js', 'Express.js', 'MongoDB', 'SQL', 'REST API',
    'Python', 'Git', 'Docker',
  ],
  'Full Stack Developer': [
    'HTML', 'CSS', 'JavaScript', 'React', 'Node.js',
    'Express.js', 'MongoDB', 'Git', 'SQL', 'REST API',
  ],
  'Data Analyst': [
    'Python', 'SQL', 'Excel', 'Pandas', 'NumPy',
    'Data Visualization', 'Tableau', 'Statistics',
  ],
  'AI/ML Engineer': [
    'Python', 'Machine Learning', 'Deep Learning', 'TensorFlow',
    'PyTorch', 'NLP', 'Data Preprocessing', 'Scikit-learn',
  ],
}

/**
 * Predict top 3 career matches based on skill overlap.
 * Returns sorted array with role, score %, and match label.
 */
const predictCareerMatches = (userSkills = []) => {
  const lowerSkills = userSkills.map(s => s.toLowerCase())

  const results = Object.entries(ROLE_SKILLS).map(([role, required]) => {
    const matched = required.filter(r =>
      lowerSkills.includes(r.toLowerCase())
    )
    const score = Math.round((matched.length / required.length) * 100)
    return { role, score, matchedCount: matched.length, totalRequired: required.length }
  })

  results.sort((a, b) => b.score - a.score)

  return results.slice(0, 3).map((r, i) => ({
    role: r.role,
    score: r.score,
    match: i === 0 ? 'Top Match' : i === 1 ? 'Good Match' : 'Possible Match',
  }))
}

module.exports = { predictCareerMatches, ROLE_SKILLS }
