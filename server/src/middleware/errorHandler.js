const winston = require('winston');
const { createErrorResponse } = require('../utils/response.utils');

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json(createErrorResponse(err.message));
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json(createErrorResponse('Unauthorized'));
  }

  // Handle mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json(createErrorResponse('Duplicate field value entered'));
  }

  // Handle mongoose CastError
  if (err.name === 'CastError') {
    return res.status(400).json(createErrorResponse('Invalid resource ID'));
  }

  // Default to 500 server error
  res.status(500).json(createErrorResponse('Server Error'));
};

module.exports = errorHandler;