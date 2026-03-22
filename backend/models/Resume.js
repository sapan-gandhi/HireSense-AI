const mongoose = require('mongoose')

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  originalFileName: {
    type: String,
    required: true,
  },
  resumeText: {
    type: String,
    required: true,
  },
  extractedSkills: [{
    type: String,
  }],
}, { timestamps: true })

module.exports = mongoose.model('Resume', resumeSchema)
