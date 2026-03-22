/**
 * Semantic Match Engine
 * Goes beyond exact-skill matching: synonyms, concept clusters,
 * shortlist probability, hiring manager breakdown
 */

// Concept clusters: if resume has ANY of these, it satisfies the cluster
const CLUSTERS = {
  'frontend_framework': ['react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt'],
  'styling': ['css', 'tailwind', 'scss', 'sass', 'styled-components', 'bootstrap', 'material ui'],
  'backend_runtime': ['node.js', 'python', 'java', 'go', 'ruby', 'php', 'express.js'],
  'database_sql': ['sql', 'mysql', 'postgresql', 'sqlite', 'oracle'],
  'database_nosql': ['mongodb', 'firebase', 'redis', 'dynamodb', 'cassandra'],
  'version_control': ['git', 'github', 'gitlab', 'bitbucket'],
  'containerisation': ['docker', 'kubernetes', 'k8s', 'helm', 'containerd'],
  'cloud': ['aws', 'gcp', 'azure', 'heroku', 'vercel', 'netlify', 'digitalocean'],
  'testing': ['jest', 'mocha', 'pytest', 'cypress', 'selenium', 'unit test', 'testing'],
  'api': ['rest api', 'graphql', 'grpc', 'websocket', 'api', 'rest'],
  'state_management': ['redux', 'zustand', 'context api', 'mobx', 'recoil'],
  'ml_framework': ['tensorflow', 'pytorch', 'keras', 'scikit-learn', 'sklearn', 'hugging face'],
  'data_tools': ['pandas', 'numpy', 'matplotlib', 'seaborn', 'tableau', 'power bi'],
  'agile': ['agile', 'scrum', 'kanban', 'jira', 'sprint', 'standup'],
  'ci_cd': ['ci/cd', 'github actions', 'jenkins', 'gitlab ci', 'circle ci', 'travis'],
}

// Soft signal patterns that impress hiring managers
const SOFT_SIGNALS = {
  quantified_impact: { pattern: /\d+\s*%|\d+x\s|reduced|improved|increased|saved|achieved|delivered/i, weight: 12, label: 'Quantified Achievements' },
  leadership: { pattern: /led|mentored|managed|coached|owned|drove|spearheaded/i, weight: 8, label: 'Leadership Signals' },
  open_source: { pattern: /open.source|contributed|maintainer|npm|pypi|github\.com/i, weight: 8, label: 'Open Source / Portfolio' },
  production: { pattern: /production|deployed|live|users|scale|scalab/i, weight: 10, label: 'Production Experience' },
  problem_solving: { pattern: /solved|optimised?|refactored|architecture|designed|built from scratch/i, weight: 6, label: 'Problem Solving Evidence' },
  education_cs: { pattern: /computer science|software engineering|information technology|b\.?tech|b\.?e\b|m\.?tech/i, weight: 5, label: 'Relevant Degree' },
  certifications: { pattern: /certified|certification|aws certified|google cloud|microsoft azure|coursera|udemy/i, weight: 4, label: 'Certifications' },
}

// How important are different signal groups to each role (0-1 weight)
const ROLE_WEIGHTS = {
  'Frontend Developer':    { skills: 0.50, semantic: 0.20, soft: 0.30 },
  'Backend Developer':     { skills: 0.50, semantic: 0.20, soft: 0.30 },
  'Full Stack Developer':  { skills: 0.45, semantic: 0.25, soft: 0.30 },
  'Data Analyst':          { skills: 0.45, semantic: 0.25, soft: 0.30 },
  'AI/ML Engineer':        { skills: 0.40, semantic: 0.25, soft: 0.35 },
}

const DEFAULT_WEIGHTS = { skills: 0.50, semantic: 0.20, soft: 0.30 }

/**
 * Resolve how many JD skills are semantically covered by resume
 * Returns { covered, uncovered, clusterMatches }
 */
const resolveSemanticCoverage = (jdSkills, resumeText) => {
  const lowerResume = resumeText.toLowerCase()
  const covered = []
  const uncovered = []
  const clusterMatches = []

  jdSkills.forEach(skill => {
    const lowerSkill = skill.toLowerCase()
    // Direct match
    if (lowerResume.includes(lowerSkill)) {
      covered.push(skill)
      return
    }
    // Cluster match
    let foundCluster = false
    for (const [clusterName, members] of Object.entries(CLUSTERS)) {
      if (members.includes(lowerSkill)) {
        const resumeHasClusterMember = members.some(m => lowerResume.includes(m))
        if (resumeHasClusterMember) {
          covered.push(skill)
          const matchedMember = members.find(m => lowerResume.includes(m))
          clusterMatches.push({ required: skill, coveredBy: matchedMember, cluster: clusterName })
          foundCluster = true
          break
        }
      }
    }
    if (!foundCluster) uncovered.push(skill)
  })

  return { covered, uncovered, clusterMatches }
}

