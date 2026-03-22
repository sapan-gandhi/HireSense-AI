const Resume = require('../models/Resume')
const { asyncHandler } = require('../middleware/errorHandler')
const { extractTextFromBuffer } = require('../services/pdfService')
const { extractSkills } = require('../services/resumeAnalysisService')

// POST /api/resume/upload
exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' })
  }

  const { buffer, originalname, mimetype } = req.file

  // Extract text
  let resumeText = ''
  if (mimetype === 'application/pdf' || originalname.endsWith('.pdf')) {
    resumeText = await extractTextFromBuffer(buffer)
  } else {
    resumeText = buffer.toString('utf-8')
  }

  if (!resumeText || resumeText.trim().length < 20) {
    return res.status(400).json({ success: false, message: 'Could not extract text from the file. Please try a different format.' })
  }

  // Extract skills
  const extractedSkills = extractSkills(resumeText)

  // Save
  const resume = await Resume.create({
    userId: req.user._id,
    originalFileName: originalname,
    resumeText,
    extractedSkills,
  })

  res.status(201).json({ success: true, resume })
})
