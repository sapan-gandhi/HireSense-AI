/**
 * semanticSimilarityService.js
 * TF-IDF cosine similarity between resume and JD text.
 * No external ML deps — pure JS, production-ready.
 */

const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','being','have','has',
  'had','do','does','did','will','would','could','should','may','might',
  'shall','can','need','must','am','i','we','you','he','she','it','they',
  'this','that','these','those','what','which','who','how','when','where',
  'all','any','both','each','few','more','most','other','some','such',
  'no','not','only','same','so','than','too','very','just','about','above',
  'after','also','back','because','come','its','our','our','us','their',
])

const tokenise = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s+#.]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

const buildTF = (tokens) => {
  const freq = {}
  tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1 })
  const total = tokens.length || 1
  const tf = {}
  Object.entries(freq).forEach(([t, c]) => { tf[t] = c / total })
  return tf
}

const buildIDF = (docs) => {
  const idf = {}
  const N = docs.length
  const allTerms = new Set(docs.flatMap(d => Object.keys(d)))
  allTerms.forEach(term => {
    const df = docs.filter(d => term in d).length
    idf[term] = Math.log((N + 1) / (df + 1)) + 1
  })
  return idf
}

const buildTFIDF = (tf, idf) => {
  const vec = {}
  Object.entries(tf).forEach(([t, v]) => {
    vec[t] = v * (idf[t] || 1)
  })
  return vec
}

const cosineSimilarity = (vecA, vecB) => {
  const keysA = Object.keys(vecA)
  if (!keysA.length) return 0

  const dot = keysA.reduce((sum, k) => sum + (vecA[k] * (vecB[k] || 0)), 0)
  const magA = Math.sqrt(keysA.reduce((sum, k) => sum + vecA[k] ** 2, 0))
  const magB = Math.sqrt(Object.values(vecB).reduce((sum, v) => sum + v ** 2, 0))

  if (!magA || !magB) return 0
  return dot / (magA * magB)
}

/**
 * Compute semantic similarity between resume and JD.
 * Returns score 0–100.
 */
const computeSemanticScore = (resumeText, jdText) => {
  if (!resumeText || !jdText) return 0

  const resumeTokens = tokenise(resumeText)
  const jdTokens = tokenise(jdText)

  if (!resumeTokens.length || !jdTokens.length) return 0

  const tfResume = buildTF(resumeTokens)
  const tfJD = buildTF(jdTokens)
  const idf = buildIDF([tfResume, tfJD])

  const vecResume = buildTFIDF(tfResume, idf)
  const vecJD = buildTFIDF(tfJD, idf)

  const raw = cosineSimilarity(vecResume, vecJD)

  // Scale: cosine similarity between resume/JD typically 0.05–0.55
  // Map to 0–100 with a realistic curve
  const scaled = Math.min(100, Math.round(raw * 220))
  return Math.max(0, scaled)
}

/**
 * Extract domain/role from JD text
 */
const extractDomain = (jdText) => {
  const lower = jdText.toLowerCase()
  if (/machine learning|ml engineer|data scientist|ai engineer|deep learning/.test(lower)) return 'AI/ML'
  if (/data analyst|business analyst|power bi|tableau|data visualization/.test(lower)) return 'Data'
  if (/backend|node\.js|django|spring|api developer|server.side/.test(lower)) return 'Backend'
  if (/frontend|react developer|vue|angular|ui developer/.test(lower)) return 'Frontend'
  if (/full.?stack|mern|mean|full stack/.test(lower)) return 'Full Stack'
  if (/devops|cloud|aws|kubernetes|infrastructure/.test(lower)) return 'DevOps'
  if (/mobile|android|ios|react native|flutter/.test(lower)) return 'Mobile'
  return 'Software Engineering'
}

/**
 * Compute domain alignment score
 * How well the resume domain matches the JD domain
 */
const computeDomainAlignment = (resumeText, jdText, resumeSkills) => {
  const jdDomain = extractDomain(jdText)
  const lower = resumeText.toLowerCase()

  const domainSignals = {
    'AI/ML': ['machine learning','tensorflow','pytorch','scikit','deep learning','neural','nlp','model'],
    'Data': ['sql','pandas','tableau','power bi','analysis','excel','statistics','visualization'],
    'Backend': ['node.js','express','api','database','server','django','flask','rest'],
    'Frontend': ['react','css','html','javascript','ui','component','responsive','tailwind'],
    'Full Stack': ['react','node','mongodb','express','full stack','mern','mean'],
    'DevOps': ['docker','kubernetes','aws','ci/cd','pipeline','terraform','jenkins'],
    'Mobile': ['android','ios','react native','flutter','mobile','swift','kotlin'],
    'Software Engineering': ['algorithm','data structure','oop','design pattern','system design'],
  }

  const signals = domainSignals[jdDomain] || domainSignals['Software Engineering']
  const hits = signals.filter(s => lower.includes(s)).length
  return Math.min(100, Math.round((hits / signals.length) * 100))
}

module.exports = { computeSemanticScore, extractDomain, computeDomainAlignment }
