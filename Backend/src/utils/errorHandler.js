// src/utils/errorHandler.js

class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Centralized error handling middleware
  const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
  
    // Detailed error response for different error types
    const sendErrorDev = (err, res) => {
      res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
      });
    };
  
    const sendErrorProd = (err, res) => {
      // Operational, trusted error: send message to client
      if (err.isOperational) {
        res.status(err.statusCode).json({
          status: err.status,
          message: err.message
        });
      } else {
        // Programming or unknown error: don't leak error details
        console.error('UNHANDLED ERROR 💥', err);
        res.status(500).json({
          status: 'error',
          message: 'Something went very wrong!'
        });
      }
    };
  
    // Handle specific Mongoose validation errors
    const handleValidationErrorDB = (err) => {
      const errors = Object.values(err.errors).map(el => el.message);
      const message = `Invalid input data. ${errors.join('. ')}`;
      return new AppError(message, 400);
    };
  
    // Handle duplicate key errors
    const handleDuplicateFieldsDB = (err) => {
      const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
      const message = `Duplicate field value: ${value}. Please use another value!`;
      return new AppError(message, 400);
    };
  
    // Handle invalid MongoDB ID error
    const handleCastErrorDB = (err) => {
      const message = `Invalid ${err.path}: ${err.value}.`;
      return new AppError(message, 400);
    };
  
    // Handle JWT errors
    const handleJWTError = () => 
      new AppError('Invalid token. Please log in again!', 401);
  
    const handleJWTExpiredError = () => 
      new AppError('Your token has expired! Please log in again.', 401);
  
    // Error handling logic based on environment
    if (process.env.NODE_ENV === 'development') {
      sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
      let error = { ...err };
      error.message = err.message;
  
      // Handle specific error types
      if (err.name === 'ValidationError') error = handleValidationErrorDB(error);
      if (err.code === 11000) error = handleDuplicateFieldsDB(error);
      if (err.name === 'CastError') error = handleCastErrorDB(error);
      if (err.name === 'JsonWebTokenError') error = handleJWTError();
      if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
      sendErrorProd(error, res);
    }
  };
  
  // Async error wrapper to handle async route errors
  const catchAsync = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
  
  // Custom error types
  class ValidationError extends AppError {
    constructor(message) {
      super(message, 400);
    }
  }
  
  class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
      super(`${resource} not found`, 404);
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
      super(message, 401);
    }
  }
  
  class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
      super(message, 403);
    }
  }
  
  module.exports = {
    AppError,
    errorHandler,
    catchAsync,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
  };