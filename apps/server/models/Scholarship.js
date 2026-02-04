const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Scholarship name is required'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters']
  },
  provider: {
    type: String,
    required: [true, 'Provider name is required'],
    trim: true
  },
  amount: {
    type: String,
    required: [true, 'Scholarship amount is required'],
    trim: true
  },
  deadline: {
    type: Date,
    required: [true, 'Application deadline is required']
  },
  eligibility: {
    type: String,
    required: true,
    enum: [
      'Open to All',
      'Undergraduate Only',
      'Graduate Only',
      'International Students',
      'Domestic Students Only',
      'STEM Students',
      'Arts & Humanities',
      'First Year Students',
      'Final Year Students',
      'Need-Based',
      'Merit-Based'
    ],
    default: 'Open to All'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  requirements: [{
    type: String,
    trim: true
  }],
  thumbnail: {
    url: {
      type: String,
      default: ''
    },
    publicId: {
      type: String,
      default: ''
    },
    width: Number,
    height: Number,
    format: String,
    bytes: Number
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date
  },
  applicationsOpen: {
    type: Boolean,
    default: true
  },
  applicationUrl: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
scholarshipSchema.index({ deadline: 1 });
scholarshipSchema.index({ eligibility: 1 });
scholarshipSchema.index({ published: 1 });
scholarshipSchema.index({ applicationsOpen: 1 });

// Instance methods
scholarshipSchema.methods.publish = function() {
  this.published = true;
  this.publishedAt = new Date();
  return this.save();
};

scholarshipSchema.methods.unpublish = function() {
  this.published = false;
  this.publishedAt = null;
  return this.save();
};

scholarshipSchema.methods.closeApplications = function() {
  this.applicationsOpen = false;
  return this.save();
};

scholarshipSchema.methods.openApplications = function() {
  this.applicationsOpen = true;
  return this.save();
};

// Static methods
scholarshipSchema.statics.findActive = function() {
  return this.find({
    published: true,
    applicationsOpen: true,
    deadline: { $gte: new Date() }
  }).sort({ deadline: 1 });
};

scholarshipSchema.statics.findByEligibility = function(eligibility) {
  return this.find({
    eligibility,
    published: true,
    applicationsOpen: true
  }).sort({ deadline: 1 });
};

scholarshipSchema.statics.findExpiringSoon = function(days = 7) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return this.find({
    published: true,
    applicationsOpen: true,
    deadline: {
      $gte: new Date(),
      $lte: futureDate
    }
  }).sort({ deadline: 1 });
};

module.exports = mongoose.model('Scholarship', scholarshipSchema);