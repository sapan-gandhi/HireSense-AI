// ── Skills dictionary ─────────────────────────────────────
const SKILLS_DICT = [
  // Frontend
  'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular',
  'Next.js', 'Nuxt.js', 'Tailwind', 'Bootstrap', 'SASS', 'SCSS',
  'Redux', 'Zustand', 'Webpack', 'Vite', 'Babel', 'Responsive Design',
  // Backend
  'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot',
  'Ruby on Rails', 'Laravel', 'ASP.NET', 'REST API', 'GraphQL', 'WebSockets',
  // Database
  'MongoDB', 'MySQL', 'PostgreSQL', 'SQLite', 'Redis', 'Firebase',
  'Supabase', 'DynamoDB', 'Elasticsearch', 'SQL',
  // DevOps / Cloud
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'GitHub Actions',
  'Jenkins', 'Terraform', 'Linux', 'Nginx', 'Vercel', 'Heroku',
  // Languages
  'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Kotlin', 'Swift', 'PHP', 'R',
  // Data / AI
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras',
  'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn',
  'Data Visualization', 'Tableau', 'Power BI', 'Excel', 'Statistics',
  'NLP', 'Computer Vision', 'Data Preprocessing', 'Feature Engineering',
  'Jupyter', 'Apache Spark', 'Hadoop',
  // Tools
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'JIRA', 'Figma', 'Postman',
  'VS Code', 'IntelliJ', 'Agile', 'Scrum',
]

const extractSkills = (text) => {
  const lower = text.toLowerCase()
  return SKILLS_DICT.filter(skill => lower.includes(skill.toLowerCase()))
}

/**
 * Realistic resume scoring (0–100).
 *
 * CALIBRATION TARGETS:
 *   Priya (moderate fresher, no metrics, no GitHub)  → 52–62
 *   Good mid-level with GitHub + metrics              → 72–82
 *   Excellent senior with measurable impact           → 85–95
 */
const scoreResume = (text, skills = []) => {
  const lower = text.toLowerCase()
  let score = 0

  // ── Section presence (45 pts) ─────────────────────────
  const sections = {
    summary:    { keywords: ['summary', 'objective', 'profile', 'about me'], pts: 8 },
    skills:     { keywords: ['skills', 'technologies', 'tech stack'],        pts: 10 },
    experience: { keywords: ['experience', 'work history', 'internship', 'employment'], pts: 12 },
    education:  { keywords: ['education', 'degree', 'university', 'college', 'b.tech', 'bachelor'], pts: 8 },
    projects:   { keywords: ['projects', 'portfolio'],                        pts: 7 },
  }
  for (const [, { keywords, pts }] of Object.entries(sections)) {
    if (keywords.some(kw => lower.includes(kw))) score += pts
  }

  // ── Skill depth (up to 15 pts) ────────────────────────
  // Penalise for very few skills, reward breadth
  if      (skills.length >= 12) score += 15
  else if (skills.length >= 8)  score += 11
  else if (skills.length >= 5)  score += 7
  else if (skills.length >= 3)  score += 4
  else                          score += 1

  // ── Quality signals (up to 30 pts, strict) ────────────
  // Each signal is rare/hard to fake — needs REAL evidence

  // Quantified impact — STRONG signal, rare in freshers
  if (/\d+\s*%|\d+x\s|\d+\s*users|\d+\s*ms|\d+\s*sec/i.test(text)) score += 10

  // GitHub/portfolio — must be a real URL
  if (/github\.com\/[a-zA-Z0-9]|linkedin\.com\/in\/|portfolio\.[a-z]/i.test(text)) score += 8

  // Certifications — named ones only
  if (/aws certified|google certified|microsoft certified|coursera|udemy|hackerrank|leetcode/i.test(text)) score += 5

  // Production/deployed — real signal
  if (/production|deployed|live at|users|scale/i.test(text)) score += 4

  // Collaboration/team lead — real signal
  if (/led a team|managed a team|mentored|cross-functional/i.test(text)) score += 3

  // ── Penalty signals ───────────────────────────────────
  // Vague passive language → deduct
  const passiveCount = (text.match(/\b(helped|assisted|worked on|participated in|was responsible for)\b/gi) || []).length
  score -= Math.min(8, passiveCount * 2)

  // Very short resume → deduct
  const wordCount = text.split(/\s+/).length
  if (wordCount < 100) score -= 10
  else if (wordCount < 150) score -= 5

  score = Math.min(100, Math.max(0, Math.round(score)))

  const label =
    score >= 85 ? 'Excellent' :
    score >= 70 ? 'Good' :
    score >= 50 ? 'Fair' : 'Needs Work'

  const desc =
    score >= 85 ? 'Strong resume with great structure and measurable impact.' :
    score >= 70 ? 'Good resume. A few targeted improvements will make it stand out.' :
    score >= 50 ? 'Decent foundation. Add measurable outcomes and a GitHub link.' :
    'Resume needs significant improvement — add detail, metrics, and online presence.'

  return { score, label, desc }
}

const getStrengthsAndSuggestions = (text, skills = []) => {
  const lower = text.toLowerCase()
  const strengths = []
  const suggestions = []

  if (skills.length >= 8) strengths.push('Strong technical skill set with diverse technologies')
  else if (skills.length >= 4) strengths.push('Good core technical skills detected')
  if (lower.includes('project')) strengths.push('Projects section demonstrates hands-on experience')
  if (lower.includes('experience') || lower.includes('internship')) strengths.push('Work/internship experience adds credibility')
  if (lower.includes('education') || lower.includes('degree')) strengths.push('Educational background clearly presented')
  if (/github\.com|linkedin\.com/i.test(text)) strengths.push('Online portfolio/GitHub profile linked')
  if (/\d+%|\d+ percent/i.test(text)) strengths.push('Measurable achievements with numbers add impact')
  if (strengths.length === 0) strengths.push('Resume has basic structure in place')

  if (!lower.includes('summary') && !lower.includes('objective'))
    suggestions.push('Add a concise professional summary at the top to grab attention')
  if (!/\d+%|\d+ percent/i.test(text))
    suggestions.push('Quantify achievements (e.g. "Improved load time by 40%") for more impact')
  if (!/github\.com/i.test(text))
    suggestions.push('Include your GitHub or portfolio link to showcase real work')
  if (skills.length < 6)
    suggestions.push('Expand your skills section — list all relevant tools and technologies')
  if (!lower.includes('project'))
    suggestions.push('Add a projects section with descriptions of what you built')
  if (!/improved|increased|reduced|led|delivered|built|launched/i.test(text))
    suggestions.push('Use strong action verbs: built, led, implemented, optimised, delivered')
  if (suggestions.length === 0)
    suggestions.push('Consider tailoring this resume to each specific job description')

  return {
    strengths: strengths.slice(0, 4),
    suggestions: suggestions.slice(0, 4),
  }
}

module.exports = { extractSkills, scoreResume, getStrengthsAndSuggestions, SKILLS_DICT }
