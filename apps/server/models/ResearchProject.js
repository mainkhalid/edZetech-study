const mongoose = require('mongoose');

const ResearchProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  lead: { type: String, required: true },
  department: { type: String, required: true },
  funding: { type: String },
  status: { type: String, default: 'ongoing' },
  abstract: { type: String },
  milestones: { type: Array, default: [] },
  tags: { type: Array, default: [] },
  collaborators: { type: Array, default: [] },
  thumbnail: {
    url: String,
    publicId: String,
    width: Number,
    height: Number,
    format: String,
    bytes: Number
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  published: { type: Boolean, default: false }
}, {
  timestamps: true
});


ResearchProjectSchema.pre('save', async function() {
  if (this.title) {
    this.title = this.title.trim();
  }

});

ResearchProjectSchema.pre('validate', async function() {
  // Example: ensure milestones is always an array
  if (!Array.isArray(this.milestones)) {
    this.milestones = [];
  }
});


ResearchProjectSchema.post('save', async function(doc) {
  console.log('Research project saved:', doc._id);
  
});

ResearchProjectSchema.methods.publish = async function() {
  this.published = true;
  await this.save(); 
};

ResearchProjectSchema.methods.unpublish = async function() {
  this.published = false;
  await this.save();
};

ResearchProjectSchema.statics.findActive = function() {
  return this.find({ published: true });
};

ResearchProjectSchema.statics.findByDepartment = function(dept) {
  return this.find({ department: dept });
};

module.exports = mongoose.model('ResearchProject', ResearchProjectSchema);