/**
 * Score soft signals present in resume text
 */
const scoreSoftSignals = (resumeText) => {
  const hits = []
  const misses = []
  let total = 0
  let earned = 0

  Object.entries(SOFT_SIGNALS).forEach(([key, { pattern, weight, label }]) => {
    total += weight
    if (pattern.test(resumeText)) {
      hits.push(label)
      earned += weight
    } else {
      misses.push(label)
    }
  })

  return { hits, misses, score: Math.round((earned / total) * 100), earned, total }
}

/**
 * Estimate shortlist probability
 * Based on: skill match %, semantic coverage, soft signals, resume completeness
 */
const estimateShortlistProbability = (skillPct, semanticPct, softScore, resumeScore) => {
  const raw =
    skillPct * 0.35 +
    semanticPct * 0.25 +
    softScore * 0.25 +
    resumeScore * 0.15

  // Normalise to 0-100, add slight variance
  const base = Math.min(96, Math.max(4, Math.round(raw)))

  let tier, tierColor, advice
  if (base >= 72) {
    tier = 'High Probability'
    tierColor = 'success'
    advice = 'Your profile closely matches this role. Apply with confidence and tailor your cover letter.'
  } else if (base >= 48) {
    tier = 'Moderate Probability'
    tierColor = 'warning'
    advice = 'Good foundation — close the skill gaps identified below to significantly improve your chances.'
  } else {
    tier = 'Low Probability'
    tierColor = 'danger'
    advice = 'Significant gaps exist. Work on the missing skills and quantify your achievements before applying.'
  }

  return { probability: base, tier, tierColor, advice }
}

/**
 * Hiring manager breakdown — how your resume reads to a recruiter
 */
const hiringBreakdown = (resumeText, resumeScore, softSignals) => {
  const lower = resumeText.toLowerCase()

  const dimensions = [
    {
      label: 'Technical Depth',
      score: Math.min(100, Math.round(
        (/\d+/.test(resumeText) ? 20 : 0) +
        (lower.includes('architect') || lower.includes('designed') ? 20 : 0) +
        (softSignals.hits.includes('Production Experience') ? 25 : 0) +
        (softSignals.hits.includes('Open Source / Portfolio') ? 20 : 0) +
        (resumeScore > 70 ? 15 : resumeScore > 50 ? 8 : 0)
      )),
      icon: '⚙️',
      tip: 'Demonstrate system design, architecture decisions, and production deployments.'
    },
    {
      label: 'Impact Evidence',
      score: Math.min(100, Math.round(
        (softSignals.hits.includes('Quantified Achievements') ? 50 : 5) +
        (softSignals.hits.includes('Production Experience') ? 25 : 0) +
        (softSignals.hits.includes('Problem Solving Evidence') ? 25 : 0)
      )),
      icon: '📈',
      tip: 'Use numbers: "Reduced API latency by 40%", "Built feature used by 5,000 users".'
    },
    {
      label: 'Leadership Signals',
      score: Math.min(100, Math.round(
        (softSignals.hits.includes('Leadership Signals') ? 60 : 5) +
        (softSignals.hits.includes('Quantified Achievements') ? 20 : 0) +
        (lower.includes('team') || lower.includes('collaborat') ? 20 : 0)
      )),
      icon: '🌟',
      tip: 'Mention if you led projects, mentored peers, or drove technical decisions.'
    },
    {
      label: 'Credibility Score',
      score: Math.min(100, Math.round(
        (softSignals.hits.includes('Relevant Degree') ? 30 : 0) +
        (softSignals.hits.includes('Certifications') ? 20 : 0) +
        (softSignals.hits.includes('Open Source / Portfolio') ? 25 : 0) +
        (/github\.com|linkedin\.com/i.test(resumeText) ? 25 : 0)
      )),
      icon: '🏅',
      tip: 'Link your GitHub, LinkedIn, and add relevant certifications to boost credibility.'
    },
    {
      label: 'Communication Clarity',
      score: Math.min(100, Math.round(
        (lower.includes('summary') || lower.includes('objective') ? 25 : 0) +
        (resumeText.split('\n').length > 15 ? 25 : 10) +
        (lower.includes('experience') ? 20 : 0) +
        (lower.includes('project') ? 20 : 0) +
        (/[A-Z][a-z]/.test(resumeText) ? 10 : 0)
      )),
      icon: '📝',
      tip: 'Clear sections, concise bullet points, and a strong professional summary improve readability.'
    },
  ]

  const overallFit = Math.round(dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length)

  return { dimensions, overallFit }
}

