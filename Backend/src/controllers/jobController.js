const Job = require('../models/Job');
const { catchAsync, NotFoundError, ValidationError } = require('../utils/errorHandler');

class JobController {
  // Create a new job
  async createJob(req, res) {
    try {
      // Set the postedAt time explicitly
      req.body.postedAt = new Date();
      
      const newJob = new Job(req.body);
      const savedJob = await newJob.save();
      
      res.status(201).json({
        success: true,
        data: savedJob
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get all jobs with filtering and pagination
  async getAllJobs(req, res) {
    try {
      const { 
        page = 1, 
        limit = 10, 
        jobTitle, 
        location, 
        jobType, 
        minSalary, 
        maxSalary 
      } = req.query;

      // Build filter object
      const filter = {};
      if (jobTitle) filter.$text = { $search: jobTitle };
      if (location) filter.location = { $regex: location, $options: 'i' };
      if (jobType) filter.jobType = jobType;
      if (minSalary || maxSalary) {
        filter['salaryRange.min'] = { 
          ...(minSalary && { $gte: Number(minSalary) }),
          ...(maxSalary && { $lte: Number(maxSalary) })
        };
      }

      // Fetch jobs sorted by most recent
      const jobs = await Job.find(filter)
        .limit(Number(limit))
        .skip((page - 1) * limit)
        .sort({ postedAt: -1 }); // Sort by most recent first

      const total = await Job.countDocuments(filter);

      res.json({
        success: true,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        data: jobs
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Get job by ID
  getJobById = catchAsync(async (req, res, next) => {
    const job = await Job.findById(req.params.id);
    
    // Throw custom errors
    if (!job) {
      throw new NotFoundError('Job');
    }

    // Validate additional conditions
    if (!job.isActive) {
      throw new ValidationError('This job is no longer active');
    }

    res.status(200).json({
      status: 'success',
      data: job
    });
  });

  // Update job
  async updateJob(req, res) {
    try {
      const updatedJob = await Job.findByIdAndUpdate(
        req.params.id, 
        req.body, 
        { new: true, runValidators: true }
      );

      if (!updatedJob) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }

      res.json({
        success: true,
        data: updatedJob
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Delete job
  async deleteJob(req, res) {
    try {
      const deletedJob = await Job.findByIdAndDelete(req.params.id);
  
      if (!deletedJob) {
        return res.status(404).json({
          success: false,
          message: 'Job not found'
        });
      }
  
      res.json({
        success: true,
        message: 'Job deleted successfully',
        data: deletedJob
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new JobController();