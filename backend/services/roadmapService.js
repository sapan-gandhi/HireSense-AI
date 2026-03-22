/**
 * Generate a 4-week learning roadmap from missing skills.
 */
const generateRoadmap = (missingSkills = [], targetRole = '') => {
  const weeks = 4
  const chunks = chunkArray(missingSkills, Math.ceil(missingSkills.length / weeks) || 1)

  const weekGoals = [
    'Foundation & Core Concepts',
    'Intermediate Skills & Projects',
    'Advanced Patterns & Best Practices',
    'Portfolio Finalisation & Interview Prep',
  ]

  const weekTasks = [
    `Build a simple ${targetRole} starter project applying the core concepts from week 1`,
    `Extend your project by integrating the intermediate skills and building real features`,
    `Refactor your project with advanced patterns, write tests, and optimise performance`,
    `Deploy your project live, write a README, push to GitHub, and do 2 mock interviews`,
  ]

  return weekGoals.map((goal, i) => {
    const topics = chunks[i] && chunks[i].length > 0
      ? chunks[i]
      : getFallbackTopics(targetRole, i)

    return {
      week: i + 1,
      goal,
      topics: topics.slice(0, 4),
      task: weekTasks[i],
    }
  })
}

const getFallbackTopics = (role, weekIndex) => {
  const fallbacks = {
    'Frontend Developer': [
      ['HTML5 semantics', 'CSS Flexbox & Grid', 'JavaScript ES6+', 'Responsive layouts'],
      ['React components', 'useState & useEffect', 'React Router', 'API integration'],
      ['Redux / Zustand', 'Performance optimisation', 'Accessibility (a11y)', 'Testing with Jest'],
      ['Deployment on Vercel', 'Portfolio polish', 'GitHub README', 'Mock interviews'],
    ],
    'Backend Developer': [
      ['Node.js fundamentals', 'Express routing', 'REST API design', 'Error handling'],
      ['MongoDB CRUD', 'Mongoose models', 'Authentication with JWT', 'Middleware'],
      ['Docker basics', 'Environment variables', 'API security', 'Rate limiting'],
      ['Deploy on Railway', 'API documentation', 'Postman testing', 'Mock interviews'],
    ],
    'Full Stack Developer': [
      ['React + Node.js setup', 'REST API with Express', 'MongoDB Atlas', 'CORS & env config'],
      ['CRUD operations end-to-end', 'JWT auth full stack', 'State management', 'Form validation'],
      ['Deploy frontend (Vercel)', 'Deploy backend (Railway)', 'Error boundaries', 'Loading states'],
      ['Portfolio project polish', 'GitHub profile', 'Code review practice', 'Mock interviews'],
    ],
    'Data Analyst': [
      ['Python basics', 'Pandas DataFrames', 'NumPy arrays', 'Data cleaning'],
      ['SQL queries', 'GROUP BY & JOINs', 'Matplotlib charts', 'EDA techniques'],
      ['Tableau / Power BI', 'Statistics fundamentals', 'A/B testing concepts', 'Dashboard design'],
      ['Kaggle project', 'Portfolio notebook', 'GitHub README', 'Mock interviews'],
    ],
    'AI/ML Engineer': [
      ['Python for ML', 'Scikit-learn basics', 'Data preprocessing', 'Feature engineering'],
      ['Supervised learning', 'Model evaluation metrics', 'Cross-validation', 'Hyperparameter tuning'],
      ['Neural networks', 'TensorFlow / PyTorch intro', 'NLP basics', 'Deep learning fundamentals'],
      ['End-to-end ML project', 'Model deployment (FastAPI)', 'GitHub portfolio', 'Mock interviews'],
    ],
  }

  const roleData = fallbacks[role] || fallbacks['Full Stack Developer']
  return roleData[weekIndex] || roleData[0]
}

const chunkArray = (arr, size) => {
  const result = []
  for (let i = 0; i < 4; i++) {
    result.push(arr.slice(i * size, (i + 1) * size))
  }
  return result
}

module.exports = { generateRoadmap }
