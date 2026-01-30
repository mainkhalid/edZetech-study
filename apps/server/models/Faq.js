const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Admissions', 'Programs', 'Fees', 'Campus Life', 'Technical'],
    trim: true
  },
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    maxlength: [500, 'Question cannot exceed 500 characters']
  },
  answer: {
    type: String,
    required: [true, 'Answer is required'],
    trim: true,
    maxlength: [2000, 'Answer cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  }
}, {
  timestamps: true
});

// Index for faster search
faqSchema.index({ question: 'text', answer: 'text' });
faqSchema.index({ category: 1, status: 1 });

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq;