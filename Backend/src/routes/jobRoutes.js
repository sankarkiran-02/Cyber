const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const validateRequest = require('../middleware/validationMiddleware');
const jobValidationSchema = require('../validations/jobValidation');

// Create Job Route
router.post(
  '/', 
  validateRequest(jobValidationSchema), 
  jobController.createJob
);

// Get All Jobs Route
router.get('/', jobController.getAllJobs);

// Get Job by ID Route
router.get('/:id', jobController.getJobById);

// Update Job Route
router.put(
  '/:id', 
  validateRequest(jobValidationSchema), 
  jobController.updateJob
);

// Delete Job Route
router.delete('/:id', jobController.deleteJob);

module.exports = router;