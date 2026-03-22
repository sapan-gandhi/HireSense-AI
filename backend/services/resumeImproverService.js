const improveWithRules = (resumeText) => {
  const lines = resumeText.split('\n').filter(l => l.trim().length > 0)
  const improvements = []
  const weakPatterns = [/^(made|did|worked on|helped|was responsible for|i |managed to)/i, /^(built|created|developed|wrote|designed)/i]
  const actionVerbs = ['Engineered','Developed','Architected','Implemented','Optimised','Delivered','Led','Designed','Spearheaded','Built','Launched','Streamlined','Reduced','Increased','Improved']

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.length < 20 || trimmed.length > 300) continue
    if (/^(name|email|phone|address|education|skills|experience|projects|summary|objective):/i.test(trimmed)) continue
    const improved = improveOneLine(trimmed)
    if (improved && improved !== trimmed) {
      improvements.push({ original: trimmed, improved, type: categoriseLine(trimmed) })
    }
    if (improvements.length >= 8) break
  }

  const summary = extractAndImproveSummary(resumeText)
  return { improvements, improvedSummary: summary }
}

const categoriseLine = (line) => {
  const lower = line.toLowerCase()
  if (/built|developed|created|designed|implemented/.test(lower)) return 'project'
  if (/managed|led|handled|responsible/.test(lower)) return 'experience'
  if (/improved|optimised|reduced|increased/.test(lower)) return 'achievement'
  return 'general'
}

const improveOneLine = (line) => {
  let improved = line.trim()

  const replacements = [
    [/^(I |i )/g, ''],
    [/^made a website/i, 'Developed a responsive web application'],
    [/^made (a |an )?/i, 'Developed '],
    [/^built (a |an )?website/i, 'Developed a responsive web application'],
    [/^built (a |an )?/i, 'Engineered '],
    [/^created (a |an )?/i, 'Designed and implemented '],
    [/^worked on/i, 'Contributed to the development of'],
    [/^helped (with|to)/i, 'Collaborated to'],
    [/^was responsible for/i, 'Owned and delivered'],
    [/^did (a |an )?/i, 'Completed '],
    [/^managed (a |an )?/i, 'Led and managed '],
    [/^wrote (a |an )?/i, 'Authored and maintained '],
    [/using react$/i, 'using React, focusing on reusable component architecture and responsive design'],
    [/using node\.?js$/i, 'using Node.js and Express, implementing RESTful API endpoints with proper error handling'],
    [/using python$/i, 'using Python, leveraging its ecosystem for data processing and automation'],
    [/\bapp\b/gi, 'application'],
    [/\binfo\b/gi, 'information'],
    [/\btech\b(?!nology)/gi, 'technology'],
  ]

  for (const [pattern, replacement] of replacements) {
    improved = improved.replace(pattern, replacement)
  }

  if (!improved.endsWith('.') && !improved.endsWith(',')) {
    improved = improved + '.'
  }

  if (improved === line.trim() + '.') return null
  return improved
}

const extractAndImproveSummary = (resumeText) => {
  const lower = resumeText.toLowerCase()
  const summaryStart = lower.indexOf('summary')
  const objectiveStart = lower.indexOf('objective')
  const profileStart = lower.indexOf('profile')

  let summaryText = ''
  const startIdx = Math.max(summaryStart, objectiveStart, profileStart)
  if (startIdx !== -1) {
    const chunk = resumeText.slice(startIdx + 10, startIdx + 400)
    const nextSection = chunk.search(/\n(skills|experience|education|projects)/i)
    summaryText = nextSection !== -1 ? chunk.slice(0, nextSection).trim() : chunk.slice(0, 200).trim()
  }

  const skillsMatch = resumeText.match(/skills[:\s]+([\w\s,./]+?)(?=\n\n|\n[A-Z])/i)
  const skills = skillsMatch ? skillsMatch[1].replace(/\n/g, ', ') : ''
  const hasExperience = lower.includes('experience') || lower.includes('internship')
  const hasProjects = lower.includes('project')

  const improved = `Results-driven software developer with hands-on experience building scalable web applications and solving real-world engineering problems. ${hasExperience ? 'Demonstrated ability to deliver production-ready features in professional settings, collaborating effectively with cross-functional teams.' : 'Strong foundation in software development through hands-on project work and continuous self-directed learning.'} ${hasProjects ? 'Track record of taking projects from concept to deployment, with attention to code quality, performance, and user experience.' : ''} ${skills ? `Core technical skills include ${skills.slice(0, 120)}.` : ''} Passionate about writing clean, maintainable code and contributing to impactful products.`.replace(/\s+/g, ' ').trim()

  return {
    original: summaryText || 'No summary section found in resume.',
    improved,
  }
}

module.exports = { improveWithRules }
