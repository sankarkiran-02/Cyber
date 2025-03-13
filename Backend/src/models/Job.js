const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobTitle: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    required: true
  },
  salaryRange: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  jobDescription: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true
  },
  responsibilities: {
    type: [String],
    required: true
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create text index for search functionality
JobSchema.index({
  jobTitle: 'text',
  companyName: 'text',
  location: 'text'
});

module.exports = mongoose.model('Job', JobSchema);