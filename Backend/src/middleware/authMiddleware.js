const { UnauthorizedError } = require('../utils/errorHandler');

const authMiddleware = (req, res, next) => {
  try {
    // Authentication logic
    const token = req.headers.authorization;
    
    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token logic
    const decoded = verifyToken(token);
    
    if (!decoded) {
      throw new UnauthorizedError('Invalid token');
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};