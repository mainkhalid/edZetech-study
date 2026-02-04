const mongoose = require('mongoose');

// Session sub-schema (embedded in timetable)
const sessionSchema = new mongoose.Schema({
  unitCode: {
    type: String,
    required: true
  },
  unitTitle: {
    type: String,
    default: 'N/A'
  },
  lecName: {
    type: String,
    default: 'Staff'
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  room: {
    type: String,
    default: 'ONLINE'
  }
}, { _id: false }); // Don't create _id for sub-documents

// Main Timetable schema
const timetableSchema = new mongoose.Schema({
  school: {
    type: String,
    required: true,
    index: true
  },
  schoolName: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true,
    index: true
  },
  semester: {
    type: String,
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number
  },
  sessions: [sessionSchema], 
  notes: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['published', 'archived', 'draft'],
    default: 'published',
    index: true
  },
  version: {
    type: Number,
    default: 1
  },
  uploadedBy: {
    type: String,
    default: 'admin'
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  metadata: {
    totalSessions: Number,
    uniqueUnits: [String],
    lecturers: [String],
    rooms: [String],
    parsedRows: Number,
    errorRows: Number,
    warnings: [String]
  }
}, { 
  timestamps: true 
});

// Compound index for faster queries
timetableSchema.index({ school: 1, academicYear: 1, semester: 1, status: 1 });

// Instance methods (if needed)
timetableSchema.methods.getSessionsByUnit = function(unitCode) {
  return this.sessions.filter(s => s.unitCode === unitCode.toUpperCase());
};

timetableSchema.methods.getSessionsByLecturer = function(lecturerName) {
  return this.sessions.filter(s => 
    s.lecName.toLowerCase().includes(lecturerName.toLowerCase())
  );
};

timetableSchema.methods.getSessionsByDay = function(day) {
  return this.sessions.filter(s => s.day === day);
};

timetableSchema.methods.getSessionsByRoom = function(room) {
  return this.sessions.filter(s => s.room === room);
};

// Static methods (if needed)
timetableSchema.statics.findBySchoolAndPeriod = function(school, academicYear, semester) {
  return this.findOne({ 
    school, 
    academicYear, 
    semester, 
    status: 'published' 
  });
};

timetableSchema.statics.findByUnit = function(unitCode, academicYear, semester) {
  const query = { 
    'sessions.unitCode': unitCode.toUpperCase(),
    status: 'published' 
  };
  if (academicYear) query.academicYear = academicYear;
  if (semester) query.semester = semester;
  return this.findOne(query);
};

timetableSchema.statics.findByLecturer = function(lecturerName, academicYear, semester) {
  const query = { 
    status: 'published'
  };
  if (academicYear) query.academicYear = academicYear;
  if (semester) query.semester = semester;
  
  return this.find(query);
};

module.exports = mongoose.model('Timetable', timetableSchema);