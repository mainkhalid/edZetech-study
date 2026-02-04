const mongoose = require('mongoose');

const ClassDocumentSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    enum: ['ict', 'business', 'law', 'health', 'education']
  },
  academicYear: { type: String, required: true },
  semester: { type: String, required: true },

  feeStructureFile: {
    fileName: String,
    url: String
  },

  timetableFile: {
    fileName: String,
    url: String
  },

  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ClassDocument', ClassDocumentSchema)
