const axios = require('axios')

const SYSTEM_PROMPT = `You are an expert career counsellor and resume analyst AI.
Analyse the provided resume text and return ONLY valid JSON (no markdown, no backticks, no explanation) in exactly this structure:

{
  "resumeScore": <integer 0-100>,
  "scoreLabel": "<Excellent|Good|Fair|Needs Work>",
  "scoreDesc": "<one concise sentence about the score>",
  "extractedSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "careerMatches": [
    { "role": "<role>", "score": <integer 0-100>, "match": "<Top Match|Good Match|Possible Match>" },
    { "role": "<role>", "score": <integer 0-100>, "match": "<Top Match|Good Match|Possible Match>" },
    { "role": "<role>", "score": <integer 0-100>, "match": "<Top Match|Good Match|Possible Match>" }
  ],
  "bestRole": "<best role name>",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "readinessScore": <integer 0-100>,
  "roadmap": [
    { "week": 1, "goal": "<goal>", "topics": ["topic1", "topic2", "topic3"], "task": "<mini project task>" },
    { "week": 2, "goal": "<goal>", "topics": ["topic1", "topic2", "topic3"], "task": "<mini project task>" },
    { "week": 3, "goal": "<goal>", "topics": ["topic1", "topic2", "topic3"], "task": "<mini project task>" },
    { "week": 4, "goal": "<goal>", "topics": ["topic1", "topic2", "topic3"], "task": "<mini project task>" }
  ],
  "interviewQuestions": {
    "technical": ["q1", "q2", "q3", "q4", "q5"],
    "conceptual": ["q1", "q2", "q3"],
    "hr": ["q1", "q2", "q3"]
  }
}

Rules:
- Only pick career roles from: Frontend Developer, Backend Developer, Full Stack Developer, Data Analyst, AI/ML Engineer
- extractedSkills: list every technical skill found in the resume
- matchedSkills: skills from bestRole's required list that the candidate HAS
- missingSkills: skills from bestRole's required list that the candidate is MISSING
- roadmap weeks should focus on filling missingSkills progressively
- interviewQuestions should be tailored to bestRole
- Return ONLY the JSON object. Nothing else.`

/**
 * Call Claude API to perform full resume analysis.
 */
const analyzeResume = async (resumeText) => {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY not set')
  }

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: `Analyse this resume and return the JSON:\n\n${resumeText.slice(0, 4000)}`,
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      timeout: 30000,
    }
  )

  const raw = response.data.content
    .map(b => b.text || '')
    .join('')
    .replace(/```json|```/g, '')
    .trim()

  const parsed = JSON.parse(raw)

  // Normalise — make sure selectedRole is set
  parsed.selectedRole = parsed.bestRole
  return parsed
}

module.exports = { analyzeResume }
