const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'School name is required'],
    unique: true,
    trim: true
  },
  code: {
    type: String,
    required: [true, 'School code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dean: {
    name: String,
    email: String,
    phone: String
  },
  contact: {
    email: String,
    phone: String,
    office: String
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
schoolSchema.index({ name: 1, code: 1 });

// Virtual for programmes count
schoolSchema.virtual('programmes', {
  ref: 'Programme',
  localField: '_id',
  foreignField: 'school'
});

schoolSchema.set('toJSON', { virtuals: true });
schoolSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('School', schoolSchema);

