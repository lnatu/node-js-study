const AppError = require('./../utils/AppError');

const handleJWTError = () =>
  new AppError('Invalid token. Please login again', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please login again', 401);

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  console.log(value);
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  // Render website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // Operational, trusted error, send to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    // Programming or other unknown error, don't leak detail
    // 1. Log error
    console.log('ERROR', err);

    // 2. Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }

  // Render website
  if (err.isOperational) {
    // Operational, trusted error, send to client
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      message: err.message
    });
  }
  // Programming or other unknown error, don't leak detail
  // 1. Log error
  console.log('ERROR', err);

  // 2. Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    message: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const env = process.env.NODE_ENV.trim();

  if (env === 'development') {
    sendErrorDev(err, req, res);
  } else if (env === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    if (error.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (error.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, req, res);
  }
};
