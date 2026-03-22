let pdfParse
try {
  pdfParse = require('pdf-parse')
} catch (e) {
  pdfParse = null
}

/**
 * Extract text from a PDF buffer.
 * Falls back to raw buffer text if pdf-parse is unavailable.
 */
const extractTextFromBuffer = async (buffer) => {
  if (pdfParse) {
    try {
      const data = await pdfParse(buffer)
      return data.text || ''
    } catch (err) {
      console.error('pdf-parse error:', err.message)
      return buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ')
    }
  }
  // Fallback: decode as utf-8
  return buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ')
}

module.exports = { extractTextFromBuffer }
