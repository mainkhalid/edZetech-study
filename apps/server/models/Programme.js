const mongoose = require('mongoose');

const programmeSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Programme name is required'],
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: [true, 'Programme code is required'],
    unique: true,
    uppercase: true,
    trim: true
  },
  school: {
    type: String,
    required: [true, 'School is required'],
    enum: ['ict', 'business', 'engineering', 'health', 'education'],
    index: true
  },
  level: {
    type: String,
    enum: ['Certificate', 'Diploma', 'Degree', 'Masters', 'Doctorate', 'Professional Certification'],
    required: [true, 'Programme level is required'],
    index: true
  },
  
  // Entry Requirements
  meanGrade: {
    type: String,
    trim: true
  },
  
  // Delivery Information
  campuses: {
    type: String,
    trim: true
  },
  modes: {
    type: String,
    default: 'Full time, Part time, E-Learning',
    trim: true
  },
  
  // Program Content
  description: {
    type: String,
    trim: true
  },
  careers: [{
    type: String,
    trim: true
  }],
  goal: {
    type: String,
    trim: true
  },
  

  duration: {
    years: {
      type: Number,
      min: 1
    },
    semesters: {
      type: Number,
      min: 1
    }
  },
  units: [{
    code: {
      type: String,
      trim: true
    },
    name: {
      type: String,
      trim: true
    },
    credits: {
      type: Number,
      min: 1
    },
    semester: {
      type: Number,
      min: 1
    },
    isCore: {
      type: Boolean,
      default: true
    },
    prerequisites: [String],
    description: String
  }],
  feeStructure: [{
    semester: {
      type: Number,
      min: 1
    },
    tuitionFee: {
      type: Number,
      min: 0
    },
    examFee: {
      type: Number,
      default: 0
    },
    activityFee: {
      type: Number,
      default: 0
    },
    otherFees: {
      type: Number,
      default: 0
    },
    totalFee: {
      type: Number
    }
  }],
  careerPaths: [{
    title: {
      type: String,
      trim: true
    },
    description: String,
    averageSalary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'KES'
      }
    },
    jobOutlook: String,
    requiredSkills: [String]
  }],
  entryRequirements: {
    minimumGrade: String,
    specificSubjects: [{
      subject: String,
      minimumGrade: String
    }],
    otherRequirements: [String]
  },
  intakeMonths: [{
    type: String,
    enum: ['January', 'May', 'September']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  studyMode: [{
    type: String,
    enum: ['Full-time', 'Part-time', 'E-Learning', 'Evening', 'Weekend']
  }],
  accreditation: [String],
  highlights: [String]
}, {
  timestamps: true
});

// Indexes
programmeSchema.index({ name: 'text', description: 'text' });
programmeSchema.index({ school: 1, level: 1 });
programmeSchema.index({ level: 1, isActive: 1 });

// Virtual for total programme cost
programmeSchema.virtual('totalProgrammeCost').get(function() {
  if (!this.feeStructure || this.feeStructure.length === 0) return 0;
  return this.feeStructure.reduce((total, fee) => total + (fee.totalFee || 0), 0);
});

// Virtual for total credits
programmeSchema.virtual('totalCredits').get(function() {
  if (!this.units || this.units.length === 0) return 0;
  return this.units.reduce((total, unit) => total + (unit.credits || 0), 0);
});

// Methods
programmeSchema.methods.getFeeForSemester = function(semester) {
  return this.feeStructure.find(fee => fee.semester === semester);
};

programmeSchema.methods.getUnitsForSemester = function(semester) {
  return this.units.filter(unit => unit.semester === semester);
};

programmeSchema.set('toJSON', { virtuals: true });
programmeSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Programme', programmeSchema);