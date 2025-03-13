const Joi = require('joi');

const jobValidationSchema = Joi.object({
  jobTitle: Joi.string().trim().required(),
  companyName: Joi.string().trim().required(),
  location: Joi.string().trim().required(),
  jobType: Joi.string().valid('Full-time', 'Part-time', 'Contract', 'Internship').required(),
  salaryRange: Joi.object({
    min: Joi.number().required(),
    max: Joi.number().required()
  }).required(),
  jobDescription: Joi.string().required(),
  requirements: Joi.array().items(Joi.string()).optional(),
  responsibilities: Joi.array().items(Joi.string()).optional(),
  applicationDeadline: Joi.date().iso().required()
});

module.exports = jobValidationSchema;