/**
 * Generate JD-aware resume improvement suggestions
 * More specific than generic improvements — tied to the actual JD
 */
const jdAwareImprovements = (missingSkills, missingKeywords, clusterMatches, resumeText, role) => {
  const suggestions = []
  const lower = resumeText.toLowerCase()

  // Skill-specific action items
  if (missingSkills.length > 0) {
    const top3 = missingSkills.slice(0, 3)
    suggestions.push({
      type: 'Skills Gap',
      priority: 'HIGH',
      action: `Add "${top3.join('", "')}" to your Skills section`,
      why: 'These are explicitly required in the JD and missing from your resume — ATS may reject it.',
    })
  }

  // Cluster match tips
  clusterMatches.slice(0, 2).forEach(({ required, coveredBy }) => {
    suggestions.push({
      type: 'Semantic Gap',
      priority: 'MEDIUM',
      action: `JD requires "${required}" — you have "${coveredBy}". Add both to your skills list.`,
      why: 'Some ATS systems do exact matching. Listing both maximises your keyword coverage.',
    })
  })

  // Quantification
  if (!/\d+\s*%|\d+x\s/i.test(resumeText)) {
    suggestions.push({
      type: 'Impact',
      priority: 'HIGH',
      action: 'Add at least 2 quantified achievements with numbers or percentages',
      why: 'Hiring managers spend 7 seconds on a resume. Numbers create instant credibility.',
    })
  }

  // Missing keywords
  const impactKeywords = missingKeywords.filter(k => ['agile','scrum','ci/cd','production','scalable','team','ownership'].includes(k))
  if (impactKeywords.length > 0) {
    suggestions.push({
      type: 'Keyword',
      priority: 'MEDIUM',
      action: `Naturally mention: "${impactKeywords.join('", "')}"`,
      why: 'These appear in the JD and boost both ATS score and recruiter impression.',
    })
  }

  // Summary rewrite hint
  if (!lower.includes('summary') && !lower.includes('objective')) {
    suggestions.push({
      type: 'Structure',
      priority: 'HIGH',
      action: `Add a 2-sentence Professional Summary mentioning "${role}" specifically`,
      why: 'A targeted summary is the first thing recruiters read and sets context for the whole resume.',
    })
  }

  // GitHub / portfolio
  if (!/github\.com/i.test(resumeText)) {
    suggestions.push({
      type: 'Credibility',
      priority: 'MEDIUM',
      action: 'Add your GitHub profile URL in the header/contact section',
      why: 'For tech roles, a GitHub link increases callback rate significantly for junior candidates.',
    })
  }

  return suggestions.slice(0, 6)
}

/**
 * Main function: full semantic analysis
 */
const analyseSemanticMatch = (resumeSkills, resumeText, resumeScore, jdText, jdSkills, role) => {
  const weights = ROLE_WEIGHTS[role] || DEFAULT_WEIGHTS

  // 1. Semantic skill coverage
  const { covered, uncovered, clusterMatches } = resolveSemanticCoverage(jdSkills, resumeText)
  const semanticPct = jdSkills.length > 0 ? Math.round((covered.length / jdSkills.length) * 100) : 50

  // 2. Soft signals
  const softSignals = scoreSoftSignals(resumeText)

  // 3. Exact skill match %
  const lowerResume = resumeText.toLowerCase()
  const exactMatched = resumeSkills.filter(s => lowerResume.includes(s.toLowerCase()))
  const skillPct = resumeSkills.length > 0 ? Math.round((exactMatched.length / Math.max(resumeSkills.length, 1)) * 100) : 40

  // 4. Shortlist probability
  const shortlist = estimateShortlistProbability(skillPct, semanticPct, softSignals.score, resumeScore)

  // 5. Hiring manager breakdown
  const hiring = hiringBreakdown(resumeText, resumeScore, softSignals)

  // 6. JD-aware improvement actions
  const { extractJDKeywords } = require('./jdMatchService')
  const { keywords: jdKeywords } = extractJDKeywords(jdText)
  const missingKeywords = jdKeywords.filter(k => !lowerResume.includes(k))
  const improvements = jdAwareImprovements(uncovered, missingKeywords, clusterMatches, resumeText, role)

  return {
    semanticCoverage: {
      pct: semanticPct,
      covered,
      uncovered,
      clusterMatches,
    },
    softSignals,
    shortlistProbability: shortlist,
    hiringBreakdown: hiring,
    jdAwareImprovements: improvements,
  }
}

module.exports = {
  analyseSemanticMatch,
  resolveSemanticCoverage,
  scoreSoftSignals,
  estimateShortlistProbability,
  hiringBreakdown,
}
