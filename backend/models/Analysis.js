const mongoose = require('mongoose')

const careerMatchSchema = new mongoose.Schema({
  role: String, score: Number, match: String,
}, { _id: false })

const roadmapWeekSchema = new mongoose.Schema({
  week: Number, goal: String, topics: [String], task: String,
}, { _id: false })

const interviewQASchema = new mongoose.Schema({
  question: { type: String, default: '' },
  answer:   { type: String, default: '' },
}, { _id: false })

const interviewQuestionsSchema = new mongoose.Schema({
  technical:  [interviewQASchema],
  conceptual: [interviewQASchema],
  hr:         [interviewQASchema],
}, { _id: false })

// ── JD Intelligence (stored after JD Matcher is run) ──────
const riskFactorSchema = new mongoose.Schema({
  level: String, factor: String,
}, { _id: false })

const recruiterSuggestionSchema = new mongoose.Schema({
  priority: String, category: String, suggestion: String,
}, { _id: false })

const shortlistBreakdownSchema = new mongoose.Schema({
  skillMatch: Number, semanticScore: Number, domainAlignment: Number,
  projectQuality: Number, achievementScore: Number, resumeScore: Number, missingPenalty: Number,
}, { _id: false })

const atsCoverageSchema = new mongoose.Schema({
  totalKeywords: Number, coveredKeywords: Number,
  missingKeywords: [String], coveragePct: Number, grade: String,
}, { _id: false })

const explanationSchema = new mongoose.Schema({
  verdict:          { type: String, default: '' },
  strengths:        [String],
  weaknesses:       [String],
  riskFactors:      [riskFactorSchema],
  shortlistReasons: [String],
  rejectionReasons: [String],
}, { _id: false })

const jdIntelligenceSchema = new mongoose.Schema({
  roleTitle:              { type: String, default: '' },
  experienceRequired:     { type: String, default: '' },
  matchScore:             { type: Number, default: 0 },
  semanticScore:          { type: Number, default: 0 },
  domainAlignment:        { type: Number, default: 0 },
  shortlistProbability:   { type: Number, default: 0 },
  confidenceRange:        { type: String, default: '' },
  shortlistTier:          { type: String, default: '' },
  shortlistTierColor:     { type: String, default: '' },
  shortlistBreakdown:     shortlistBreakdownSchema,
  matchedSkills:          [String],
  missingSkills:          [String],
  criticalMissingSkills:  [String],
  atsCoverage:            atsCoverageSchema,
  explanation:            explanationSchema,
  recruiterSuggestions:   [recruiterSuggestionSchema],
  lastUpdated:            { type: Date, default: Date.now },
}, { _id: false })

const analysisSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  resumeId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Resume', required: true },
  resumeScore:     { type: Number, default: 0 },
  scoreLabel:      { type: String, default: 'Fair' },
  scoreDesc:       { type: String, default: '' },
  extractedSkills: [String],
  strengths:       [String],
  weaknesses:      [String],
  suggestions:     [String],
  careerMatches:   [careerMatchSchema],
  selectedRole:    { type: String, default: '' },
  matchedSkills:   [String],
  missingSkills:   [String],
  readinessScore:  { type: Number, default: 0 },
  roadmap:         [roadmapWeekSchema],
  interviewQuestions: interviewQuestionsSchema,
  // ── JD Intelligence stored here after JD Matcher runs ──
  jdIntelligence:  { type: jdIntelligenceSchema, default: null },
}, { timestamps: true })

module.exports = mongoose.model('Analysis', analysisSchema)
